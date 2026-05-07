<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Events\NoteUpdated;

class NoteController extends Controller
{
    public function copy(Request $request, $id)
    {
        $originalNote = Note::findOrFail($id);
        $user = $request->user();

        // Check if user has permission to see this note (owner or shared)
        if ($originalNote->user_id !== $user->id) {
            $isShared = \DB::table('note_shares')
                ->where('note_id', $id)
                ->where('user_id', $user->id)
                ->exists();

            if (!$isShared) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        // Create new copy
        $newNote = Note::create([
            'user_id' => $user->id,
            'title' => $originalNote->title . ' (Copy)',
            'content' => $originalNote->content,
            'color' => $originalNote->color,
            'images' => $originalNote->images, // Copy image array
            'is_password_protected' => false, // Don't copy password for simplicity
        ]);

        return response()->json($this->formatNote($newNote));
    }

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
            'labels' => $note->labels ? $note->labels->toArray() : [],
            'notePasswordHash' => $note->note_password_hash,
            'updatedAt' => $note->updated_at ? $note->updated_at->toIso8601String() : now()->toIso8601String(),
            'createdAt' => $note->created_at ? $note->created_at->toIso8601String() : now()->toIso8601String(),
        ];
    }

    public function index(Request $request)
    {
        $query = Note::where('user_id', $request->user()->id)->with('labels');

        // Lọc theo label nếu có truyền tham số ?label=id
        if ($request->has('label') && $request->label) {
            $labelId = $request->label;
            $query->whereHas('labels', function ($q) use ($labelId) {
                // Sử dụng labels.id để tránh mập mờ với notes.id
                $q->where('labels.id', $labelId);
            });
        }

        $notes = $query->orderBy('is_pinned', 'desc')
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
        $user = $request->user();

        // Kiểm tra quyền sở hữu hoặc quyền edit
        if ($note->user_id !== $user->id) {
            $share = \DB::table('note_shares')
                ->where('note_id', $note->id)
                ->where('user_id', $user->id)
                ->first();

            if (!$share || $share->permission !== 'edit') {
                return response()->json(['message' => 'You do not have permission to edit this note'], 403);
            }
        }

        $request->validate([
            'title' => 'nullable|string',
            'content' => 'nullable|string',
            'isPinned' => 'nullable|boolean',
            'color' => 'nullable|string',
            'labels' => 'nullable|array'
        ]);

        $updateData = [
            'title' => $request->title ?? $note->title,
            'content' => $request->content ?? $note->content,
            'is_pinned' => $request->has('isPinned') ? $request->isPinned : $note->is_pinned,
            'color' => $request->color ?? $note->color,
        ];

        $note->update($updateData);

        if ($request->has('labels')) {
            $labelIds = collect($request->labels)->map(fn($id) => (int)$id)->filter()->toArray();
            $note->labels()->sync($labelIds);
        }

        try {
            broadcast(new \App\Events\NoteUpdated($this->formatNote($note)))->toOthers();
        } catch (\Exception $e) {
            \Log::error("Broadcast failed: " . $e->getMessage());
        }

        return response()->json($this->formatNote($note));
    }

    public function uploadImages(Request $request, $id)
    {
        $note = Note::findOrFail($id);
        $currentImages = is_array($note->images) ? $note->images : [];
        $newImages = [];
        $errors = [];

        if ($request->hasFile('images')) {
            $files = $request->file('images');
            $filesArray = is_array($files) ? $files : [$files];

            foreach ($filesArray as $file) {
                try {
                    $upload = cloudinary()->upload($file->getRealPath(), [
                        'folder' => 'notes'
                    ]);
                    $newImages[] = $upload->getSecurePath();
                } catch (\Exception $e) {
                    \Log::error("Cloudinary Note Image Upload Error: " . $e->getMessage());
                    $errors[] = $file->getClientOriginalName() . ": " . $e->getMessage();
                }
            }
        }

        if (empty($newImages) && !empty($errors)) {
            return response()->json(['message' => 'Failed to upload images', 'errors' => $errors], 500);
        }

        $updatedImages = array_merge($currentImages, $newImages);
        $note->update(['images' => $updatedImages]);

        return response()->json([
            ...$this->formatNote($note),
            'uploadedCount' => count($newImages),
            'errors' => $errors
        ]);
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

    public function lock(Request $request, $id)
    {
        $note = Note::findOrFail($id);
        $request->validate([
            'password' => 'required_without:newPassword|string',
            'newPassword' => 'required_without:password|string',
            'currentPassword' => 'nullable|string'
        ]);
        
        $password = $request->password ?? $request->newPassword;

        // Nếu là đổi mật khẩu
        if ($note->is_password_protected && $request->has('currentPassword')) {
            if (!Hash::check($request->currentPassword, $note->note_password_hash)) {
                return response()->json(['message' => 'Current password is incorrect'], 422);
            }
        }

        $note->update([
            'is_password_protected' => true,
            'note_password_hash' => Hash::make($password)
        ]);

        return response()->json($this->formatNote($note));
    }

    public function unlock(Request $request, $id)
    {
        $note = Note::findOrFail($id);
        
        // Nếu xóa mật khẩu vĩnh viễn (mode remove)
        if ($request->isMethod('DELETE')) {
             // Có thể validate currentPassword ở đây nếu muốn bảo mật cao hơn
             $note->update([
                'is_password_protected' => false,
                'note_password_hash' => null
            ]);
            return response()->json($this->formatNote($note));
        }

        return response()->json($this->formatNote($note));
    }

    public function share(Request $request, $id)
    {
        $note = Note::findOrFail($id);
        $request->validate([
            'email' => 'required|email',
            'permission' => 'required|in:view,edit'
        ]);

        $userToShare = \App\Models\User::where('email', $request->email)->first();
        if (!$userToShare) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if ($userToShare->id === $request->user()->id) {
            return response()->json(['message' => 'Cannot share with yourself'], 400);
        }

        $note->sharedWith()->syncWithoutDetaching([
            $userToShare->id => ['permission' => $request->permission]
        ]);

        return response()->json(['message' => 'Note shared successfully']);
    }

    public function getShares($id)
    {
        $note = Note::findOrFail($id);
        $shares = $note->sharedWith()->get()->map(function ($user) {
            return [
                'userId' => [
                    'id' => $user->id,
                    '_id' => (string)$user->id,
                    'email' => $user->email,
                    'name' => $user->name,
                ],
                'permission' => $user->pivot->permission,
            ];
        });

        return response()->json($shares);
    }

    public function revokeShare(Request $request, $id, $userId)
    {
        $note = Note::findOrFail($id);
        $note->sharedWith()->detach($userId);
        return response()->json(['message' => 'Access revoked']);
    }

    public function verifyPassword(Request $request, $id)
    {
        $note = Note::findOrFail($id);
        if (Hash::check($request->password, $note->note_password_hash)) {
            // Trả về một token tạm thời hoặc đơn giản là success
            return response()->json(['success' => true]);
        }
        return response()->json(['message' => 'Incorrect password'], 401);
    }
}
