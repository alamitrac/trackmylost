<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Priority 5 (views) + Priority 7 (hide/unhide) on posts
        Schema::table('posts', function (Blueprint $table) {
            $table->unsignedBigInteger('views')->default(0)->after('status');
            $table->boolean('hidden')->default(false)->after('views');
        });

        // Priority 7 — user suspension / ban
        Schema::table('users', function (Blueprint $table) {
            $table->enum('status', ['active', 'suspended'])->default('active')->after('role');
        });

        // Priority 6 — favorites
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('post_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            $table->unique(['user_id', 'post_id']);
        });

        // Priority 5 — per-viewer dedupe so a refresh doesn't inflate views
        Schema::create('post_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained()->onDelete('cascade');
            $table->string('identifier'); // user id or hashed ip+agent
            $table->timestamps();
            $table->unique(['post_id', 'identifier']);
        });

        // Priority 7 — moderation / audit log (who · what · when)
        Schema::create('moderation_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_id')->constrained('users')->onDelete('cascade');
            $table->string('action');                 // e.g. delete_post, hide_post, ban_user
            $table->string('target_type')->nullable(); // post | comment | user | report
            $table->unsignedBigInteger('target_id')->nullable();
            $table->text('details')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('moderation_logs');
        Schema::dropIfExists('post_views');
        Schema::dropIfExists('favorites');
        Schema::table('users', fn (Blueprint $t) => $t->dropColumn('status'));
        Schema::table('posts', fn (Blueprint $t) => $t->dropColumn(['views', 'hidden']));
    }
};
