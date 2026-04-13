import os
import json
from pathlib import Path

def check_link():
    """
    Verifies that the core project files and environment are healthy.
    """
    print("🚀 B.L.A.S.T. Link Checker starting...")
    
    required_files = [
        "gemini.md",
        "architecture/tournament_ops.md",
        "task_plan.md",
        ".env"
    ]
    
    health = True
    for f in required_files:
        if Path(f).exists():
            print(f"✅ FOUND: {f}")
        else:
            print(f"❌ MISSING: {f}")
            health = False
            
    # Check .tmp directory
    if Path(".tmp").is_dir():
        print("✅ FOUND: .tmp directory")
    else:
        print("❌ MISSING: .tmp directory")
        health = False
        
    if health:
        print("\n🟢 LINK ESTABLISHED: Project environment is ready.")
    else:
        print("\n🔴 LINK BROKEN: Missing critical components.")
        exit(1)

if __name__ == "__main__":
    check_link()
