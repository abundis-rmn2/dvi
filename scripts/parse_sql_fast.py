import sqlite3
import re
import json
import os

sql_files = ["abundisc_idmb_nvi.sql", "media_users.sql"]
output_dir = "public/data"
os.makedirs(output_dir, exist_ok=True)

db_path = os.path.join(output_dir, "app_data.db")

# Open database with timeout
conn = sqlite3.connect(db_path, timeout=30)
cursor = conn.cursor()

print("Initializing SQLite schema...")

cursor.executescript("""
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY,
  MUID TEXT NOT NULL,
  seed_node TEXT NOT NULL,
  mining_depth INTEGER,
  mining_type TEXT,
  hashtag_media_amount INTEGER,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS data_media (
  id INTEGER PRIMARY KEY,
  user_id TEXT,
  MUID TEXT NOT NULL,
  pk TEXT,
  m_id TEXT,
  taken_at TEXT,
  media_type INTEGER,
  product_type TEXT,
  location TEXT,
  comment_count INTEGER,
  like_count INTEGER,
  caption_text TEXT,
  media TEXT,
  hashtags_used BLOB,
  hashtag_origin TEXT,
  inference_custom TEXT,
  hashtag_detection TEXT,
  inference_world TEXT
);

CREATE TABLE IF NOT EXISTS data_recent_hashtags (
  id INTEGER PRIMARY KEY,
  MUID TEXT NOT NULL,
  hashtag TEXT NOT NULL,
  no_publications INTEGER,
  IG_related_hashtags BLOB,
  hashtags_founded BLOB,
  mined_at TEXT
);

CREATE TABLE IF NOT EXISTS data_users (
  id INTEGER PRIMARY KEY,
  MUID TEXT,
  pk TEXT,
  username TEXT,
  full_name TEXT,
  is_private INTEGER,
  profile_pic_url TEXT,
  media_count INTEGER,
  following_count INTEGER,
  follower_count INTEGER,
  biography TEXT,
  external_url TEXT,
  account_type TEXT,
  is_business INTEGER,
  public_email TEXT,
  city_id TEXT,
  city_name TEXT,
  following TEXT,
  mined_at TEXT
);
""")

def parse_sql_values(line):
    line = line.strip()
    if line.endswith(",") or line.endswith(";"):
        line = line[:-1].strip()
    if not (line.startswith("(") and line.endswith(")")):
        return None
    content = line[1:-1]
    
    vals = []
    curr = []
    in_quote = False
    escape = False
    
    for char in content:
        if escape:
            if char == "n":
                curr.append("\n")
            elif char == "r":
                curr.append("\r")
            elif char == "t":
                curr.append("\t")
            elif char == "0":
                curr.append("\x00")
            elif char == "\\":
                curr.append("\\")
            elif char == "\x27":
                curr.append("\x27")
            elif char == "\x22":
                curr.append("\x22")
            else:
                curr.append(char)
            escape = False
        elif char == "\\":
            if in_quote:
                escape = True
            else:
                curr.append(char)
        elif char == "\x27":
            in_quote = not in_quote
        elif char == "," and not in_quote:
            v = "".join(curr).strip()
            if v == "NULL" or v == "None":
                vals.append(None)
            elif (v.startswith("\x27") and v.endswith("\x27")) or (v.startswith("\x22") and v.endswith("\x22")):
                vals.append(v[1:-1])
            elif v.isdigit() or (v.startswith("-") and v[1:].isdigit()):
                vals.append(int(v))
            else:
                vals.append(v)
            curr = []
        else:
            curr.append(char)
            
    v = "".join(curr).strip()
    if v == "NULL" or v == "None":
        vals.append(None)
    elif (v.startswith("\x27") and v.endswith("\x27")) or (v.startswith("\x22") and v.endswith("\x22")):
        vals.append(v[1:-1])
    elif v.isdigit() or (v.startswith("-") and v[1:].isdigit()):
        vals.append(int(v))
    else:
        vals.append(v)
        
    return vals

tasks_batch = []
media_batch = []
hashtags_batch = []
users_batch = []

for sql_filepath in sql_files:
    if not os.path.exists(sql_filepath):
        print(f"File {sql_filepath} not found, skipping...")
        continue
    
    print(f"Processing {sql_filepath}...")
    current_table = None

    with open(sql_filepath, "r", encoding="utf-8", errors="ignore") as f:
        for line in f:
            l = line.strip()
            if "INSERT INTO `tasks`" in l or "INSERT INTO tasks" in l:
                current_table = "tasks"
            elif "INSERT INTO `data_media`" in l or "INSERT INTO data_media" in l:
                current_table = "media"
            elif "INSERT INTO `data_recent_hashtags`" in l or "INSERT INTO data_recent_hashtags" in l:
                current_table = "hashtags"
            elif "INSERT INTO `data_users`" in l or "INSERT INTO data_users" in l:
                current_table = "users"
            elif l.startswith("CREATE TABLE") or l.startswith("ALTER TABLE") or l.startswith("UNLOCK TABLES"):
                current_table = None
            elif l.startswith("(") and current_table:
                row = parse_sql_values(l)
                if row:
                    if current_table == "tasks" and len(row) == 7:
                        tasks_batch.append(row)
                    elif current_table == "media" and len(row) == 18:
                        media_batch.append(row)
                    elif current_table == "hashtags" and len(row) == 7:
                        hashtags_batch.append(row)
                    elif current_table == "users" and len(row) == 19:
                        users_batch.append(row)

print(f"Parsed batches: Tasks={len(tasks_batch)}, Media={len(media_batch)}, Hashtags={len(hashtags_batch)}, Users={len(users_batch)}")

if tasks_batch:
    cursor.executemany("INSERT OR IGNORE INTO tasks VALUES (?,?,?,?,?,?,?)", tasks_batch)
if media_batch:
    cursor.executemany("INSERT OR IGNORE INTO data_media VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", media_batch)
if hashtags_batch:
    cursor.executemany("INSERT OR IGNORE INTO data_recent_hashtags VALUES (?,?,?,?,?,?,?)", hashtags_batch)
if users_batch:
    cursor.executemany("INSERT OR IGNORE INTO data_users VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", users_batch)

conn.commit()

# Deduplicate records across all tables
print("Deduplicating records...")
cursor.execute("DELETE FROM tasks WHERE id NOT IN (SELECT MIN(id) FROM tasks GROUP BY MUID)")
cursor.execute("DELETE FROM data_media WHERE id NOT IN (SELECT MIN(id) FROM data_media GROUP BY MUID, COALESCE(pk, m_id, id))")
cursor.execute("DELETE FROM data_users WHERE id NOT IN (SELECT MIN(id) FROM data_users GROUP BY MUID, COALESCE(pk, username, id))")
cursor.execute("DELETE FROM data_recent_hashtags WHERE id NOT IN (SELECT MIN(id) FROM data_recent_hashtags GROUP BY MUID, hashtag)")
conn.commit()

# Extract tasks with counts
cursor.execute("""
    SELECT t.id, t.MUID, t.seed_node, t.mining_depth, t.mining_type, t.hashtag_media_amount, t.created_at,
        (SELECT COUNT(*) FROM data_media WHERE MUID = t.MUID) as p_count,
        (SELECT COUNT(*) FROM data_recent_hashtags WHERE MUID = t.MUID) as h_count,
        (SELECT COUNT(*) FROM data_users WHERE MUID = t.MUID) as u_count,
        (SELECT COUNT(*) FROM data_media WHERE MUID = t.MUID AND ((inference_custom IS NOT NULL AND inference_custom != '' AND inference_custom != '[]') OR (hashtag_detection IS NOT NULL AND hashtag_detection != '' AND hashtag_detection != '[]') OR (inference_world IS NOT NULL AND inference_world != '' AND inference_world != '[]'))) as inf_count
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
        "h_count": row[8],
        "u_count": row[9],
        "inf_count": row[10]
    })

with open(os.path.join(output_dir, "tasks.json"), "w", encoding="utf-8") as f:
    json.dump(tasks, f, ensure_ascii=False, indent=2)

cursor.execute("SELECT COUNT(*) FROM data_media")
media_count = cursor.fetchone()[0]
cursor.execute("SELECT COUNT(*) FROM data_users")
users_count = cursor.fetchone()[0]
cursor.execute("SELECT COUNT(*) FROM data_recent_hashtags")
hashtags_count = cursor.fetchone()[0]

print(f"\n🎉 Successfully processed complete database!")
print(f"Summary in SQLite app_data.db:")
print(f"  - Tasks: {len(tasks)}")
print(f"  - Media posts: {media_count}")
print(f"  - Users: {users_count}")
print(f"  - Recent Hashtags: {hashtags_count}")
conn.close()
