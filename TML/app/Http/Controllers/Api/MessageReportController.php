<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\MessageReport;

class MessageReportController extends Controller
{
    /** POST /messages/{message}/report — flag a message (Task 6). */
    public function store(Request $request, $messageId)
    {
        $message = Message::findOrFail($messageId);
        $uid = $request->user()->id;

        // Only a participant of the conversation may report a message.
        if ($message->sender_id !== $uid && $message->receiver_id !== $uid) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $request->validate(['reason' => 'nullable|string|max:500']);

        MessageReport::updateOrCreate(
            ['message_id' => $message->id, 'user_id' => $uid],
            ['reason' => $request->reason, 'status' => 'pending']
        );

        return response()->json(['success' => true, 'message' => 'Message signalé à la modération.']);
    }
}
