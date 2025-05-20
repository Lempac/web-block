<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBlockRequest;
use App\Http\Requests\UpdateBlockRequest;
use App\Models\Block;
use App\Models\Project;
use OpenApi\Attributes\Delete;
use OpenApi\Attributes\Get;
use OpenApi\Attributes\Items;
use OpenApi\Attributes\JsonContent;
use OpenApi\Attributes\Patch;
use OpenApi\Attributes\PathParameter;
use OpenApi\Attributes\Post;
use OpenApi\Attributes\Put;
use OpenApi\Attributes\RequestBody;
use OpenApi\Attributes\Response;
use OpenApi\Attributes\Schema;

class BlockController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    #[Get(path: '/api/blocks/{project}/blocks', tags: ['block'], security: ['sessionAuth'])]
    #[PathParameter(name: 'project', required: true, schema: new Schema(type: 'string', format: 'uuid'))]
    #[Response(response: 200, description: 'All blocks, 1 deep, project has.', content: new JsonContent(type: 'array', items: new Items(ref: '#/components/schemas/Block')))]
    #[Response(response: 404, description: 'Project not found.')]
    public function index(Project $project)
    {
        return $project->blocks;
    }

    /**
     * Store a newly created resource in storage.
     */
    #[Post(path: '/api/blocks', tags: ['block'], security: ['sessionAuth'])]
    #[RequestBody(description: 'Name to crate the project', content: new JsonContent(ref: '#/components/schemas/StoreBlockRequest'))]
    #[Response(response: 204, description: 'Block created.')]
    public function store(StoreBlockRequest $request)
    {
        Block::create($request->validated());

        return response()->noContent();
    }

    /**
     * Display the specified resource.
     */
    #[Get(path: '/api/blocks/{block}', tags: ['block'], security: ['sessionAuth'])]
    #[PathParameter(name: 'block', required: true, schema: new Schema(type: 'integer'))]
    #[Response(response: 200, description: 'Return block by id.', content: new JsonContent(ref: '#/components/schemas/Block'))]
    #[Response(response: 404, description: 'Block not found.')]
    public function show(Block $block)
    {
        return $block;
    }

    /**
     * Display the specified resource childern.
     */
    #[Get(path: '/api/blocks/{block}/blocks', tags: ['block'], security: ['sessionAuth'])]
    #[PathParameter(name: 'block', required: true, schema: new Schema(type: 'interger'))]
    #[Response(response: 200, description: 'All blocks, from blocks deep.', content: new JsonContent(type: 'array', items: new Items(ref: '#/components/schemas/Block')))]
    #[Response(response: 404, description: 'Project not found.')]
    public function showBlocks(Block $block)
    {
        return $block->blocks;
    }

    /**
     * Update the specified resource in storage.
     */
    #[Put(path: '/api/blocks/{block}', tags: ['block'], security: ['sessionAuth'])]
    #[Patch(path: '/api/blocks/{block}', tags: ['block'], security: ['sessionAuth'])]
    #[RequestBody(description: 'Data to update block.', content: new JsonContent(ref: '#/components/schemas/UpdateBlockRequest'))]
    #[PathParameter(name: 'block', required: true, schema: new Schema(type: 'integer'))]
    #[Response(response: 204, description: 'Block updated.')]
    #[Response(response: 401, description: 'Unauthenticated/Invalid.', content: new JsonContent(ref: '#/components/schemas/ErrorObject'))]
    public function update(UpdateBlockRequest $request, Block $block)
    {
        $block->update($request->validated());

        return response()->noContent();
    }

    /**
     * Remove the specified resource from storage.
     */
    #[Delete(path: '/api/blocks/{block}', tags: ['block'], security: ['sessionAuth'])]
    #[PathParameter(name: 'block', required: true, schema: new Schema(type: 'integer'))]
    #[Response(response: 204, description: 'Block deleted.')]
    public function destroy(Block $block)
    {
        $block->delete();

        return response()->noContent();
    }
}
