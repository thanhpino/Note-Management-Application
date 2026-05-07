<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Events\NoteUpdated;

class NoteController extends Controller
{
    private function formatNote($note)
    {
        return [
            'id' => $note->id,
            '_id' => (string)$note->id,
            'userId' => (string)$note->user_id,
            'title' => $note->title ?? '',
            'content' => $note->content ?? '',
            'color' => $note->color ?? '',
            'isPinned' => (bool)$note->is_pinned,
            'images' => $note->images ?? [],
            'labels' => $note->labels ?? [],
            'notePasswordHash' => $note->note_password_hash,
            'updatedAt' => $note->updated_at ? $note->updated_at->toIso8601String() : now()->toIso8601String(),
            'createdAt' => $note->created_at ? $note->created_at->toIso8601String() : now()->toIso8601String(),
        ];
    }

    public function index(Request $request)
    {
        $notes = Note::where('user_id', $request->user()->id)
                     ->with('labels')
                     ->orderBy('is_pinned', 'desc')
                     ->orderBy('updated_at', 'desc')
                     ->get();
                     
        return response()->json($notes->map(fn($n) => $this->formatNote($n)));
    }

    public function sharedWithMe(Request $request)
    {
        $notes = $request->user()->sharedNotes()->with(['labels'])->get();
        return response()->json($notes->map(fn($n) => $this->formatNote($n)));
    }

    public function store(Request $request)
    {
        $note = Note::create([
            'user_id' => $request->user()->id,
            'title' => $request->title ?? '',
            'content' => $request->content ?? '',
            'color' => $request->color ?? '',
            'images' => []
        ]);
        
        if ($request->has('labels')) {
            $labelIds = collect($request->labels)->map(fn($id) => (int)$id)->filter()->toArray();
            $note->labels()->sync($labelIds);
        }
        
        return response()->json($this->formatNote($note), 201);
    }

    public function show(Request $request, $id)
    {
        $note = Note::with('labels')->findOrFail($id);
        return response()->json($this->formatNote($note));
    }

    public function update(Request $request, $id)
    {
        $note = Note::findOrFail($id);
        $data = $request->only(['title', 'content', 'color', 'isPinned', 'images']);
        
        if (isset($data['isPinned'])) {
            $data['is_pinned'] = $data['isPinned'];
        }

        $note->update($data);
        
        try {
            event(new NoteUpdated($this->formatNote($note)));
        } catch (\Exception $e) {}

        if ($request->has('labels')) {
            $labelIds = collect($request->labels)->map(fn($id) => (int)$id)->filter()->toArray();
            $note->labels()->sync($labelIds);
        }
        
        return response()->json($this->formatNote($note));
    }

    public function uploadImages(Request $request, $id)
    {
        $note = Note::findOrFail($id);
        $currentImages = is_array($note->images) ? $note->images : [];
        $newImages = [];

        if ($request->hasFile('images')) {
            $files = $request->file('images');
            $filesArray = is_array($files) ? $files : [$files];

            foreach ($filesArray as $file) {
                try {
                    // Dùng helper thay vì Facade để tránh lỗi "Class not found"
                    $upload = cloudinary()->upload($file->getRealPath());
                    $newImages[] = $upload->getSecurePath();
                } catch (\Exception $e) {
                    \Log::error("Cloudinary Error: " . $e->getMessage());
                }
            }
        }

        $updatedImages = array_merge($currentImages, $newImages);
        $note->update(['images' => $updatedImages]);

        return response()->json($this->formatNote($note));
    }

    public function removeImage(Request $request, $id)
    {
        $note = Note::findOrFail($id);
        $url = $request->query('url');
        $images = is_array($note->images) ? $note->images : [];
        $note->update(['images' => array_values(array_filter($images, fn($img) => $img !== $url))]);
        return response()->json($this->formatNote($note));
    }

    public function togglePin(Request $request, $id)
    {
        $note = Note::findOrFail($id);
        $note->update(['is_pinned' => !$note->is_pinned]);
        return response()->json($this->formatNote($note));
    }

    public function destroy(Request $request, $id)
    {
        Note::where('id', $id)->delete();
        return response()->json(['message' => 'Note deleted']);
    }

    public function verifyPassword(Request $request, $id)
    {
        $note = Note::findOrFail($id);
        if (Hash::check($request->password, $note->note_password_hash)) {
            return response()->json(['tempToken' => 'valid_token']);
        }
        return response()->json(['message' => 'Incorrect password'], 401);
    }
}
