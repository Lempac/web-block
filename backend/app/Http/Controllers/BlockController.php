<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBlockRequest;
use App\Http\Requests\UpdateBlockRequest;
use App\Models\Block;
use App\Models\Project;

class BlockController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(int $project)
    {
        return Project::findOrFail($project)->blocks;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBlockRequest $request)
    {
        $val = $request->validated();

    }

    /**
     * Display the specified resource.
     */
    public function show(Block $block)
    {
        return Project::findOrFail($block);
    }

    /**
     * Display the specified resource childern.
     */
    public function showBlocks(Block $block)
    {
        return Block::findOrFail($block)->blocks;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBlockRequest $request, Block $block)
    {
        Block::findOrFail($block)->update($request->validated());
        return response()->noContent();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Block $block)
    {
        Block::findOrFail($block)->delete();
        return response()->noContent();
    }
}
