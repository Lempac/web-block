<?php

use App\Enums\VisibilityType;
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
            $table->string('default_branch')->default('master');
            $table->string('license')->default('');
            $table->enum('visibility', array_column(VisibilityType::cases(), 'value'))->default(VisibilityType::Private);
            $table->timestamps();
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
