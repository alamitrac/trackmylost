<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PostView extends Model
{
    use HasFactory;

    protected $fillable = ['post_id', 'identifier'];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
