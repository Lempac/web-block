<?php

namespace App\Http\Requests;

use App\Enums\PanelPosition;
use App\Enums\Themes;
use Auth;
use Illuminate\Foundation\Http\FormRequest;
use OpenApi\Attributes\Schema;

#[Schema(description: 'Request for updating user style', ref: '#/components/schemas/Style')]

class UpdateStyleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'controlPosition' => 'required|in:'.implode(',', array_column(PanelPosition::cases(), 'value')),
            'minimapPosition' => 'required|in:'.implode(',', array_column(PanelPosition::cases(), 'value')),
            'pathPosition' => 'required|in:'.implode(',', array_column(PanelPosition::cases(), 'value')),
            'baseLightTheme' => 'required|in:'.implode(',', array_column(Themes::cases(), 'value')),
            'baseDarkTheme' => 'required|in:'.implode(',', array_column(Themes::cases(), 'value')),
        ];
    }
}
