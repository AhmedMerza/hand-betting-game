<?php

namespace App\Services;

use App\Models\Score;
use App\DTOs\ScoreDTO;

class ScoreService
{
    /**
     * Record a new game score.
     * (Service Pattern: Encapsulating business logic using a DTO)
     */
    public function recordScore(ScoreDTO $dto): Score
    {
        return Score::create([
            'player_name' => $dto->playerName,
            'score' => $dto->score,
            'reshuffles' => $dto->reshuffles,
        ]);
    }
}
