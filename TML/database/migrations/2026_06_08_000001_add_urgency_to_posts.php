<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            // max=Urgence Maximale, high=Urgence Élevée, medium=Priorité Moyenne,
            // normal=Perdu / Trouvé (default for everyday lost-and-found items).
            $table->enum('urgency', ['max', 'high', 'medium', 'normal'])
                ->default('normal')
                ->after('type');
        });
    }

    public function down(): void
    {
        Schema::table('posts', fn (Blueprint $t) => $t->dropColumn('urgency'));
    }
};
