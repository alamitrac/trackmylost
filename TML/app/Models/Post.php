<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'description',
        'type',
        'urgency',
        'location',
        'status',
        'image',
        'views',
        'hidden',
        'lat',
        'lng',
    ];

    protected $casts = [
        'hidden' => 'boolean',
        'views' => 'integer',
        'lat' => 'float',
        'lng' => 'float',
    ];

    // Expose ready-to-use absolute image URL(s) to the API.
    //   image_urls → ALL images of the report (new multi-image support)
    //   image_url  → the first image (kept for backward compatibility)
    protected $appends = ['image_url', 'image_urls'];

    // 🔗 relation: a post has many images (gallery)
    public function images()
    {
        return $this->hasMany(PostImage::class)->orderBy('position')->orderBy('id');
    }

    /**
     * All images as absolute, browser-ready URLs.
     * Prefers the `post_images` gallery; falls back to the legacy single
     * `image` column so older rows (and seeded demo data) still work.
     */
    public function getImageUrlsAttribute()
    {
        $imgs = $this->relationLoaded('images')
            ? $this->images
            : $this->images()->get();

        $urls = $imgs->pluck('url')->filter()->values()->all();
        if (!empty($urls)) {
            return $urls;
        }

        $legacy = $this->resolveImagePath($this->image);
        return $legacy ? [$legacy] : [];
    }

    /** First image URL — the uploaded file for real reports, never a placeholder. */
    public function getImageUrlAttribute()
    {
        $urls = $this->image_urls;
        return $urls[0] ?? null;
    }

    /** Resolve a stored path / URL to an absolute URL (or null). */
    private function resolveImagePath($p)
    {
        if (empty($p)) {
            return null;
        }
        if (Str::startsWith($p, ['http://', 'https://'])) {
            return $p;
        }
        return asset('storage/' . ltrim($p, '/'));
    }

    // 🔗 relation: post belongs to user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // 🔗 relation: post belongs to category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // 🔗 relation: post has many comments
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    // 🔗 relation: post has many reports
    public function reports()
    {
        return $this->hasMany(Report::class);
    }

    // 🔗 relation: post has many favorites
    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    // 🔗 relation: post has many recorded views (for dedupe)
    public function postViews()
    {
        return $this->hasMany(PostView::class);
    }
}