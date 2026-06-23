<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use App\Models\Post;
use App\Models\Comment;
use App\Models\Message;
use App\Models\Report;
use App\Models\Notification;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Mass assignable fields
     */
    protected $fillable = [
        'name',
        'first_name',
        'last_name',
        'email',
        'password',
        'phone',
        'city',
        'bio',
        'avatar',
        'birth_date',
        'gender',
        'role',
        'status',
    ];

    protected $appends = ['avatar_url'];

    /** Absolute URL for the uploaded avatar (null if none). */
    public function getAvatarUrlAttribute()
    {
        $a = $this->avatar;
        if (empty($a)) {
            return null;
        }
        if (\Illuminate\Support\Str::startsWith($a, ['http://', 'https://'])) {
            return $a;
        }
        return asset('storage/' . ltrim($a, '/'));
    }

    /**
     * Hidden fields
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Casts
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // =====================
    // RELATIONS
    // =====================

    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function messagesSent()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function messagesReceived()
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }

    public function reports()
    {
        return $this->hasMany(Report::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }
}