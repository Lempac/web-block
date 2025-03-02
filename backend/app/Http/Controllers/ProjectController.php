<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Project;
use Auth;
use Gitonomy\Git\Admin;
use Gitonomy\Git\Repository;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Auth::user()->projects;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request)
    {
        $val = $request->validated();

        if (filter_var($val['name'], FILTER_VALIDATE_URL)) {
            $repo = Admin::isValidRepository($val['name']);
            if (! $repo) {
                return response()->json(['error' => 'Invalid repository url'], 400);
            }
            $parseUrl = parse_url($val['name'], PHP_URL_PATH);
            $parseUrl = explode('/', $parseUrl);
            $name = end($parseUrl);
            /** @var Project $project */
            $repo = Admin::cloneRepository(storage_path('app/private').'/'.$name, $val['name']);
            $project = Auth::user()->projects()->create(['name' => $name, 'description' => '']);
        } else {
            $project = Auth::user()->getGithubProject($val['name']);
            $repo = Admin::cloneRepository(storage_path('app/private').'/'.$project->name, $project->url);
        }
        $project->generateGitProject();
        return response()->json(['message' => 'Project created successfully'], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return response()->json(Project::findOrFail($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, string $id)
    {
        Project::findOrFail($id)->update($request->validated());
        return response()->noContent();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Project::findOrFail($id)->delete();
        return response()->noContent();
    }
}
