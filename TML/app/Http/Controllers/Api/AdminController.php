<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Post;
use App\Models\User;
use App\Models\Comment;
use App\Models\Report;
use App\Models\Message;
use App\Models\Notification;
use App\Models\ModerationLog;
use App\Models\CommentReport;
use App\Models\MessageReport;
use App\Services\MatchService;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    /** Abort unless the caller is an admin/moderator. */
    private function ensureAdmin(Request $request)
    {
        $role = $request->user()->role ?? 'user';
        if (!in_array($role, ['admin', 'administrator', 'moderateur'])) {
            abort(403, 'Accès réservé aux administrateurs.');
        }
    }

    /** GET /admin/stats — dashboard counters + today's activity. */
    public function stats(Request $request)
    {
        $this->ensureAdmin($request);
        $today = now()->startOfDay();

        return response()->json([
            'users' => User::count(),
            'posts' => Post::count(),
            'hidden_posts' => Post::where('hidden', true)->count(),
            'resolved_posts' => Post::where('status', 'resolved')->count(),
            'comments' => Comment::count(),
            'reports' => Report::count(),
            'comment_reports' => CommentReport::where('status', 'pending')->count(),
            'message_reports' => MessageReport::where('status', 'pending')->count(),
            'suspended_users' => User::where('status', 'suspended')->count(),
            'urgency' => [
                'max' => Post::where('urgency', 'max')->count(),
                'medium' => Post::where('urgency', 'medium')->count(),
                'low' => Post::where('urgency', 'low')->count(),
                'normal' => Post::where('urgency', 'normal')->count(),
            ],
            'today' => [
                'posts' => Post::where('created_at', '>=', $today)->count(),
                'comments' => Comment::where('created_at', '>=', $today)->count(),
                'reports' => Report::where('created_at', '>=', $today)->count(),
                'users' => User::where('created_at', '>=', $today)->count(),
            ],
        ]);
    }

    /** GET /admin/reports — reported posts with reporter + post. */
    public function reports(Request $request)
    {
        $this->ensureAdmin($request);
        return response()->json(
            Report::with(['user:id,name,email', 'post' => fn ($q) => $q->with('user:id,name')])
                ->latest()
                ->get()
        );
    }

    /** GET /admin/posts — every post (incl. hidden) for moderation. */
    public function posts(Request $request)
    {
        $this->ensureAdmin($request);
        return response()->json(
            Post::with('user:id,name', 'category:id,name', 'images')
                ->withCount(['comments', 'reports'])
                ->latest('id')
                ->paginate(30)
        );
    }

    /** PATCH /admin/posts/{id}/hide — toggle hidden. */
    public function toggleHide(Request $request, $id)
    {
        $this->ensureAdmin($request);
        $post = Post::findOrFail($id);
        $post->hidden = !$post->hidden;
        $post->save();

        ModerationLog::record(
            $request->user()->id,
            $post->hidden ? 'hide_post' : 'unhide_post',
            'post',
            $post->id,
            "« {$post->title} »"
        );

        return response()->json(['hidden' => $post->hidden]);
    }

    /** DELETE /admin/posts/{id} — remove a post and its image files. */
    public function deletePost(Request $request, $id)
    {
        $this->ensureAdmin($request);
        $post = Post::with('images')->findOrFail($id);
        $title = $post->title;

        foreach ($post->images as $img) {
            if ($img->path && !str_starts_with($img->path, 'http')) {
                Storage::disk('public')->delete($img->path);
            }
        }
        if ($post->image && !str_starts_with($post->image, 'http')) {
            Storage::disk('public')->delete($post->image);
        }
        $post->delete();

        ModerationLog::record($request->user()->id, 'delete_post', 'post', $id, "« {$title} »");

        return response()->json(['message' => 'Post supprimé.']);
    }

    /** GET /admin/comments — all comments with author + post. */
    public function comments(Request $request)
    {
        $this->ensureAdmin($request);
        return response()->json(
            Comment::with('user:id,name', 'post:id,title')->latest()->paginate(50)
        );
    }

    /** DELETE /admin/comments/{id} */
    public function deleteComment(Request $request, $id)
    {
        $this->ensureAdmin($request);
        $comment = Comment::findOrFail($id);
        $comment->delete();

        ModerationLog::record($request->user()->id, 'delete_comment', 'comment', $id);

        return response()->json(['message' => 'Commentaire supprimé.']);
    }

    /** GET /admin/users */
    public function users(Request $request)
    {
        $this->ensureAdmin($request);
        return response()->json(
            User::withCount('posts')->latest('id')->get()
        );
    }

    /** PATCH /admin/users/{id}/status — ban / unban (suspend / reactivate). */
    public function setUserStatus(Request $request, $id)
    {
        $this->ensureAdmin($request);
        $request->validate(['status' => 'required|in:active,suspended']);

        $user = User::findOrFail($id);
        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Vous ne pouvez pas vous suspendre vous-même.'], 422);
        }
        $user->status = $request->status;
        $user->save();

        ModerationLog::record(
            $request->user()->id,
            $request->status === 'suspended' ? 'ban_user' : 'unban_user',
            'user',
            $user->id,
            $user->name
        );

        return response()->json(['status' => $user->status]);
    }

    /** GET /admin/logs — moderation history (who · what · when). */
    public function logs(Request $request)
    {
        $this->ensureAdmin($request);
        return response()->json(
            ModerationLog::with('admin:id,name')->latest()->paginate(60)
        );
    }

    /** POST /admin/messages — send a direct message to a user (Feature 4). */
    public function sendMessage(Request $request)
    {
        $this->ensureAdmin($request);
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'content' => 'required|string|max:2000',
        ]);

        Message::create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $request->user_id,
            'content' => $request->content,
            'is_admin' => true,
        ]);

        Notification::create([
            'user_id' => $request->user_id,
            'type' => 'admin',
            'content' => "Message de l'administration : " . Str::limit($request->content, 90),
            'link' => '/messages',
        ]);

        ModerationLog::record($request->user()->id, 'message_user', 'user', $request->user_id, Str::limit($request->content, 120));

        return response()->json(['success' => true, 'message' => 'Message envoyé à l\'utilisateur.']);
    }

    /** GET /admin/matches — potential lost/found matches for review (Feature 9). */
    public function matches(Request $request)
    {
        $this->ensureAdmin($request);

        $lost = Post::where('type', 'lost')->where('hidden', false)->latest('id')->limit(60)->get();
        $out = [];
        foreach ($lost as $p) {
            $m = MatchService::find($p, 1, 0.40);
            if (!empty($m)) {
                $top = $m[0];
                $out[] = [
                    'lost' => ['id' => $p->id, 'title' => $p->title, 'location' => $p->location],
                    'found' => ['id' => $top['post']->id, 'title' => $top['post']->title, 'location' => $top['post']->location],
                    'score' => round($top['score'] * 100),
                ];
            }
        }
        usort($out, fn ($a, $b) => $b['score'] <=> $a['score']);

        return response()->json($out);
    }

    // ================================================================
    // Moderation — reported comments (Task 4) & messages (Task 6)
    // ================================================================

    /** GET /admin/comment-reports — pending reported comments. */
    public function commentReports(Request $request)
    {
        $this->ensureAdmin($request);
        return response()->json(
            CommentReport::where('status', 'pending')
                ->with(['user:id,name', 'comment' => fn ($q) => $q->with('user:id,name', 'post:id,title')])
                ->latest()
                ->get()
        );
    }

    /** POST /admin/comment-reports/{id}/ignore — dismiss the report, keep the comment. */
    public function ignoreCommentReport(Request $request, $id)
    {
        $this->ensureAdmin($request);
        CommentReport::where('id', $id)->update(['status' => 'ignored']);
        ModerationLog::record($request->user()->id, 'ignore_comment_report', 'comment_report', $id);
        return response()->json(['message' => 'Signalement ignoré.']);
    }

    /** GET /admin/message-reports — pending reported messages. */
    public function messageReports(Request $request)
    {
        $this->ensureAdmin($request);
        return response()->json(
            MessageReport::where('status', 'pending')
                ->with(['user:id,name', 'message' => fn ($q) => $q->with('sender:id,name', 'receiver:id,name')])
                ->latest()
                ->get()
        );
    }

    /** POST /admin/message-reports/{id}/ignore */
    public function ignoreMessageReport(Request $request, $id)
    {
        $this->ensureAdmin($request);
        MessageReport::where('id', $id)->update(['status' => 'ignored']);
        ModerationLog::record($request->user()->id, 'ignore_message_report', 'message_report', $id);
        return response()->json(['message' => 'Signalement ignoré.']);
    }

    /** DELETE /admin/messages/{id} — delete a reported message. */
    public function deleteMessage(Request $request, $id)
    {
        $this->ensureAdmin($request);
        $msg = Message::findOrFail($id);
        $msg->delete(); // message_reports rows cascade-delete
        ModerationLog::record($request->user()->id, 'delete_message', 'message', $id);
        return response()->json(['message' => 'Message supprimé.']);
    }
}
