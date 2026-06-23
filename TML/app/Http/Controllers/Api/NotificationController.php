<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
    /** GET /notifications — the current user's notifications, newest first. */
    public function index(Request $request)
    {
        return response()->json(
            Notification::where('user_id', $request->user()->id)->latest()->get()
        );
    }

    /** POST /notifications/{id}/read */
    public function markRead(Request $request, $id)
    {
        Notification::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->update(['is_read' => true]);

        return response()->json(['message' => 'ok']);
    }

    /** POST /notifications/read-all */
    public function markAllRead(Request $request)
    {
        Notification::where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['message' => 'ok']);
    }
}
