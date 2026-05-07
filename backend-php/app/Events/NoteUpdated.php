<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NoteUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $note;

    public function __construct($note)
    {
        $this->note = $note;
    }

    public function broadcastOn(): array
    {
        // Kiểm tra nếu $note là mảng thì lấy 'id', nếu là object thì lấy ->id
        $id = is_array($this->note) ? $this->note['id'] : $this->note->id;
        return [
            new PrivateChannel('note.' . $id),
        ];
    }

    public function broadcastAs()
    {
        return 'note.updated';
    }
}
