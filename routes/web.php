<?php

use App\Http\Controllers\ScoreController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [ScoreController::class, 'index']);

Route::get('/tutorial', function (Request $request) {
    return Inertia::render('Tutorial', [
        'from' => $request->query('from', 'landing'),
    ]);
});

Route::get('/game', function () {
    return Inertia::render('Game');
});

Route::post('/scores', [ScoreController::class, 'store'])->name('scores.store');
