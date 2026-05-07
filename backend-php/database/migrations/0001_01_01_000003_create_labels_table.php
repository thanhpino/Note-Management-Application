<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('labels', function (Blueprint $刻) {
            $刻->id();
            $刻->foreignId('user_id')->constrained()->onDelete('cascade');
            $刻->string('name');
            $刻->string('color')->nullable();
            $刻->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('labels');
    }
};
