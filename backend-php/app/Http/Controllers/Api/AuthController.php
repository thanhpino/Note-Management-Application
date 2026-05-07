<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Carbon\Carbon;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $activationToken = Str::random(64);
        
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'activation_token' => $activationToken,
            'is_verified' => false,
        ]);

        // Link kích hoạt gửi về Frontend (Port 5173)
        $activationUrl = "http://localhost:5173/activate/{$activationToken}";
        
        try {
            Mail::send([], [], function ($message) use ($user, $activationUrl) {
                $message->to($user->email)
                    ->subject('Activate your Notes Account')
                    ->html("<h1>Welcome {$user->name}!</h1><p>Please click the link below to activate your account:</p><a href='{$activationUrl}'>Activate Account</a>");
            });
        } catch (\Exception $e) {
            \Log::error("Mail Error: " . $e->getMessage());
        }

        return response()->json(['message' => 'User registered. Please check your email to activate account.'], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                '_id' => (string)$user->id,
                'name' => $user->name ?? 'User',
                'displayName' => $user->name ?? 'User',
                'email' => $user->email,
                'avatar_url' => $user->avatar_url,
                'avatarUrl' => $user->avatar_url,
                'isActivated' => (bool)$user->is_verified,
                'preferences' => $user->preferences ?? ['darkMode' => false]
            ]
        ]);
    }

    public function activateAccount($token)
    {
        $user = User::where('activation_token', $token)->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid activation token'], 400);
        }

        $user->update([
            'is_verified' => true,
            'activation_token' => null,
        ]);

        return response()->json(['message' => 'Account activated successfully']);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $otp = rand(100000, 999999);
        $user->update([
            'reset_otp' => $otp,
            'reset_otp_expires_at' => Carbon::now()->addMinutes(15),
        ]);

        try {
            Mail::send([], [], function ($message) use ($user, $otp) {
                $message->to($user->email)
                    ->subject('Password Reset OTP')
                    ->html("Your OTP for password reset is: <b>{$otp}</b>. It will expire in 15 minutes.");
            });
        } catch (\Exception $e) {
             \Log::error("Mail Error: " . $e->getMessage());
        }

        return response()->json(['message' => 'OTP sent to your email']);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required',
        ]);

        $user = User::where('email', $request->email)
                    ->where('reset_otp', $request->otp)
                    ->where('reset_otp_expires_at', '>', Carbon::now())
                    ->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid or expired OTP'], 400);
        }

        return response()->json(['message' => 'OTP verified successfully']);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required',
            'password' => 'required|min:6',
        ]);

        $user = User::where('email', $request->email)
                    ->where('reset_otp', $request->otp)
                    ->where('reset_otp_expires_at', '>', Carbon::now())
                    ->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid or expired OTP'], 400);
        }

        $user->update([
            'password' => Hash::make($request->password),
            'reset_otp' => null,
            'reset_otp_expires_at' => null,
        ]);

        return response()->json(['message' => 'Password reset successfully']);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }

    public function resendActivation(Request $request)
    {
        $user = $request->user();
        if ($user->is_verified) {
            return response()->json(['message' => 'Account already activated'], 400);
        }

        $activationToken = Str::random(64);
        $user->update(['activation_token' => $activationToken]);

        $activationUrl = "http://localhost:5173/activate/{$activationToken}";

        try {
            Mail::send([], [], function ($message) use ($user, $activationUrl) {
                $message->to($user->email)
                    ->subject('Activate your Notes Account')
                    ->html("<h1>Welcome!</h1><p>Please click the link below to activate your account:</p><a href='{$activationUrl}'>Activate Account</a>");
            });
        } catch (\Exception $e) {
            \Log::error("Resend Activation Mail Failed: " . $e->getMessage());
            return response()->json(['message' => 'Failed to send email. Please check your SMTP settings.'], 500);
        }

        return response()->json(['message' => 'Activation link resent']);
    }
}
