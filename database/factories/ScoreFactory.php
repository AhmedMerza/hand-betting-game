<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Score>
 */
class ScoreFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'player_name' => $this->faker->name(),
            'score' => $this->faker->numberBetween(0, 5000),
            'reshuffles' => $this->faker->numberBetween(0, 3),
        ];
    }
}
