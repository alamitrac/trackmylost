<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'content',
        'is_read',
        'type',
        'link',
        'related_id',
    ];

    protected $casts = [
        'is_read' => 'boolean',
    ];

    // 🔗 notification belongs to user
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}