<?php

namespace App\Http\Requests\Api;

use App\Enums\VisibilityType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ProjectRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['string', 'required'],
            'description' => ['string', 'max:20'],
            'full_description' => ['string', 'max:120'],
            'visibility' => ['required', 'in:' . implode(',', array_column(VisibilityType::cases(), 'value'))],
        ];
    }
}
