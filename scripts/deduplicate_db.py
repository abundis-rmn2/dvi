import sqlite3
import json
import os

db_path = os.path.join("public", "data", "app_data.db")
json_path = os.path.join("public", "data", "tasks.json")

print("Cleaning duplicates in SQLite app_data.db...")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get initial counts
cursor.execute("SELECT COUNT(*) FROM tasks")
initial_tasks = cursor.fetchone()[0]

cursor.execute("SELECT COUNT(*) FROM data_media")
initial_media = cursor.fetchone()[0]

cursor.execute("SELECT COUNT(*) FROM data_users")
initial_users = cursor.fetchone()[0]

cursor.execute("SELECT COUNT(*) FROM data_recent_hashtags")
initial_hashtags = cursor.fetchone()[0]

# Perform deduplication
cursor.execute("DELETE FROM tasks WHERE id NOT IN (SELECT MIN(id) FROM tasks GROUP BY MUID)")
cursor.execute("DELETE FROM data_media WHERE id NOT IN (SELECT MIN(id) FROM data_media GROUP BY MUID, COALESCE(pk, m_id, id))")
cursor.execute("DELETE FROM data_users WHERE id NOT IN (SELECT MIN(id) FROM data_users GROUP BY MUID, COALESCE(pk, username, id))")
cursor.execute("DELETE FROM data_recent_hashtags WHERE id NOT IN (SELECT MIN(id) FROM data_recent_hashtags GROUP BY MUID, hashtag)")

conn.commit()

# Get final counts
cursor.execute("SELECT COUNT(*) FROM tasks")
final_tasks = cursor.fetchone()[0]

cursor.execute("SELECT COUNT(*) FROM data_media")
final_media = cursor.fetchone()[0]

cursor.execute("SELECT COUNT(*) FROM data_users")
final_users = cursor.fetchone()[0]

cursor.execute("SELECT COUNT(*) FROM data_recent_hashtags")
final_hashtags = cursor.fetchone()[0]

print(f"Tasks: {initial_tasks} -> {final_tasks} (removed {initial_tasks - final_tasks})")
print(f"Media: {initial_media} -> {final_media} (removed {initial_media - final_media})")
print(f"Users: {initial_users} -> {final_users} (removed {initial_users - final_users})")
print(f"Hashtags: {initial_hashtags} -> {final_hashtags} (removed {initial_hashtags - final_hashtags})")

# Export updated tasks.json
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

with open(json_path, "w", encoding="utf-8") as f:
    json.dump(tasks, f, ensure_ascii=False, indent=2)

print(f"Updated {json_path} with {len(tasks)} unique tasks!")
conn.close()
