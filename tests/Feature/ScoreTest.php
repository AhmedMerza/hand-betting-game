<?php

use App\Models\Score;
use Inertia\Testing\AssertableInertia as Assert;
use Illuminate\Support\Facades\Cache;

beforeEach(function () {
    Cache::flush();
});

test('the welcome page displays the leaderboard', function () {
    $this->withoutVite();
    // 1. Arrange: Create some scores
    Score::factory()->create(['player_name' => 'Alice', 'score' => 100]);
    Score::factory()->create(['player_name' => 'Bob', 'score' => 200]);

    // 2. Act & Assert: Visit the home page
    $this->get('/')
        ->assertStatus(200)
        ->assertInertia(fn (Assert $page) => $page
            ->component('Welcome')
            ->has('leaderboard', 2)
            ->where('leaderboard.0.player_name', 'Bob') // Bob should be #1 (200)
            ->where('leaderboard.1.player_name', 'Alice') // Alice should be #2 (100)
        );
});

test('a new score can be stored after a game', function () {
    $this->withoutVite();
    // Act: Send a POST request to save a score
    $response = $this->post('/scores', [
        'player_name' => 'Winner',
        'score' => 500,
        'reshuffles' => 1,
    ]);

    // Assert: Check if it's in the database and redirects back
    $response->assertStatus(302); // Redirect
    $this->assertDatabaseHas('scores', [
        'player_name' => 'Winner',
        'score' => 500,
    ]);
});

test('the leaderboard is limited to the top 5 scores in descending order', function () {
    $this->withoutVite();

    foreach ([100, 500, 200, 700, 300, 600, 400] as $index => $score) {
        Score::factory()->create([
            'player_name' => 'Player '.$index,
            'score' => $score,
        ]);
    }

    $this->get('/')
        ->assertStatus(200)
        ->assertInertia(fn (Assert $page) => $page
            ->component('Welcome')
            ->has('leaderboard', 5)
            ->where('leaderboard.0.score', 700)
            ->where('leaderboard.1.score', 600)
            ->where('leaderboard.2.score', 500)
            ->where('leaderboard.3.score', 400)
            ->where('leaderboard.4.score', 300)
        );
});

test('a score submission must pass validation', function () {
    $this->withoutVite();

    $response = $this->from('/game')->post('/scores', [
        'player_name' => str_repeat('A', 21),
        'score' => 'not-an-integer',
        'reshuffles' => 'bad',
    ]);

    $response
        ->assertStatus(302)
        ->assertRedirect('/game')
        ->assertSessionHasErrors(['player_name', 'score', 'reshuffles']);

    $this->assertDatabaseCount('scores', 0);
});
