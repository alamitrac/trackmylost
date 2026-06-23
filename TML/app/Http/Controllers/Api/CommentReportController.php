<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Comment;
use App\Models\CommentReport;

class CommentReportController extends Controller
{
    /** POST /comments/{comment}/report — flag a comment (Task 4). */
    public function store(Request $request, $commentId)
    {
        $comment = Comment::findOrFail($commentId);
        $request->validate(['reason' => 'nullable|string|max:500']);

        CommentReport::updateOrCreate(
            ['comment_id' => $comment->id, 'user_id' => $request->user()->id],
            ['reason' => $request->reason, 'status' => 'pending']
        );

        return response()->json(['success' => true, 'message' => 'Commentaire signalé à la modération.']);
    }
}
