import json
from pathlib import Path

# Note: In a real scenario, this would use the Supabase Python client.
# For this agentic workflow, we will simulate the push logic or use raw SQL via MCP if needed.
# But FIRST, let's prepare the SQL insert statements for the extracted data.

DATA_FILE = "tournament_data.json"

def generate_insert_sql():
    with open(DATA_FILE, "r") as f:
        data = json.load(f)
    
    sql_statements = []
    
    # Players
    for p in data["players"]:
        stats = p["stats"]
        sql = f"INSERT INTO players (id, name, club, rank, total_score, avg, delta) VALUES ('{p['id']}', '{p['name']}', '{p['club']}', {p['rank']}, {stats['total_score']}, {stats['avg']}, '{stats['delta']}') ON CONFLICT (id) DO UPDATE SET total_score = EXCLUDED.total_score, rank = EXCLUDED.rank, avg = EXCLUDED.avg, delta = EXCLUDED.delta;"
        sql_statements.append(sql)
        
    # Matches
    for m in data["matches"]:
        p1 = m["players"][0] if len(m["players"]) > 0 else "NULL"
        p2 = m["players"][1] if len(m["players"]) > 1 else "NULL"
        s1 = m["scores"].get(p1, "NULL") if p1 != "NULL" else "NULL"
        s2 = m["scores"].get(p2, "NULL") if p2 != "NULL" else "NULL"
        winner = f"'{m['winner']}'" if m['winner'] else "NULL"
        
        # SQL handles NULL without quotes
        p1_val = f"'{p1}'" if p1 != "NULL" else "NULL"
        p2_val = f"'{p2}'" if p2 != "NULL" else "NULL"
        
        sql = f"INSERT INTO matches (id, stage, player1_id, player2_id, score1, score2, winner_id, status) VALUES ('{m['id']}', '{m['stage']}', {p1_val}, {p2_val}, {s1}, {s2}, {winner}, '{m['status']}') ON CONFLICT (id) DO UPDATE SET score1 = EXCLUDED.score1, score2 = EXCLUDED.score2, winner_id = EXCLUDED.winner_id, status = EXCLUDED.status;"
        sql_statements.append(sql)
        
    return "\n".join(sql_statements)

if __name__ == "__main__":
    print(generate_insert_sql())
