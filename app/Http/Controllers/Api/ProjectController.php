<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\ProjectRequest;
use App\Models\Project;
use Auth;

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
    public function store(ProjectRequest $request)
    {
        Auth::user()->projects()->create($request->validated());

        return response()->json(['message' => 'Project created']);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $val = Project::find($id);

        if (null === $val) {
            abort(404);
        }

        return response()->json(['project' => $val]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProjectRequest $request, string $id)
    {
        $val = Project::find($id);

        if (null === $val) {
            abort(404);
        }
        $val->update($request->validated());
        return response()->json(['message' => 'Project updated']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $val = Project::find($id);
        if (null === $val) {
            abort(404);
        }
        $val->delete();
        return response()->json(['message' => 'Project deleted']);
    }
}
