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
            'is_verified' => (bool)$request->user()->is_verified,
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
        
        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => [
                'id' => $user->id,
                '_id' => (string)$user->id,
                'name' => $user->name ?? 'User',
                'displayName' => $user->name ?? 'User',
                'email' => $user->email,
                'avatar_url' => $user->avatar_url,
                'avatarUrl' => $user->avatar_url,
                'is_verified' => (bool)$user->is_verified,
                'isActivated' => (bool)$user->is_verified,
                'preferences' => $user->preferences ?? ['darkMode' => false]
            ]
        ]);
    }

    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'nullable|image|max:2048',
            'avatar_url' => 'nullable|string',
        ]);

        $user = $request->user();
        
        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            try {
                $upload = \CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary::upload($file->getRealPath());
                $url = $upload->getSecurePath();
                $user->update(['avatar_url' => $url]);
            } catch (\Exception $e) {
                \Log::error("Cloudinary Avatar Upload Error: " . $e->getMessage());
                return response()->json([
                    'message' => 'Failed to upload avatar. Check Cloudinary settings.',
                    'error' => $e->getMessage()
                ], 500);
            }
        } elseif ($request->has('avatar_url')) {
            $user->update(['avatar_url' => $request->avatar_url]);
        }

        return response()->json([
            'message' => 'Avatar updated successfully',
            'avatar_url' => $user->avatar_url,
            'user' => [
                'id' => $user->id,
                '_id' => (string)$user->id,
                'name' => $user->name ?? 'User',
                'displayName' => $user->name ?? 'User',
                'email' => $user->email,
                'avatar_url' => $user->avatar_url,
                'avatarUrl' => $user->avatar_url,
                'is_verified' => (bool)$user->is_verified,
                'isActivated' => (bool)$user->is_verified,
                'preferences' => $user->preferences ?? ['darkMode' => false]
            ]
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

    public function changePassword(Request $request)
    {
        $request->validate([
            'currentPassword' => 'required',
            'newPassword' => 'required|min:6',
        ]);

        $user = $request->user();

        if (!\Illuminate\Support\Facades\Hash::check($request->currentPassword, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 422);
        }

        $user->update([
            'password' => \Illuminate\Support\Facades\Hash::make($request->newPassword)
        ]);

        return response()->json(['message' => 'Password changed successfully']);
    }

    public function clearNotification(Request $request)
    {
        return response()->json(['message' => 'Notifications cleared']);
    }

    public function getCloudinarySignature(Request $request)
    {
        $timestamp = time();
        $apiSecret = env('CLOUDINARY_API_SECRET');
        $apiKey = env('CLOUDINARY_API_KEY');
        $cloudName = env('CLOUDINARY_CLOUD_NAME');

        if (!$apiSecret || !$apiKey || !$cloudName) {
            return response()->json(['message' => 'Cloudinary credentials missing'], 500);
        }

        // Params to sign (must be sorted alphabetically)
        // string format: folder=avatars&timestamp=123456789
        $stringToSign = "folder=avatars&timestamp={$timestamp}";
        $signature = sha1($stringToSign . $apiSecret);

        return response()->json([
            'signature' => $signature,
            'timestamp' => $timestamp,
            'api_key' => $apiKey,
            'cloud_name' => $cloudName,
            'folder' => 'avatars',
        ]);
    }
}
