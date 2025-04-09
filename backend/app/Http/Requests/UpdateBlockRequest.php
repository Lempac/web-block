<?php

namespace App\Http\Requests;

use Auth;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use OpenApi\Attributes\Property;
use OpenApi\Attributes\Schema;

#[Schema(properties: [
    new Property(property: 'x', type: 'integer'),
    new Property(property: 'y', type: 'integer'),
    new Property(property: 'width', type: 'integer'),
    new Property(property: 'height', type: 'integer'),
    new Property(property: 'path', type: 'string'),
    new Property(property: 'content', type: 'string', nullable: true),
], required: ['x', 'y', 'width', 'height', 'path', 'content'])]
class UpdateBlockRequest extends FormRequest
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
            'x' => 'required|integer',
            'y' => 'required|integer',
            'width' => 'required|integer',
            'height' => 'required|integer',
            'path' => 'required|string',
            'content' => 'nullable|string',
        ];
    }
}
