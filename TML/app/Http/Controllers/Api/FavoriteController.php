<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Favorite;
use App\Models\Post;

class FavoriteController extends Controller
{
    /** GET /favorites — the current user's saved reports. */
    public function index(Request $request)
    {
        $user = $request->user();
        $ids = Favorite::where('user_id', $user->id)->latest()->pluck('post_id');

        $posts = Post::whereIn('id', $ids)
            ->with('user', 'category', 'images')
            ->withCount('comments')
            ->get()
            ->sortByDesc(fn ($p) => $ids->search($p->id) === false ? -1 : -$ids->search($p->id))
            ->values();

        $posts->each(fn ($p) => $p->setAttribute('is_favorited', true));

        return response()->json(['data' => $posts]);
    }

    /** POST /favorites — add a report to favorites. */
    public function store(Request $request)
    {
        $request->validate(['post_id' => 'required|exists:posts,id']);

        Favorite::firstOrCreate([
            'user_id' => $request->user()->id,
            'post_id' => $request->post_id,
        ]);

        return response()->json(['favorited' => true]);
    }

    /** DELETE /favorites/{post} — remove from favorites. */
    public function destroy(Request $request, $postId)
    {
        Favorite::where('user_id', $request->user()->id)
            ->where('post_id', $postId)
            ->delete();

        return response()->json(['favorited' => false]);
    }
}
