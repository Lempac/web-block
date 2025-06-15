<?php

namespace App\Orchid\Screens\Project;

use App\Models\Project;
use Orchid\Screen\Screen;
use Orchid\Screen\Sight;
use Orchid\Support\Facades\Layout;

class ProjectViewScreen extends Screen
{
    public ?Project $project = null;

    /**
     * Query data.
     *
     * @return array
     */
    public function query(?Project $project): iterable
    {
        $this->project = $project; // Assign the injected $project to the class property

        return [
            'project' => $project, // Pass the project data to the layout
        ];
    }

    /**
     * Display header name.
     */
    public function name(): ?string
    {
        return $this->project?->name ?? 'Project Details';
    }

    /**
     * Display header description.
     */
    public function description(): ?string
    {
        return 'Project Details';
    }

    /**
     * Button commands.
     *
     * @return \Orchid\Screen\Action[]
     */
    public function commandBar(): array
    {
        return [];
    }

    /**
     * Views.
     *
     * @return \Orchid\Screen\Layout[]|string[]
     */
    public function layout(): iterable
    {
        return [
            Layout::legend('project', [
                Sight::make('id', 'ID'), // Use Sight::make()
                Sight::make('name', 'Project Name'), // Use Sight::make()
                Sight::make('description', 'Description'), // Use Sight::make()
                Sight::make('url', 'URL')
                    ->render(fn ($project) => \Orchid\Screen\Actions\Link::make($project->url ?? '')
                        ->href($project->url ?? '')
                        ->target('_blank')), // You can add custom rendering
                Sight::make('default_branch', 'Default Branch'),
                Sight::make('x', 'X Coordinate'),
                Sight::make('y', 'Y Coordinate'),
                Sight::make('zoom', 'Zoom Level'),
                Sight::make('oid', 'OID'),
                Sight::make('cwd', 'Current Working Directory'),
                Sight::make('created_at', 'Created At'),
                Sight::make('updated_at', 'Updated At'),
            ]),
        ];
    }
}
