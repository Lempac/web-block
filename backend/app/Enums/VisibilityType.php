<?php

namespace App\Enums;

use OpenApi\Attributes\Schema;

#[Schema(deprecated: true, type: 'string')]
enum VisibilityType: string
{
    case Private = 'private';
    case Public = 'public';
}
