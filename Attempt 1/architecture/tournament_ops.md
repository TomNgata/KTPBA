# 📖 SOP: Tournament Operations (Layer 1)

## 🎯 Goal
Provide a deterministic protocol for managing the **KTPBA Singles Tournament 2026**. This SOP governs data integrity, score aggregation, and bracket progression.

## 🛠️ Logic & Rules

### 1. Match Scoring
- **Input:** Raw scores per game for each player.
- **Aggregation:** Total Score = Sum of all games.
- **Average:** Average Score = Total Score / Number of games played.
- **Delta:** Difference in rank between the current update and the previous state.

### 2. Leaderboard Management
- **Sorting:** Players are ranked by `total_score` (Descending).
- **Tie-breaker:** In case of equal `total_score`, the player with the higher single-game score wins.
- **Podium:** Positions 1, 2, and 3 must be highlighted with Gold, Silver, and Bronze tokens.

### 3. Bracket Automation
- **Transition:** Once a "Live" round is completed, the winner must be promoted to the next stage.
- **Validation:** Stage names must follow: `Qualifying` → `Semi-Final` → `Final`.
- **Match IDs:** Must be unique and follow the pattern `mXXX`.

## 📂 Data Interaction
- All tools must validate input against the schema in `gemini.md`.
- Final state must be written to `tournament_data.json`.

## ⚠️ Edge Cases
- **Missing Score:** Record as `0` but exclude from Average if game not started.
- **Player Withdrawal:** Mark status as "Withdrawn" and remove from active bracket slots.
