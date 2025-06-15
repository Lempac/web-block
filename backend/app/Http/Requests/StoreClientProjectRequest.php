<?php

namespace App\Http\Requests;

use Auth;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use OpenApi\Attributes\Property;
use OpenApi\Attributes\Schema;

#[Schema(properties: [
    new Property(property: 'id', type: 'string', format: 'uuid'),
    new Property(property: 'name', type: 'string'),
    new Property(property: 'description', type: 'string'),
    new Property(property: 'x', type: 'integer'),
    new Property(property: 'y', type: 'integer'),
    new Property(property: 'zoom', type: 'number', format: 'float'),
    new Property(property: 'default_branch', type: 'string'),
    new Property(property: 'url', type: 'string'),
    new Property(property: 'oid', type: 'string'),
    new Property(property: 'cwd', type: 'string'),
], required: ['id', 'name', 'description', 'x', 'y', 'zoom', 'default_branch', 'oid', 'cwd'])]
class StoreClientProjectRequest extends FormRequest
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
            'id' => 'string|required|uuid',
            'name' => 'string|required',
            'description' => 'string|required',
            'x' => 'integer|required',
            'y' => 'integer|required',
            'zoom' => 'numeric|required',
            'default_branch' => 'string|required',
            'url' => 'string|nullable',
            'oid' => 'string|required',
            'cwd' => 'string|required',
        ];
    }
}
