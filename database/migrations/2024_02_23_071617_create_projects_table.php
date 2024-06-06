<?php

use App\Models\Block;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->text('full_description')->nullable();
            $table->string('stash_path')->nullable();
            $table->string('default_branch')->default('master');
            $table->string('license')->default('');
            $table->enum('visibility', ['public', 'private'])->default('private');
            $table->string('sha', 40)->nullable();
            $table->timestamps();
            $table->foreignIdFor(Block::class, "bar_id")->nullable();
            $table->foreignIdFor(User::class)->constrained()->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
