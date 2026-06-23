<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ModerationLog extends Model
{
    use HasFactory;

    protected $fillable = ['admin_id', 'action', 'target_type', 'target_id', 'details'];

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    /** Record a moderation action (who · what · when). */
    public static function record($adminId, $action, $targetType = null, $targetId = null, $details = null)
    {
        return static::create([
            'admin_id' => $adminId,
            'action' => $action,
            'target_type' => $targetType,
            'target_id' => $targetId,
            'details' => $details,
        ]);
    }
}
