<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Post;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'post_id',
        'reason'
    ];

    // relation avec user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // relation avec post
    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}