<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $blueprint) {
            if (!Schema::hasColumn('users', 'reset_otp')) {
                $blueprint->string('reset_otp')->nullable();
            }
            if (!Schema::hasColumn('users', 'reset_otp_expires_at')) {
                $blueprint->timestamp('reset_otp_expires_at')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $blueprint) {
            $blueprint->dropColumn(['reset_otp', 'reset_otp_expires_at']);
        });
    }
};
