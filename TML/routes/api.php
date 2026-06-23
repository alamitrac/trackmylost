<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CommentReportController;
use App\Http\Controllers\Api\MessageReportController;

/*
|--------------------------------------------------------------------------
| AUTH
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/login', [AuthController::class, 'login'])->name('login');

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{post}', [PostController::class, 'show']);
Route::get('/posts/{post}/matches', [PostController::class, 'matches']); // Feature 9
Route::get('/categories', [CategoryController::class, 'index']);
// Reading comments is public; creating/editing stays behind auth (below).
Route::get('/comments', [CommentController::class, 'index']);

/*
|--------------------------------------------------------------------------
| PROTECTED ROUTES
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Feature 1 — profile management
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::post('/profile', [ProfileController::class, 'update']);

    Route::apiResource('posts', PostController::class)->except(['index', 'show']);
    Route::apiResource('comments', CommentController::class)->except(['index']);
    Route::apiResource('reports', ReportController::class);
    Route::apiResource('categories', CategoryController::class)->except(['index']);

    // User directory (to start a new conversation with anyone)
    Route::get('/users', [UserController::class, 'index']);

    // Feature 3 — messaging (conversations + threads)
    Route::get('/conversations', [MessageController::class, 'conversations']);
    Route::post('/conversations/{user}/messages', [MessageController::class, 'send']);
    Route::post('/conversations/{user}/read', [MessageController::class, 'markRead']);
    Route::get('/messages/unread-count', [MessageController::class, 'unreadCount']);

    // Task 4 & 6 — report a comment / a message
    Route::post('/comments/{comment}/report', [CommentReportController::class, 'store']);
    Route::post('/messages/{message}/report', [MessageReportController::class, 'store']);

    // Feature 9 — notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markRead']);

    // Priority 6 — favorites
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites', [FavoriteController::class, 'store']);
    Route::delete('/favorites/{post}', [FavoriteController::class, 'destroy']);

    // Priority 7 — admin / moderation (role checked inside the controller)
    Route::prefix('admin')->group(function () {
        Route::get('/stats', [AdminController::class, 'stats']);
        Route::get('/reports', [AdminController::class, 'reports']);
        Route::get('/posts', [AdminController::class, 'posts']);
        Route::patch('/posts/{id}/hide', [AdminController::class, 'toggleHide']);
        Route::delete('/posts/{id}', [AdminController::class, 'deletePost']);
        Route::get('/comments', [AdminController::class, 'comments']);
        Route::delete('/comments/{id}', [AdminController::class, 'deleteComment']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::patch('/users/{id}/status', [AdminController::class, 'setUserStatus']);
        Route::get('/logs', [AdminController::class, 'logs']);
        Route::post('/messages', [AdminController::class, 'sendMessage']);   // Feature 4
        Route::get('/matches', [AdminController::class, 'matches']);          // Feature 9

        // Moderation — reported comments (Task 4) & messages (Task 6)
        Route::get('/comment-reports', [AdminController::class, 'commentReports']);
        Route::post('/comment-reports/{id}/ignore', [AdminController::class, 'ignoreCommentReport']);
        Route::get('/message-reports', [AdminController::class, 'messageReports']);
        Route::post('/message-reports/{id}/ignore', [AdminController::class, 'ignoreMessageReport']);
        Route::delete('/messages/{id}', [AdminController::class, 'deleteMessage']);
    });
});

/*
|--------------------------------------------------------------------------
| TEST
|--------------------------------------------------------------------------
*/
Route::get('/test', function () {
    return response()->json([
        'ok' => true
    ]);
});

Route::get('/items', function () {
    return response()->json([
        'message' => 'Route items fonctionne',
        'data' => []
    ]);
});

Route::post('/items', function (\Illuminate\Http\Request $request) {
    $data = $request->validate([
        'name' => ['required', 'string', 'max:255'],
    ]);

    return response()->json([
        'message' => 'Item créé',
        'data' => $data,
    ], 201);
});