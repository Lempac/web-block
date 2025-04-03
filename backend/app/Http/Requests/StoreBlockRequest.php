<?php

namespace App\Http\Requests;

use Auth;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use OpenApi\Attributes\{Schema, Property};

#[Schema(properties: [
    new Property(property: 'x', type: 'integer'),
    new Property(property: 'y', type: 'integer'),
    new Property(property: 'path', type: 'string'),
    new Property(property: 'content', type: 'string', nullable: true)
], required: ['x', 'y', 'path', 'content'])]
class StoreBlockRequest extends FormRequest
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
            'x' => 'require|integer',
            'y' => 'require|integer',
            'path' => 'require|string',
            'content' => 'nullable|string'
        ];
    }
}
