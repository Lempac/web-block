<?php

declare(strict_types=1);

namespace App\Orchid;

use Orchid\Platform\Dashboard;
use Orchid\Platform\ItemPermission;
use Orchid\Platform\OrchidServiceProvider;
use Orchid\Screen\Actions\Menu;
use Orchid\Support\Color;

class PlatformProvider extends OrchidServiceProvider
{
    /**
     * Bootstrap the application services.
     */
    public function boot(Dashboard $dashboard): void
    {

        parent::boot($dashboard);
        // ...
    }

    /**
     * Register the application menu.
     *
     * @return Menu[]
     */
    public function menu(): array
    {
        return [
            // Menu::make('Get Started')
            //     ->icon('bs.book')
            //     ->title('Navigation')
            //     ->route(config('platform.index')),

            Menu::make(__('Go to Frontend'))
                ->icon('bs.globe')
                ->url(\App::environment('production') ? config('app.frontend_url').'/web-block' : config('app.frontend_url'))
                ->target('_blank'),

            Menu::make(__('Statistics'))
                ->icon('bs.bar-chart-steps')
                ->route('platform.statistics')
                ->title(__('Analytics')),

            Menu::make(__('Projects'))
                ->icon('bs.folder')
                ->route('platform.projects.list')
                ->permission('platform.projects.list')
                ->title(__('Project Management')),

            Menu::make(__('Users'))
                ->icon('bs.people')
                ->route('platform.systems.users')
                ->permission('platform.systems.users')
                ->title(__('Access Controls')),

            Menu::make(__('Roles'))
                ->icon('bs.shield')
                ->route('platform.systems.roles')
                ->permission('platform.systems.roles')
                ->divider(),

            Menu::make('Backups')
                ->icon('database')
                ->route('platform.backups.list')
                ->title('System')
                ->permission('platform.backups.list'),

            // Menu::make('Documentation')
            //     ->title('Docs')
            //     ->icon('bs.box-arrow-up-right')
            //     ->url('https://orchid.software/en/docs')
            //     ->target('_blank'),

            // Menu::make('Changelog')
            //     ->icon('bs.box-arrow-up-right')
            //     ->url('https://github.com/orchidsoftware/platform/blob/master/CHANGELOG.md')
            //     ->target('_blank')
            //     ->badge(fn () => Dashboard::version(), Color::DARK),
        ];
    }

    /**
     * Register permissions for the application.
     *
     * @return ItemPermission[]
     */
    public function permissions(): array
    {
        return [
            ItemPermission::group(__('System'))
                ->addPermission('platform.systems.roles', __('Roles'))
                ->addPermission('platform.systems.users', __('Users')),
            ItemPermission::group(__('Projects'))
                ->addPermission('platform.projects.list', 'List Projects')
                ->addPermission('platform.projects.view', 'View Project Details') // If you have a view screen
                ->addPermission('platform.projects.remove', 'Delete Projects'),
            ItemPermission::group(__('System'))
                ->addPermission('platform.backups.list', __('View Backups'))
                ->addPermission('platform.backups.create', __('Create Backups'))
                ->addPermission('platform.backups.delete', __('Delete Backups'))
                ->addPermission('platform.backups.download', __('Download Backups')),
        ];
    }
}
