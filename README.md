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
- **Package Manager:** NPM (Chosen for maximum "zero-friction" compatibility for reviewers).

---

## Architectural Decisions & Patterns

### 1. State Machine Pattern (Game Engine)
The core game engine is implemented as a Finite State Machine (FSM) within a Zustand store. This prevents illegal game transitions (e.g., betting during an animation) and makes the game logic predictable and easy to test.

### 2. "The Growing Universe" Reshuffle
**Decision:** When the Draw Pile is empty, a completely fresh 136-tile deck is added to the pool.
**Rationale:** This creates a "growing universe" of tiles, demonstrating the application's ability to handle high-volume, stateful entities efficiently while increasing gameplay variety.

### 3. "Local-First" Session Management
The frontend is the source of truth for the active game session to ensure zero-latency. The backend serves as a secure vault for Leaderboard verification.

### 4. Strategy Pattern (Evaluation)
Hand evaluation logic is decoupled from UI components. This allows for easy injection of new rules without refactoring the visual layer.

---

## Testing Strategy

To verify this project, you can run:
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
