<?php

declare(strict_types=1);

namespace App\Orchid\Layouts\Project;

use App\Models\Project;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Actions\DropDown;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Components\Cells\DateTimeSplit;
use Orchid\Screen\Fields\Input;
use Orchid\Screen\Layouts\Table;
use Orchid\Screen\TD;

class ProjectListLayout extends Table
{
    /**
     * @var string
     */
    public $target = 'projects';

    /**
     * @return TD[]
     */
    public function columns(): array
    {
        return [
            TD::make('name', __('Project Name'))
                ->sort()
                ->cantHide()
                ->filter(Input::make())
                ->render(fn (Project $project) => Link::make($project->name)
                    ->route('platform.projects.view', $project->id)),

            TD::make('description', __('Description'))
                ->sort()
                ->defaultHidden()
                ->render(fn (Project $project) => $project->description),

            TD::make('url', __('URL'))
                ->sort()
                ->filter(Input::make())
                ->render(fn (Project $project) => Link::make($project->url ?? '')
                    ->href($project->url ?? '')
                    ->target('_blank')),

            TD::make('default_branch', __('Default Branch'))
                ->sort()
                ->defaultHidden()
                ->render(fn (Project $project) => $project->default_branch),

            TD::make('created_at', __('Created'))
                ->usingComponent(DateTimeSplit::class)
                ->align(TD::ALIGN_RIGHT)
                ->defaultHidden()
                ->sort(),

            TD::make('updated_at', __('Last Update'))
                ->usingComponent(DateTimeSplit::class)
                ->align(TD::ALIGN_RIGHT)
                ->sort(),

            TD::make(__('Actions'))
                ->align(TD::ALIGN_CENTER)
                ->width('100px')
                ->render(fn (Project $project) => DropDown::make()
                    ->icon('bs.three-dots-vertical')
                    ->list([
                        // View Link - assuming a route like 'platform.projects.view'
                        Link::make(__('View'))
                            ->route('platform.projects.view', $project->id)
                            ->icon('bs.eye'),

                        // Delete Button
                        Button::make(__('Delete'))
                            ->icon('bs.trash3')
                            ->confirm(__('Once the project is deleted, all of its resources and data will be permanently deleted. This action cannot be undone.'))
                            ->method('remove', [
                                'id' => $project->id,
                            ]),
                    ])),
        ];
    }
}
