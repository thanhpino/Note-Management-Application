<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class UserController extends Controller
{
    public function profile(Request $request)
    {
        return response()->json([
            'id' => $request->user()->id,
            '_id' => (string)$request->user()->id,
            'name' => $request->user()->name ?? 'User',
            'displayName' => $request->user()->name ?? 'User',
            'email' => $request->user()->email,
            'avatar_url' => $request->user()->avatar_url,
            'avatarUrl' => $request->user()->avatar_url,
            'isActivated' => (bool)$request->user()->is_verified,
            'preferences' => $request->user()->preferences ?? ['darkMode' => false]
        ]);
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'nullable|string|max:255',
            'displayName' => 'nullable|string|max:255'
        ]);
        $user = $request->user();
        $newName = $request->name ?? $request->displayName;
        if ($newName) {
            $user->update(['name' => $newName]);
        }
        return response()->json($this->profile($request)->getData());
    }

    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|max:2048',
        ]);

        $user = $request->user();
        
        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            $upload = cloudinary()->upload($file->getRealPath());
            $user->update(['avatar_url' => $upload->getSecurePath()]);
        }

        return response()->json([
            'message' => 'Avatar updated successfully',
            'avatar_url' => $user->avatar_url
        ]);
    }

    public function updatePreferences(Request $request)
    {
        $user = $request->user();
        $user->update([
            'preferences' => $request->preferences
        ]);
        return response()->json(['message' => 'Preferences updated']);
    }
}
