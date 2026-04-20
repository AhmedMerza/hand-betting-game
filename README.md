# Hand Betting Game

## Overview
A web-based **"Hand Betting Game"** built with Mahjong tiles. The project focuses on game state management, polished UI interactions, and a scalable code structure. The game features a dynamic tile-scaling system where specific tiles change value based on hand outcomes.

Current features:
- Landing page with **Start New Game** and **Top 5 leaderboard**
- Full Mahjong tile set (Number, Wind, Dragon) with dynamic scaling
- Draw pile + discard pile tracking with reshuffle mechanics
- Game-over conditions:
  - Any tile reaches `0` or `10`
  - Draw pile exhaustion on the 3rd run-out
- In-game history view, animated counters, and animated hand transitions
- End-game save score flow with redirect back to landing page

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

### 2. Service Layer, DTOs & Fat Models
Implementation of a Service Layer and Data Transfer Objects (DTOs) ensures a strict separation of concerns. The `Score` model encapsulates query and caching logic (Fat Model Pattern).

### 3. Optimized Caching Strategy
**Decision:** Implementation of **Conditional Cache Invalidation**.
**Rationale:** The Top 5 leaderboard is cached using the `file` driver. To optimize performance, the cache is only invalidated if a newly created score is high enough to enter the Top 5 list. This avoids unnecessary cache rebuilds for low-scoring games.

### 4. Eager vs. Lazy Loading
**Decision:** The leaderboard is eager-loaded via shared props.
**Rationale:** Given the small size of a Top 5 list, eager loading provides a better UX by eliminating "Loading..." states and extra network round-trips. Lazy loading was considered but rejected for this specific scale to maintain a "snappy" landing page experience.

### 5. "The Growing Universe" Reshuffle
When the Draw Pile is empty, a completely fresh 136-tile deck is added to the pool, demonstrating the application's ability to handle high-volume, stateful entities.

Current game constants:
- `MAX_RESHUFFLES = 2`
- `MAX_EXHAUSTIONS = 3`

This means the game allows two successful reshuffles, and ends when the draw pile runs out for the third time.

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
AI tooling was used for architectural consultation, refactoring assistance, and iteration support during implementation and debugging.
