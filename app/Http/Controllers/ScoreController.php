<?php

namespace App\Http\Controllers;

use App\Models\Score;
use App\Services\ScoreService;
use App\Http\Requests\StoreScoreRequest;
use App\DTOs\ScoreDTO;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ScoreController extends Controller
{
    public function __construct(
        protected ScoreService $scoreService
    ) {}

    /**
     * Display the leaderboard using the Fat Model scope.
     */
    public function index(): Response
    {
        return Inertia::render('Welcome', [
            'leaderboard' => Score::topScores()->get()
        ]);
    }

    /**
     * Store a new score using a FormRequest and DTO.
     */
    public function store(StoreScoreRequest $request): RedirectResponse
    {
        // Convert validated data into a DTO
        $dto = ScoreDTO::fromArray($request->validated());

        // Pass DTO to Service
        $this->scoreService->recordScore($dto);

        return redirect()->back();
    }
}
