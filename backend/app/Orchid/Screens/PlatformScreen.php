<?php

declare(strict_types=1);

namespace App\Orchid\Screens;

use Orchid\Screen\Actions\Link;
use Orchid\Screen\Screen;
use Orchid\Support\Facades\Layout;

class PlatformScreen extends Screen
{
    /**
     * Fetch data to be displayed on the screen.
     *
     * @return array
     */
    public function query(): iterable
    {
        return [];
    }

    /**
     * The name of the screen displayed in the header.
     */
    public function name(): ?string
    {
        return 'Application dashboard';
    }

    /**
     * Display header description.
     */
    public function description(): ?string
    {
        $name = \Auth::user()->name;

        return "Welcome {$name} to your Application dashboard.";
    }

    /**
     * The screen's action buttons.
     *
     * @return \Orchid\Screen\Action[]
     */
    public function commandBar(): iterable
    {
        return [
            Link::make('Go to Frontend')
                ->href(config('app.frontend_url'))
                ->icon('bs.globe')
        ];
    }

    /**
     * The screen's layout elements.
     *
     * @return \Orchid\Screen\Layout[]
     */
    public function layout(): iterable
    {
        return [
            Layout::view('platform::partials.update-assets'),
            // Layout::view('statistics')
            // Layout::view('platform::partials.welcome'),
        ];
    }
}
