<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Presence Channel để biết ai đang online trong Note
Broadcast::channel('note.{id}', function ($user, $id) {
    // Kiểm tra quyền (chủ sở hữu hoặc được share)
    $isOwner = \App\Models\Note::where('id', $id)->where('user_id', $user->id)->exists();
    $isShared = \DB::table('note_shares')->where('note_id', $id)->where('user_id', $user->id)->exists();

    if ($isOwner || $isShared) {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'avatar_url' => $user->avatar_url
        ];
    }
    return false;
});
