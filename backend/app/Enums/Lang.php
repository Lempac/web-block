<?php

namespace App\Enums;

use OpenApi\Attributes\Schema;

#[Schema(type: 'string')]
enum Lang: string
{
    case LV = 'lv';
    case EN = 'en';

    public function localized(): string
    {
        return match ($this) {
            self::EN => __('English'),
            self::LV => __('Latvian'),
        };
    }
}
