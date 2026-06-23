<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Message;

class MessageController extends Controller
{
    /**
     * GET /conversations — one entry per person the user has exchanged with,
     * each carrying the full thread, last message, and unread count.
     */
    public function conversations(Request $request)
    {
        $me = $request->user()->id;

        $messages = Message::where('sender_id', $me)
            ->orWhere('receiver_id', $me)
            ->with('sender:id,name,avatar,role', 'receiver:id,name,avatar,role')
            ->orderBy('created_at')
            ->get();

        $convos = [];
        foreach ($messages as $m) {
            $otherId = $m->sender_id == $me ? $m->receiver_id : $m->sender_id;
            $other = $m->sender_id == $me ? $m->receiver : $m->sender;

            if (!isset($convos[$otherId])) {
                $convos[$otherId] = [
                    'id' => $otherId,
                    'other_user' => $other,
                    'messages' => [],
                    'unread' => 0,
                    'last_message' => '',
                    'updated_at' => $m->created_at,
                ];
            }
            $convos[$otherId]['messages'][] = $m;
            $convos[$otherId]['last_message'] = $m->content;
            $convos[$otherId]['updated_at'] = $m->created_at;
            if ($m->receiver_id == $me && $m->read_at === null) {
                $convos[$otherId]['unread']++;
            }
        }

        $list = array_values($convos);
        usort($list, fn ($a, $b) => strcmp((string) $b['updated_at'], (string) $a['updated_at']));

        return response()->json($list);
    }

    /** POST /conversations/{user}/messages — send a message to {user}. */
    public function send(Request $request, $userId)
    {
        $content = $request->input('content',
            $request->input('text', $request->input('body', $request->input('message'))));

        if (!is_string($content) || trim($content) === '') {
            return response()->json(['message' => 'Le message est vide.'], 422);
        }

        $msg = Message::create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $userId,
            'content' => trim($content),
            'is_admin' => ($request->user()->role === 'admin'),
        ]);

        $msg->load('sender:id,name,avatar,role');

        return response()->json($msg);
    }

    /** POST /conversations/{user}/read — mark incoming messages from {user} as read. */
    public function markRead(Request $request, $userId)
    {
        Message::where('receiver_id', $request->user()->id)
            ->where('sender_id', $userId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['message' => 'ok']);
    }

    /** GET /messages/unread-count — total unread for the navbar badge. */
    public function unreadCount(Request $request)
    {
        return response()->json([
            'count' => Message::where('receiver_id', $request->user()->id)
                ->whereNull('read_at')
                ->count(),
        ]);
    }
}
