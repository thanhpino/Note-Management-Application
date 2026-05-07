<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Label;
use Illuminate\Http\Request;

class LabelController extends Controller
{
    private function formatLabel($label)
    {
        return [
            '_id' => (string)$label->id,
            'id' => (int)$label->id,
            'name' => $label->name,
            'color' => $label->color ?? '#3b82f6',
            'userId' => (string)$label->user_id
        ];
    }

    public function index(Request $request)
    {
        $labels = Label::where('user_id', $request->user()->id)->get();
        return response()->json($labels->map(fn($l) => $this->formatLabel($l)));
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required']);
        $label = Label::create([
            'user_id' => $request->user()->id,
            'name' => $request->name,
            'color' => $request->color ?? '#3b82f6'
        ]);
        return response()->json($this->formatLabel($label), 201);
    }

    public function update(Request $request, $id)
    {
        $label = Label::where('id', $id)->where('user_id', $request->user()->id)->firstOrFail();
        $label->update($request->only(['name', 'color']));
        return response()->json($this->formatLabel($label));
    }

    public function destroy(Request $request, $id)
    {
        Label::where('id', $id)->where('user_id', $request->user()->id)->delete();
        return response()->json(['message' => 'Label deleted']);
    }
}
