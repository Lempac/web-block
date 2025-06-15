<?php

declare(strict_types=1);

namespace App\Orchid\Layouts\User;

use App\Enums\Lang;
use App\Enums\Themes;
use App\Models\User;
use Orchid\Screen\Field;
use Orchid\Screen\Fields\Select;
use Orchid\Screen\Layouts\Rows;

class ProfileSettingsLayout extends Rows
{
    /**
     * The data source for the fields in this layout.
     * Assumes the parent screen will pass the user model under the 'user' key.
     */
    public $target = 'user';

    /**
     * The screen's layout elements.
     *
     * @return Field[]
     */
    public function fields(): array
    {
        return [
            // Select::make('user.settings.lang')->fromEnum(Lang::class, 'localized')->help('Select your preferred display language.')->title('Language'),
            // Select::make('light_theme')->fromEnum(Themes::class)->fromModel(User::class, 'settings')->title('Light theme'),
            // Select::make('dark_theme')->fromEnum(Themes::class)->fromModel(User::class, 'settings')->title('Dark theme'),
        ];
    }
}
