<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

/**
 * Urgency: 4 levels → 3 user-selectable levels for LOST items, blue reserved
 * for FOUND items.
 *   max    = Urgence Maximale (red)
 *   medium = Priorité Moyenne (orange)
 *   low    = Priorité Faible  (green)   ← NEW
 *   normal = blue, auto-assigned to FOUND items (not user-selectable)
 */
return new class extends Migration
{
    public function up(): void
    {
        // 1) Relax the enum CHECK constraint to a plain string so 'low' is allowed.
        Schema::table('posts', function (Blueprint $t) {
            $t->string('urgency', 20)->default('normal')->change();
        });

        // 2) Migrate existing rows to the new scheme.
        // Found items are always blue.
        DB::table('posts')->where('type', 'found')->update(['urgency' => 'normal']);
        // Old orange "high" folds into "medium" (orange).
        DB::table('posts')->where('type', 'lost')->where('urgency', 'high')->update(['urgency' => 'medium']);
        // Old blue / lowest urgency on a LOST item becomes "Faible" (green).
        DB::table('posts')->where('type', 'lost')->where('urgency', 'normal')->update(['urgency' => 'low']);
        // 'max' and 'medium' on lost items are unchanged.
    }

    public function down(): void
    {
        DB::table('posts')->where('urgency', 'low')->update(['urgency' => 'normal']);
        Schema::table('posts', function (Blueprint $t) {
            $t->enum('urgency', ['max', 'high', 'medium', 'normal'])->default('normal')->change();
        });
    }
};
