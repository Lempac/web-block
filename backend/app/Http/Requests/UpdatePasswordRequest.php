<?php

namespace App\Http\Requests;

use Auth;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules;
use OpenApi\Attributes\Property;
use OpenApi\Attributes\Schema;

#[Schema(description: 'Request to update user password',
    properties: [
        new Property(property: 'oldPassword', type: 'string', format: 'password'),
        new Property(property: 'newPassword', type: 'string', format: 'password'),
        new Property(property: 'newPassword_confirmation', type: 'string', format: 'password'),
    ], required: ['oldpassword', 'newpassword', 'newPassword_confirmation'])]
class UpdatePasswordRequest extends FormRequest
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
        $user = Auth::user();

        $rules = [
            'newPassword' => ['required', 'confirmed', Rules\Password::defaults(), function ($attribute, $value, $fail) use ($user) {
                if (! $user->has_github && ! ($user->password === null || $user->password === '') && $this->filled('oldPassword') && $value === $this->oldPassword) {
                    $fail(__('validation.different', ['other' => __('base.update-password.old-password.label')]));
                }
            }, ],
        ];

        if ($user->has_github) {
            // If the user has GitHub, oldPassword is not required if newPassword is null or empty
            $rules['oldPassword'] = 'nullable|min:8|string';
        } else {
            // If the user does not have GitHub, oldPassword is required if newPassword is not null or empty
            $rules['oldPassword'] = 'required|string|min:8|current_password:api';
        }

        return $rules;
    }
}
