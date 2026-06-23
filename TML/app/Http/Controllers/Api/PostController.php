<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\Notification;
use App\Services\MatchService;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    // GET ALL POSTS (FILTER + SEARCH + PAGINATION)
    public function index(Request $request)
    {
        $query = Post::with('user', 'category', 'images')->withCount('comments');

        // Hidden posts are removed from the public feed.
        $query->where('hidden', false);

        // filter type
        if ($request->type) {
            $query->where('type', $request->type);
        }

        // filter urgency
        if ($request->urgency) {
            $query->where('urgency', $request->urgency);
        }

        // filter category
        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        // filter by author (Mon Compte → "Mes signalements")
        if ($request->user_id) {
            $query->where('user_id', $request->user_id);
        }

        // Advanced search (Feature 8) ------------------------------------
        // keywords across title + description
        if ($request->search) {
            $kw = trim($request->search);
            $query->where(function ($q) use ($kw) {
                $q->where('title', 'like', "%{$kw}%")
                  ->orWhere('description', 'like', "%{$kw}%");
            });
        }
        // city / location
        if ($request->city) {
            $query->where('location', 'like', '%' . trim($request->city) . '%');
        }
        // status (open / resolved)
        if ($request->status) {
            $query->where('status', $request->status);
        }
        // exact date or range on creation
        if ($request->date) {
            $query->whereDate('created_at', $request->date);
        }
        if ($request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Newest first (Facebook-style). The `id` tiebreaker keeps ordering
        // deterministic when several posts share the same created_at second.
        $posts = $query->latest('created_at')->latest('id')->paginate(10);

        // Flag which posts the current viewer has favorited.
        $this->markFavorited($posts->getCollection(), $request->user('sanctum'));

        return response()->json($posts);
    }

    // CREATE POST
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|in:lost,found',
            'urgency' => 'sometimes|in:max,medium,low,normal',
            'location' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'lat' => 'sometimes|nullable|numeric',
            'lng' => 'sometimes|nullable|numeric',
            // A report supports MULTIPLE images (gallery). `image` (single) is
            // still accepted for backward compatibility.
            'images' => 'sometimes|array|max:10',
            'images.*' => 'image|mimes:jpg,jpeg,png|max:4096',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:4096',
        ]);

        $post = Post::create([
            'user_id' => $request->user()->id,
            'category_id' => $validated['category_id'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            'type' => $validated['type'],
            // Found items are always blue (normal); lost items use the chosen level.
            'urgency' => $validated['type'] === 'found' ? 'normal' : ($validated['urgency'] ?? 'low'),
            'location' => $validated['location'],
            'lat' => $validated['lat'] ?? null,
            'lng' => $validated['lng'] ?? null,
            'status' => 'open',
            'image' => null,
        ]);

        // Gather every uploaded file (images[] first, then a lone `image`).
        $files = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $f) {
                $files[] = $f;
            }
        }
        if ($request->hasFile('image')) {
            $files[] = $request->file('image');
        }

        $position = 0;
        foreach ($files as $file) {
            $path = $file->store('posts', 'public');
            $post->images()->create(['path' => $path, 'position' => $position++]);
        }

        // Mirror the first image into the legacy `image` column (back-compat).
        if ($first = $post->images()->first()) {
            $post->update(['image' => $first->path]);
        }

        // Feature 9 — notify about possible lost/found matches.
        $this->notifyMatches($post);

        $post->load('user', 'category', 'images')->loadCount('comments');

        return response()->json([
            'success' => true,
            'message' => 'Post created successfully',
            'data' => $post
        ]);
    }

    // SHOW SINGLE POST
    public function show(Request $request, $id)
    {
        $post = Post::with('user', 'category', 'images')->withCount('comments')->findOrFail($id);

        // Priority 5 — count a unique view (dedupe by user id, else ip+agent).
        $user = $request->user('sanctum');
        $identifier = $user
            ? 'u:' . $user->id
            : 'g:' . substr(hash('sha256', $request->ip() . '|' . $request->userAgent()), 0, 40);

        if (!$post->postViews()->where('identifier', $identifier)->exists()) {
            $post->postViews()->create(['identifier' => $identifier]);
            $post->increment('views');
            $post->refresh()->loadCount('comments')->load('user', 'category', 'images');
        }

        $post->setAttribute('is_favorited', $user
            ? $post->favorites()->where('user_id', $user->id)->exists()
            : false);

        return response()->json([
            'success' => true,
            'data' => $post
        ]);
    }

    /** Attach an `is_favorited` flag to each post for the given viewer. */
    private function markFavorited($collection, $user)
    {
        if (!$user) {
            $collection->each(fn ($p) => $p->setAttribute('is_favorited', false));
            return;
        }
        $favIds = \App\Models\Favorite::where('user_id', $user->id)
            ->whereIn('post_id', $collection->pluck('id'))
            ->pluck('post_id')
            ->flip();
        $collection->each(fn ($p) => $p->setAttribute('is_favorited', $favIds->has($p->id)));
    }

    // UPDATE POST
    public function update(Request $request, $id)
    {
        $post = Post::findOrFail($id);

        // owner or admin
        $isAdmin = in_array($request->user()->role ?? 'user', ['admin', 'administrator', 'moderateur']);
        if ($post->user_id !== $request->user()->id && !$isAdmin) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'type' => 'sometimes|in:lost,found',
            'urgency' => 'sometimes|in:max,medium,low,normal',
            'location' => 'sometimes|string',
            'category_id' => 'sometimes|exists:categories,id',
            'status' => 'sometimes|in:open,resolved',
            'lat' => 'sometimes|nullable|numeric',
            'lng' => 'sometimes|nullable|numeric',
            'image' => 'sometimes|image|mimes:jpg,jpeg,png|max:4096',
            'images' => 'sometimes|array|max:10',
            'images.*' => 'image|mimes:jpg,jpeg,png|max:4096',
        ]);

        // Replace the gallery if new images[] are uploaded.
        if ($request->hasFile('images')) {
            foreach ($post->images as $img) {
                if ($img->path && !str_starts_with($img->path, 'http')) {
                    Storage::disk('public')->delete($img->path);
                }
            }
            $post->images()->delete();
            $position = 0;
            foreach ($request->file('images') as $file) {
                $path = $file->store('posts', 'public');
                $post->images()->create(['path' => $path, 'position' => $position++]);
            }
            $validated['image'] = $post->images()->first()->path ?? null;
        } elseif ($request->hasFile('image')) {
            if ($post->image && !str_starts_with($post->image, 'http')) {
                Storage::disk('public')->delete($post->image);
            }
            $validated['image'] = $request->file('image')->store('posts', 'public');
        }

        // Found items are always blue (no user-selectable urgency).
        $effectiveType = $validated['type'] ?? $post->type;
        if ($effectiveType === 'found') {
            $validated['urgency'] = 'normal';
        }

        $post->update($validated);
        $post->load('user', 'category', 'images')->loadCount('comments');

        return response()->json([
            'success' => true,
            'message' => 'Post updated successfully',
            'data' => $post
        ]);
    }

    // DELETE POST
    public function destroy(Request $request, $id)
    {
        $post = Post::with('images')->findOrFail($id);

        $isAdmin = in_array($request->user()->role ?? 'user', ['admin', 'administrator', 'moderateur']);
        if ($post->user_id !== $request->user()->id && !$isAdmin) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        // delete every stored image file (gallery + legacy single)
        foreach ($post->images as $img) {
            if ($img->path && !str_starts_with($img->path, 'http')) {
                Storage::disk('public')->delete($img->path);
            }
        }
        if ($post->image && !str_starts_with($post->image, 'http')) {
            Storage::disk('public')->delete($post->image);
        }

        $post->delete(); // post_images rows cascade-delete

        return response()->json([
            'success' => true,
            'message' => 'Post deleted successfully'
        ]);
    }

    // ================================================================
    // Feature 9 — intelligent lost/found matching
    // ================================================================

    /** GET /posts/{id}/matches — opposite-type reports that may match. */
    public function matches(Request $request, $id)
    {
        $post = Post::findOrFail($id);
        $scored = MatchService::find($post, 5, 0.30);

        $data = array_map(function ($m) {
            $p = $m['post'];
            return [
                'id' => $p->id,
                'title' => $p->title,
                'type' => $p->type,
                'location' => $p->location,
                'image_url' => $p->image_url,
                'category' => $p->category->name ?? null,
                'created_at' => $p->created_at,
                'score' => round($m['score'] * 100),
            ];
        }, $scored);

        return response()->json(['data' => $data]);
    }

    /** Create match notifications for both owners when a new report is posted. */
    private function notifyMatches(Post $post)
    {
        $matches = MatchService::find($post, 3, 0.40);
        if (empty($matches)) {
            return;
        }
        $top = $matches[0]['post'];
        $count = count($matches);

        Notification::create([
            'user_id' => $post->user_id,
            'type' => 'match',
            'content' => "{$count} correspondance(s) possible(s) pour votre signalement « {$post->title} ».",
            'link' => "/item/{$post->id}",
            'related_id' => $top->id,
        ]);

        if ($top->user_id !== $post->user_id) {
            Notification::create([
                'user_id' => $top->user_id,
                'type' => 'match',
                'content' => "Un nouveau signalement « {$post->title} » pourrait correspondre à votre « {$top->title} ».",
                'link' => "/item/{$top->id}",
                'related_id' => $post->id,
            ]);
        }
    }
}