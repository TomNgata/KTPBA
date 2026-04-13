import json
import os

DATA_FILE = "tournament_data.json"

def refine_payload():
    """Final check and formatting of the tournament payload."""
    if not os.path.exists(DATA_FILE):
        print("❌ No payload found.")
        return

    with open(DATA_FILE, 'r') as f:
        data = json.load(f)

    # Ensure brand names are correct as per Constitution
    data["tournament"]["name"] = "KTPBA Singles Tournament 2026"
    
    # Sort players by rank just to be safe
    data["players"].sort(key=lambda x: x["rank"])
    
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)
        
    print(f"✨ Payload Refined: {DATA_FILE}")

if __name__ == "__main__":
    refine_payload()
