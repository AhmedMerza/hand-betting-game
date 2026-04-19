<?php

use App\Http\Controllers\ScoreController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'laravelVersion' => Illuminate\Foundation\Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/game', function () {
    return Inertia::render('Game');
});

Route::post('/scores', [ScoreController::class, 'store'])->name('scores.store');
