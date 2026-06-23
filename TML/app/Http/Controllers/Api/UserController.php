<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    /**
     * GET /users — basic directory of other users, so a logged-in user can
     * start a conversation with anyone (used by the message composer).
     * Excludes the current user. Optional `?search=` filters by name/email.
     */
    public function index(Request $request)
    {
        $query = User::where('id', '!=', $request->user()->id)
            ->where('status', '!=', 'suspended');

        if ($request->search) {
            $kw = trim($request->search);
            $query->where(function ($q) use ($kw) {
                $q->where('name', 'like', "%{$kw}%")
                  ->orWhere('email', 'like', "%{$kw}%");
            });
        }

        return response()->json(
            $query->select('id', 'name', 'avatar', 'role')->orderBy('name')->get()
        );
    }
}
