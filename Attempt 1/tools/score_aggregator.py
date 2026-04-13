import json
import os
from pathlib import Path

DATA_FILE = "tournament_data.json"

def validate_schema(data):
    """Simple validation against gemini.md rules."""
    required_keys = ["tournament", "players", "matches"]
    for key in required_keys:
        if key not in data:
            raise ValueError(f"Missing required key: {key}")
    return True

def load_data():
    if not Path(DATA_FILE).exists():
        # Initialize with default template if missing
        return {
            "tournament": {
                "name": "KTPBA Singles Tournament 2026",
                "edition": "Women's Day Edition",
                "date": "2026-03-15",
                "venue": "Strike Zone · TRM",
                "status": "Live"
            },
            "players": [],
            "matches": []
        }
    with open(DATA_FILE, "r") as f:
        return json.load(f)

def save_data(data):
    validate_schema(data)
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)
    print(f"✅ Data saved to {DATA_FILE}")

def update_scores(player_id, score):
    """Updates a player's score and recalculates stats."""
    data = load_data()
    
    player_found = False
    players = data.get("players", [])
    for player in players:
        if player.get("id") == player_id:
            stats = player.get("stats", {})
            stats["total_score"] = stats.get("total_score", 0) + score
            player_found = True
            break
            
    if not player_found:
        print(f"❌ Player {player_id} not found.")
        return

    # Recalculate Ranks
    players.sort(key=lambda x: x.get("stats", {}).get("total_score", 0), reverse=True)
    for i, p in enumerate(players):
        stats = p.get("stats", {})
        old_rank = p.get("rank", i + 1)
        p["rank"] = i + 1
        delta = old_rank - p["rank"]
        stats["delta"] = f"+{delta}" if delta > 0 else str(delta)

    save_data(data)

if __name__ == "__main__":
    # Test initialization
    save_data(load_data())
