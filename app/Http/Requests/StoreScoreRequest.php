<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreScoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'score' => 'required|integer',
            'reshuffles' => 'required|integer',
            'player_name' => 'nullable|string|max:20',
        ];
    }
}
