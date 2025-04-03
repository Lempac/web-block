<?php

namespace App\Enums;
use OpenApi\Attributes\{Schema};

#[Schema(type: 'string')]
enum Themes: string
{
    case Light = 'light';
    case Dark = 'dark';
    case Cupcake = 'cupcake';
    case Bumblebee = 'bumblebee';
    case Emerald = 'emerald';
    case Corporate = 'corporate';
    case Synthwave = 'synthwave';
    case Retro = 'retro';
    case Cyberpunk = 'cyberpunk';
    case Valentine = 'valentine';
    case Halloween = 'halloween';
    case Garden = 'garden';
    case Forest = 'forest';
    case Aqua = 'aqua';
    case Lofi = 'lofi';
    case Pastel = 'pastel';
    case Fantasy = 'fantasy';
    case Wireframe = 'wireframe';
    case Black = 'black';
    case Luxury = 'luxury';
    case Dracula = 'dracula';
    case Cmyk = 'cmyk';
    case Autumn = 'autumn';
    case Business = 'business';
    case Acid = 'acid';
    case Lemonade = 'lemonade';
    case Night = 'night';
    case Coffee = 'coffee';
    case Winter = 'winter';
    case Dim = 'dim';
    case Nord = 'nord';
    case Sunset = 'sunset';
}
