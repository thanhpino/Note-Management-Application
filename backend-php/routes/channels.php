<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Cho phép người dùng lắng nghe các thay đổi của Note nếu họ đã login
Broadcast::channel('note.{id}', function ($user, $id) {
    return true; // Bro có thể viết logic check quyền ở đây, tạm thời để true để test cho nhanh
});
