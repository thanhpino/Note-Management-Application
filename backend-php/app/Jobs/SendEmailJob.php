<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $email;
    protected $subject;
    protected $htmlContent;

    public function __construct($email, $subject, $htmlContent)
    {
        $this->email = $email;
        $this->subject = $subject;
        $this->htmlContent = $htmlContent;
    }

    public function handle(): void
    {
        Mail::send([], [], function ($message) {
            $message->to($this->email)
                ->subject($this->subject)
                ->html($this->htmlContent);
        });
    }
}
