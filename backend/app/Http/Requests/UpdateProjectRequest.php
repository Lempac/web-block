<?php

namespace App\Http\Requests;

use App\Enums\VisibilityType;
use Auth;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use OpenApi\Attributes\Property;
use OpenApi\Attributes\Schema;

#[Schema(properties: [
    new Property(property: 'name', type: 'string'),
    new Property(property: 'description', type: 'string', nullable: true),
    new Property(property: 'x', type: 'integer'),
    new Property(property: 'y', type: 'integer'),
    new Property(property: 'zoom', type: 'number', format: 'float'),
], required: ['name', 'description', 'x', 'y', 'zoom'])]
class UpdateProjectRequest extends FormRequest
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
            'name' => 'required|string',
            // 'visibility' => 'required|in:'.implode(',', array_column(VisibilityType::cases(), 'value')),
            'description' => 'nullable|string',
            'x' => 'required|integer',
            'y' => 'required|integer',
            'zoom' => 'required|numeric',
        ];
    }
}
