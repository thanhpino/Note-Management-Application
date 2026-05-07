<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'avatar_url', 'is_verified', 
        'activation_token', 'reset_otp', 'reset_otp_expires_at', 'preferences'
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_verified' => 'boolean',
        'preferences' => 'array',
        'reset_otp_expires_at' => 'datetime',
    ];

    public function notes()
    {
        return $this->hasMany(Note::class, 'userId');
    }

    public function labels()
    {
        return $this->hasMany(Label::class, 'userId');
    }

    public function sharedNotes()
    {
        return $this->belongsToMany(Note::class, 'note_shares', 'user_id', 'note_id')
                    ->withPivot('permission');
    }
}
