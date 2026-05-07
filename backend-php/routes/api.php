<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\NoteController;
use App\Http\Controllers\Api\LabelController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Broadcast;

// WebSocket Auth (Đưa vào đây để fix CORS)
Broadcast::routes(['middleware' => ['auth:sanctum']]);

// ====== Auth Routes ======
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/auth/activate/{token}', [AuthController::class, 'activateAccount']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/auth/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);

// ====== Protected Routes ======
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/resend-activation', [AuthController::class, 'resendActivation']);

    // Labels
    Route::get('/labels', [LabelController::class, 'index']);
    Route::post('/labels', [LabelController::class, 'store']);
    Route::put('/labels/{id}', [LabelController::class, 'update']);
    Route::delete('/labels/{id}', [LabelController::class, 'destroy']);

    // Notes - CRUD
    Route::get('/notes/shared-with-me', [NoteController::class, 'sharedWithMe']);
    Route::get('/notes', [NoteController::class, 'index']);
    Route::post('/notes', [NoteController::class, 'store']);
    Route::get('/notes/{id}', [NoteController::class, 'show']);
    Route::put('/notes/{id}', [NoteController::class, 'update']);
    Route::delete('/notes/{id}', [NoteController::class, 'destroy']);
    
    // Pin - Hỗ trợ cả PUT và POST cho chắc
    Route::match(['put', 'post'], '/notes/{id}/pin', [NoteController::class, 'togglePin']);

    // Lock/Unlock - Hỗ trợ POST/PUT/DELETE theo yêu cầu của Frontend
    Route::match(['post', 'put'], '/notes/{id}/lock', [NoteController::class, 'lockNote']);
    Route::delete('/notes/{id}/lock', [NoteController::class, 'removePassword']);
    Route::post('/notes/{id}/unlock', [NoteController::class, 'unlockNote']);
    Route::post('/notes/{id}/verify-password', [NoteController::class, 'verifyPassword']);

    // Share - Hỗ trợ cả /share và /shares
    Route::post('/notes/{id}/share', [NoteController::class, 'share']);
    Route::post('/notes/{id}/shares', [NoteController::class, 'share']);

    // Images
    Route::post('/notes/{id}/images', [NoteController::class, 'uploadImages']);
    Route::delete('/notes/{id}/images', [NoteController::class, 'removeImage']);

    // Users
    Route::get('/users/profile', [UserController::class, 'profile']);
    Route::put('/users/profile', [UserController::class, 'updateProfile']);
    Route::put('/users/profile/preferences', [UserController::class, 'updatePreferences']);
    Route::match(['put', 'post'], '/users/avatar', [UserController::class, 'updateAvatar']);
    Route::put('/users/clear-notification', [UserController::class, 'clearNotification']);
});
