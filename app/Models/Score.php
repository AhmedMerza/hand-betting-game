<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Score extends Model
{
    use HasFactory;

    protected $fillable = ['player_name', 'score', 'reshuffles'];

    /**
     * Scope: Get the top leaderboard scores.
     * (Fat Model Pattern: Encapsulating query logic here)
     */
    public function scopeTopScores(Builder $query, int $limit = 5): Builder
    {
        return $query->orderBy('score', 'desc')->limit($limit);
    }
}
