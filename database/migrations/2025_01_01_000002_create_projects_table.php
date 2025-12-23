<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            $table->string('name');
            $table->string('color')->default('#3b82f6');
            $table->text('description')->nullable();
            
            $table->boolean('is_favorite')->default(false);
            $table->boolean('is_archived')->default(false);
            
            $table->timestamps();
        });

        // Tambah kolom project_id ke tasks
        Schema::table('tasks', function (Blueprint $table) {
            $table->foreignId('project_id')->nullable()->after('user_id')
                  ->constrained()->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropForeign(['project_id']);
            $table->dropColumn('project_id');
        });
        
        Schema::dropIfExists('projects');
    }
};