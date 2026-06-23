<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Feature 1 — richer user profile
        Schema::table('users', function (Blueprint $table) {
            $table->string('first_name')->nullable()->after('name');
            $table->string('last_name')->nullable()->after('first_name');
            $table->string('city')->nullable()->after('phone');
            $table->text('bio')->nullable()->after('city');
            $table->string('avatar')->nullable()->after('bio');
            $table->date('birth_date')->nullable()->after('avatar');
            $table->string('gender')->nullable()->after('birth_date');
        });

        // Feature 6 — geolocation on a report
        Schema::table('posts', function (Blueprint $table) {
            $table->decimal('lat', 10, 7)->nullable()->after('location');
            $table->decimal('lng', 10, 7)->nullable()->after('lat');
        });

        // Feature 3/4 — read receipts + admin-flagged messages
        Schema::table('messages', function (Blueprint $table) {
            $table->timestamp('read_at')->nullable()->after('content');
            $table->boolean('is_admin')->default(false)->after('read_at');
        });

        // Feature 9 — notification click-through + related post
        Schema::table('notifications', function (Blueprint $table) {
            $table->string('link')->nullable()->after('type');
            $table->unsignedBigInteger('related_id')->nullable()->after('link');
        });
    }

    public function down(): void
    {
        Schema::table('notifications', fn (Blueprint $t) => $t->dropColumn(['link', 'related_id']));
        Schema::table('messages', fn (Blueprint $t) => $t->dropColumn(['read_at', 'is_admin']));
        Schema::table('posts', fn (Blueprint $t) => $t->dropColumn(['lat', 'lng']));
        Schema::table('users', fn (Blueprint $t) => $t->dropColumn(['first_name', 'last_name', 'city', 'bio', 'avatar', 'birth_date', 'gender']));
    }
};
