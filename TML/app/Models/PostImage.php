<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class PostImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'post_id',
        'path',
        'position',
    ];

    protected $appends = ['url'];

    // belongs to a post
    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    /**
     * Absolute, browser-ready URL for this image.
     * Passthrough for full URLs (seeded demo data); asset('storage/…') for
     * uploaded files.
     */
    public function getUrlAttribute()
    {
        $p = $this->path;
        if (empty($p)) {
            return null;
        }
        if (Str::startsWith($p, ['http://', 'https://'])) {
            return $p;
        }
        return asset('storage/' . ltrim($p, '/'));
    }
}
