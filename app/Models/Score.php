<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Cache;

class Score extends Model
{
    use HasFactory;

    protected $fillable = ['player_name', 'score', 'reshuffles'];

    /**
     * The "booted" method of the model.
     * Conditional Cache Invalidation: Only clear if the new score 
     * is high enough to impact the Top 5.
     */
    protected static function booted(): void
    {
        static::created(function (Score $score) {
            $cached = Cache::get('leaderboard_top_5');

            if (!$cached || count($cached) < 5) {
                Cache::forget('leaderboard_top_5');
                return;
            }

            $lowestCachedScore = $cached->last()->score;
            if ($score->score > $lowestCachedScore) {
                Cache::forget('leaderboard_top_5');
            }
        });
    }

    /**
     * Get Cached Leaderboard.
     */
    public static function getCachedLeaderboard()
    {
        return Cache::remember('leaderboard_top_5', 3600, function () {
            return self::topScores()->get();
        });
    }

    /**
     * Scope: Get the top leaderboard scores.
     */
    public function scopeTopScores(Builder $query, int $limit = 5): Builder
    {
        return $query->orderBy('score', 'desc')->limit($limit);
    }
}
