<?php

namespace App\Orchid\Screens\Project;

use App\Models\Project;
use App\Orchid\Layouts\Project\ProjectListLayout;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Screen;
use Orchid\Support\Facades\Toast;
use Request;

class ProjectListScreen extends Screen
{
    /**
     * Query data.
     */
    public function query(): array
    {
        return [
            'projects' => Project::orderBy('id', 'desc')->paginate(),
        ];
    }

    /**
     * Display header name.
     */
    public function name(): ?string
    {
        return 'Projects';
    }

    /**
     * Display header description.
     */
    public function description(): ?string
    {
        return 'List of all projects';
    }

    /**
     * Button commands.
     *
     * @return \Orchid\Screen\Action[]
     */
    public function commandBar(): array
    {
        return [
            // You can add a link to create a new project here if needed,
            // but the request was for no-edit, so I'll omit it for now.
            // Link::make('Create New Project')
            //     ->icon('bs.plus')
            //     ->route('platform.projects.create'),
        ];
    }

    /**
     * Views.
     *
     * @return \Orchid\Screen\Layout[]|string[]
     */
    public function layout(): iterable
    {
        return [
            ProjectListLayout::class,
        ];
    }

    /**
     * @return \Illuminate\Http\RedirectResponse
     */
    public function remove()
    {
        $project = Project::findOrFail(Request()->query('id'));
        $project->delete();
        Toast::info(__('Project was removed successfully.'));

        return redirect()->route('platform.projects.list');
    }
}
