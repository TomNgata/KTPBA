# 📜 Project Constitution: KTPBA

## 🎯 Mission
Build and maintain a deterministic tournament management system for the **KTPBA Singles Tournament 2026 (Women's Day Edition)**, providing real-time leaderboard tracking, bracket automation, and a high-fidelity dashboard for players and fans at Strike Zone TRM.

## 🛠️ Data Schemas

### Tournament State (`tournament_data.json`)
```json
{
  "tournament": {
    "name": "KTPBA Singles Tournament 2026",
    "edition": "Women's Day Edition",
    "date": "2026-03-15",
    "venue": "Strike Zone · TRM",
    "status": "Live"
  },
  "players": [
    {
      "id": "p001",
      "name": "Wanjiru Kamau",
      "club": "Nairobi Strikers",
      "rank": 1,
      "stats": { "total_score": 1245, "avg": 207.5, "delta": "+2" }
    }
  ],
  "matches": [
    {
      "id": "m001",
      "stage": "Semi-Final",
      "players": ["p001", "p002"],
      "scores": { "p001": 221, "p002": 187 },
      "winner": "p001",
      "status": "Completed"
    }
  ]
}
```

## 📏 Behavioral Rules
- Follow B.L.A.S.T. protocol.
- Follow A.N.T. 3-layer architecture.
- Reliability over speed.
- Never guess at business logic.
- **Brand Fidelity:** Use KTPBA Green (#1A5C2A) and Red (#C8373A).
- **Data First:** Any tool update must be preceded by a schema validation.

## 🏗️ Architectural Invariants
- Separated SOPs, Reasoning, and Tools.

## 📝 Maintenance Log
- 2026-03-15: Initialized Project Constitution.
- 2026-03-15: Completed B.L.A.S.T. Implementation (v1.0.0). Built A.N.T. layers and verified tournament state.
- 2026-03-15: Integrated Supabase backend and migrated Seeding data (40 players).
- 2026-03-15: Processed Round of 16 results and deployed flagship Dashboard v2 with "Tournament Story" narrative. Seeded Quarter-Finals.
