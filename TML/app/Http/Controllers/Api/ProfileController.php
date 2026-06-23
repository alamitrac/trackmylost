<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    /** GET /profile — the authenticated user (with avatar_url). */
    public function show(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * POST /profile — update the authenticated user's profile (Feature 1).
     * Accepts JSON or multipart (avatar file). All fields optional.
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|nullable|string|max:255',
            'first_name' => 'sometimes|nullable|string|max:255',
            'last_name' => 'sometimes|nullable|string|max:255',
            'email' => ['sometimes', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => 'sometimes|nullable|string|max:30',
            'city' => 'sometimes|nullable|string|max:255',
            'bio' => 'sometimes|nullable|string|max:1000',
            'birth_date' => 'sometimes|nullable|date',
            'gender' => 'sometimes|nullable|string|max:30',
            'avatar' => 'sometimes|image|mimes:jpg,jpeg,png,webp|max:4096',
            'password' => 'sometimes|nullable|string|min:6|confirmed',
        ]);

        // Avatar upload (replace the old file).
        if ($request->hasFile('avatar')) {
            if ($user->avatar && !str_starts_with($user->avatar, 'http')) {
                Storage::disk('public')->delete($user->avatar);
            }
            $user->avatar = $request->file('avatar')->store('avatars', 'public');
        }

        foreach (['name', 'first_name', 'last_name', 'email', 'phone', 'city', 'bio', 'birth_date', 'gender'] as $field) {
            if ($request->exists($field)) {
                $user->$field = $validated[$field] ?? null;
            }
        }

        // Keep `name` consistent if only first/last were sent.
        if (($request->exists('first_name') || $request->exists('last_name')) && !$request->filled('name')) {
            $full = trim(($user->first_name ?? '') . ' ' . ($user->last_name ?? ''));
            if ($full !== '') {
                $user->name = $full;
            }
        }

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Profil mis à jour.',
            'user' => $user->fresh(),
        ]);
    }
}
