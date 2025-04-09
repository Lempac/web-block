<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Project;
use Auth;
use Gitonomy\Git\Admin;
use OpenApi\Attributes\Delete;
use OpenApi\Attributes\Get;
use OpenApi\Attributes\Items;
use OpenApi\Attributes\JsonContent;
use OpenApi\Attributes\Patch;
use OpenApi\Attributes\PathParameter;
use OpenApi\Attributes\Post;
use OpenApi\Attributes\Property;
use OpenApi\Attributes\Put;
use OpenApi\Attributes\RequestBody;
use OpenApi\Attributes\Response;
use OpenApi\Attributes\Schema;
use Storage;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    #[Get(path: '/api/projects', tags: ['project'])]
    #[Response(response: 200, description: 'test', content: new JsonContent(type: 'array', items: new Items(ref: '#/components/schemas/Project')))]
    public function index()
    {
        return Auth::user()->projects;
    }

    /**
     * Store a newly created resource in storage.
     */
    #[Post(path: '/api/projects', tags: ['project'])]
    #[RequestBody(description: 'Name to crate the project', content: new JsonContent(ref: '#/components/schemas/StoreProjectRequest'))]
    #[Response(response: 201, description: 'Project created successfully', content: new JsonContent(properties: [
        new Property(property: 'message', type: 'string'),
    ]))]
    #[Response(response: 400, description: 'Invalid url', content: new JsonContent(type: 'array', items: new Items(ref: '#/components/schemas/ErrorObject')))]
    public function store(StoreProjectRequest $request)
    {
        $val = $request->validated();
        try {
            if (filter_var($val['nameOrUrl'], FILTER_VALIDATE_URL)) {
                $repo = Admin::isValidRepository($val['nameOrUrl']);
                if (! $repo) {
                    return response()->json(['message' => 'Invalid repository url', 'errors' => ['nameOrUrl' => 'Invalid repository url']], 400);
                }
                $parseUrl = parse_url($val['nameOrUrl'], PHP_URL_PATH);
                $parseUrl = explode('/', $parseUrl);
                $name = end($parseUrl);
                /** @var Project $project */
                $project = new Project;
                $project->name = $name;
                $project->description = '';

                // $project = Auth::user()->projects()->create(['name' => $name, 'description' => '']);
                $repo = Admin::cloneRepository(storage_path('app/private').'/'.$name, $val['nameOrUrl']);
            } else {
                // TODO: add logic for if user input a name for new project
                $project = Auth::user()->getGithubProject($val['nameOrUrl']);
                $repo = Admin::cloneRepository(storage_path('app/private').'/'.$project->name, $project->url);
                // dd($repo
            }
            Auth::user()->projects()->save($project);
        } catch (\Exception $e) {
            Storage::disk('local')->deleteDirectory($val['nameOrUrl']);
            \Log::error($e);
            throw new \Exception($e->getMessage());
        }
        $project->generateGitProject();

        return response()->json(['message' => 'Project created successfully'], 201);
    }

    /**
     * Display the specified resource.
     */
    #[Get(path: '/api/projects/{project}', tags: ['project'])]
    #[PathParameter(name: 'project', required: true, schema: new Schema(type: 'integer'))]
    #[Response(response: 200, description: 'test', content: new JsonContent(ref: '#/components/schemas/Project'))]
    public function show(Project $project)
    {
        return $project;
    }

    /**
     * Update the specified resource in storage.
     */
    #[Put(path: '/api/projects/{project}', tags: ['project'])]
    #[Patch(path: '/api/projects/{project}', tags: ['project'])]
    #[PathParameter(name: 'project', required: true, schema: new Schema(type: 'integer'))]
    #[RequestBody(description: 'Date to update project.', content: new JsonContent(ref: '#/components/schemas/UpdateProjectRequest'))]
    #[Response(response: 204, description: 'Project updated.')]
    #[Response(response: 401, description: 'Unauthenticated.', content: new JsonContent(ref: '#/components/schemas/ErrorObject'))]
    public function update(UpdateProjectRequest $request, Project $project)
    {
        $project->update($request->validated());

        return response()->noContent();
    }

    /**
     * Remove the specified resource from storage.
     */
    #[Delete(path: '/api/projects/{project}', tags: ['project'])]
    #[PathParameter(name: 'project', required: true, schema: new Schema(type: 'integer'))]
    #[Response(response: 204, description: 'Project deleted.')]
    public function destroy(Project $project)
    {
        $project->delete();

        return response()->noContent();
    }
}
