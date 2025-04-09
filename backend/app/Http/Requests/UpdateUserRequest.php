<?php

namespace App\Http\Requests;

use Auth;
use Illuminate\Foundation\Http\FormRequest;
use OpenApi\Attributes\Property;
use OpenApi\Attributes\Schema;

#[Schema(description: 'Request to update user information',
    properties: [
        new Property(property: 'name', type: 'string'),
        new Property(property: 'email', type: 'string', format: 'email'),
        new Property(property: 'password', type: 'string', format: 'password', nullable: true),
        new Property(property: 'settings', properties: [
            new Property(property: 'lang', type: 'string', format: 'enum', enum: ['en', 'lv']),
            new Property(property: 'hideExtensions', type: 'boolean'),
            new Property(property: 'defaultBranch', type: 'string', default: 'main'),
        ], required: ['lang', 'hideExtensions', 'defaultBranch']),
    ], required: ['name', 'email', 'password', 'settings'])]
class UpdateUserRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.Auth::user()->id,
            'password' => 'nullable|min:8|confirmed|password',
            'settings.hideExtensions' => 'required|boolean',
            'settings.defaultBranch' => 'required|string|max:255',
            'settings.lang' => 'required|string|max:2|min:2',
        ];
    }
}
