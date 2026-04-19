<?php

namespace App\DTOs;

class ScoreDTO
{
    public function __construct(
        public readonly int $score,
        public readonly int $reshuffles,
        public readonly ?string $playerName = 'Guest',
    ) {}

    /**
     * Create a DTO from an array or request.
     */
    public static function fromArray(array $data): self
    {
        return new self(
            score: $data['score'],
            reshuffles: $data['reshuffles'],
            playerName: $data['player_name'] ?? 'Guest',
        );
    }
}
