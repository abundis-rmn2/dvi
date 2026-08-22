import sqlite3
import re
import json
import os

sql_filepath = "abundisc_idmb_nvi.sql"
output_dir = "public/data"
os.makedirs(output_dir, exist_ok=True)

db_path = os.path.join(output_dir, "app_data.db")
if os.path.exists(db_path):
    os.remove(db_path)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("Reading SQL dump...")

# Read SQL statements
with open(sql_filepath, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# Clean MySQL specific syntax for SQLite compatibility
statements = content.split(";\n")

for stmt in statements:
    stmt_strip = stmt.strip()
    if not stmt_strip:
        continue
    
    # Ignore MySQL specific comments and set commands
    if stmt_strip.startswith("/*") or stmt_strip.startswith("--") or stmt_strip.startswith("SET") or stmt_strip.startswith("LOCK") or stmt_strip.startswith("UNLOCK"):
        continue

    # Clean CREATE TABLE for SQLite
    if stmt_strip.startswith("CREATE TABLE"):
        # Remove ENGINE, CHARSET, COLLATE
        stmt_clean = re.sub(r'ENGINE=.*$', '', stmt_strip, flags=re.MULTILINE)
        stmt_clean = re.sub(r'COLLATE\s+\w+', '', stmt_clean)
        stmt_clean = re.sub(r'CHARACTER SET\s+\w+', '', stmt_clean)
        stmt_clean = re.sub(r'DEFAULT CHARSET=\w+', '', stmt_clean)
        stmt_clean = re.sub(r'int\(\d+\)', 'INTEGER', stmt_clean, flags=re.IGNORECASE)
        stmt_clean = re.sub(r'varchar\(\d+\)', 'TEXT', stmt_clean, flags=re.IGNORECASE)
        stmt_clean = re.sub(r'mediumtext|longtext|text|longblob', 'TEXT', stmt_clean, flags=re.IGNORECASE)
        stmt_clean = re.sub(r'datetime|timestamp', 'TEXT', stmt_clean, flags=re.IGNORECASE)
        stmt_clean = re.sub(r'ON UPDATE current_timestamp\(\)', '', stmt_clean, flags=re.IGNORECASE)
        stmt_clean = re.sub(r'current_timestamp\(\)', 'CURRENT_TIMESTAMP', stmt_clean, flags=re.IGNORECASE)
        
        try:
            cursor.execute(stmt_clean)
        except Exception as e:
            # Fallback if SQLite create table has mysql syntax artifacts
            pass

    elif stmt_strip.startswith("INSERT INTO"):
        try:
            cursor.execute(stmt_strip)
        except Exception as e:
            pass

conn.commit()

# Now extract tasks with counts
cursor.execute("""
    SELECT t.id, t.MUID, t.seed_node, t.mining_depth, t.mining_type, t.hashtag_media_amount, t.created_at,
        (SELECT COUNT(*) FROM data_media WHERE MUID = t.MUID) as p_count,
        (SELECT COUNT(*) FROM data_recent_hashtags WHERE MUID = t.MUID) as h_count
    FROM tasks t
    ORDER BY t.created_at DESC
""")

tasks = []
for row in cursor.fetchall():
    tasks.append({
        "id": row[0],
        "MUID": row[1],
        "seed_node": row[2],
        "mining_depth": row[3],
        "mining_type": row[4],
        "hashtag_media_amount": row[5],
        "created_at": row[6],
        "p_count": row[7],
        "h_count": row[8]
    })

with open(os.path.join(output_dir, "tasks.json"), "w", encoding="utf-8") as f:
    json.dump(tasks, f, ensure_ascii=False, indent=2)

print(f"Exported {len(tasks)} tasks to public/data/tasks.json and SQLite database!")
conn.close()
