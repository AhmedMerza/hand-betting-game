# Hand Betting Game - Technical Assessment

## Overview
A web-based **"Hand Betting Game"** built with Mahjong tiles. This project evaluates complex state management, UI polish, and scalable architecture. The game features a dynamic tile-scaling system where specific tiles change value based on hand outcomes.

## Tech Stack
- **Backend:** Laravel 13 (with SQLite)
- **Frontend:** React, Inertia.js, TypeScript
- **State Management:** Zustand
- **Animations:** Framer Motion
- **Styling:** Tailwind CSS (v4)
- **Testing:** 
    - **Pest PHP:** Backend & Integration testing.
    - **Vitest:** Frontend Logic & State Machine testing.

---

## Architectural Decisions & Patterns

### 1. State Machine Pattern (Game Engine)
The core game engine is implemented as a Finite State Machine (FSM) within a Zustand store. This prevents illegal game transitions and makes the logic predictable.

### 2. Service Layer & DTOs
**Decision:** Implementation of a Service Layer and Data Transfer Objects (DTOs).
**Rationale:** This ensures a strict separation of concerns. The `StoreScoreRequest` handles validation, the `ScoreDTO` ensures a typed data contract, and the `ScoreService` handles the business logic. This makes the backend highly testable and decoupled from HTTP concerns.

### 3. Fat Models & Scopes
Query logic is encapsulated in the `Score` model via scopes (e.g., `topScores()`), adhering to the "Skinny Controller, Fat Model" principle for clean data fetching.

### 4. "The Growing Universe" Reshuffle
When the Draw Pile is empty, a completely fresh 136-tile deck is added to the pool, demonstrating the application's ability to handle high-volume, stateful entities.

### 5. Omission of Soft Deletes
**Decision:** Hard deletes used for leaderboard entries.
**Rationale:** Leaderboard entries are immutable historical records. Soft deletes add unnecessary complexity for data that is never intended to be restored.

---

## Testing Strategy
```bash
# Run Backend Tests (Pest)
./vendor/bin/pest

# Run Frontend Logic Tests (Vitest)
npm test
```

---

## Setup Instructions

1. **Clone the repository**
2. **Install PHP dependencies:** `composer install`
3. **Install JS dependencies:** `npm install`
4. **Environment Setup:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   touch database/database.sqlite
   php artisan migrate
   ```
5. **Run the development servers:**
   - Terminal 1: `php artisan serve`
   - Terminal 2: `npm run dev`

---

## AI Disclosure
Gemini (AI) was used in the development of this project for architectural consultation, boilerplate generation, and strategic planning.
