import json
import os
from pathlib import Path

DATA_FILE = "tournament_data.json"

def load_data():
    if not Path(DATA_FILE).exists():
        print("❌ Data file missing. Run score_aggregator.py first.")
        return None
    with open(DATA_FILE, "r") as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)
    print(f"✅ Data saved to {DATA_FILE}")

def promote_winner(match_id):
    """Promotes the winner of a match to the next stage."""
    data = load_data()
    if not data: return

    match_to_update = None
    matches = data.get("matches", [])
    for match in matches:
        if match.get("id") == match_id:
            match_to_update = match
            break
            
    if not match_to_update:
        print(f"❌ Match {match_id} not found.")
        return

    winner_id = match_to_update.get("winner")
    if not winner_id:
        print(f"❌ Match {match_id} has no winner yet.")
        return

    print(f"🏆 Promoting {winner_id} from {match_id}...")
    
    # Logic for finding next match based on stage
    if match_to_update.get("stage") == "Semi-Final":
        # Find or create a 'Final' match
        final_match = None
        for m in matches:
            if m.get("stage") == "Final":
                final_match = m
                break
        
        if not final_match:
            final_match = {
                "id": "m_final",
                "stage": "Final",
                "players": [],
                "scores": {},
                "winner": None,
                "status": "Scheduled"
            }
            matches.append(final_match)
            
        final_players = final_match.get("players", [])
        if winner_id not in final_players:
            final_players.append(winner_id)
            
    save_data(data)

if __name__ == "__main__":
    # Test logic
    print("Bracket Generator logic loaded.")
