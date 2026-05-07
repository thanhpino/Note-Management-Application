<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Note extends Model
{
    protected $fillable = [
        'user_id', 'title', 'content', 'color', 'is_pinned', 
        'images', 'note_password_hash', 'is_archived', 'is_trashed'
    ];

    protected $casts = [
        'images' => 'array',
        'is_pinned' => 'boolean',
        'is_archived' => 'boolean',
        'is_trashed' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function labels(): BelongsToMany
    {
        return $this->belongsToMany(Label::class, 'note_label', 'note_id', 'label_id');
    }

    public function sharedWith(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'note_shares', 'note_id', 'user_id')
                    ->withPivot('permission');
    }
}
