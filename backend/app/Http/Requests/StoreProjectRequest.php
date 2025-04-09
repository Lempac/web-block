<?php

namespace App\Http\Requests;

use Auth;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use OpenApi\Attributes\Property;
use OpenApi\Attributes\Schema;

#[Schema(properties: [
    new Property(property: 'nameOrUrl', type: 'string'),
], required: ['nameOrUrl'])]
class StoreProjectRequest extends FormRequest
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
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'nameOrUrl' => 'required|string',
            // 'visibility' => 'required|in:'.implode(',', array_column(VisibilityType::cases(), 'value')),
            // 'description' => 'nullable|string',
        ];
    }
}
