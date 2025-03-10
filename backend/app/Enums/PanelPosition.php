<?php

namespace App\Enums;

enum PanelPosition: string
{
    case TopLeft = "top-left";
    case TopRight = "top-right";
    case TopCenter = "top-center";
    case BottomLeft = "bottom-left";
    case BottomCenter = "bottom-center";
    case BottomRight = "bottom-right";
}