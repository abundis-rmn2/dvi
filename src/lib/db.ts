import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { getCachedData } from '@/lib/cache';

const dbPath = path.join(process.cwd(), 'public', 'data', 'app_data.db');
const tasksJsonPath = path.join(process.cwd(), 'public', 'data', 'tasks.json');

export function isDbAvailable(): boolean {
  return fs.existsSync(dbPath);
}

export function getDb() {
  if (!fs.existsSync(dbPath)) {
    throw new Error(`Database file not found at ${dbPath}`);
  }
  return new Database(dbPath, { readonly: true });
}

export function getStaticTasks() {
  if (!fs.existsSync(tasksJsonPath)) {
    return [];
  }
  const fileData = fs.readFileSync(tasksJsonPath, 'utf-8');
  return JSON.parse(fileData);
}

export function getTasksServerPayload() {
  // 1. Try static JSON first (100% Vercel compatible, 0% SQLite dependency)
  if (fs.existsSync(tasksJsonPath)) {
    try {
      const tasks = getStaticTasks();
      if (tasks && tasks.length > 0) return tasks;
    } catch (e) {}
  }

  // 2. Fallback to SQLite query if JSON not present
  if (isDbAvailable()) {
    try {
      const db = getDb();
      const query = `
        SELECT 
          t.*,
          COALESCE(m.p_count, 0) as p_count,
          COALESCE(h.h_count, 0) as h_count,
          COALESCE(u.u_count, 0) as u_count,
          COALESCE(i.inf_count, 0) as inf_count
        FROM tasks t
        LEFT JOIN (
          SELECT MUID, COUNT(*) as p_count FROM data_media GROUP BY MUID
        ) m ON t.MUID = m.MUID
        LEFT JOIN (
          SELECT MUID, COUNT(*) as h_count FROM data_recent_hashtags GROUP BY MUID
        ) h ON t.MUID = h.MUID
        LEFT JOIN (
          SELECT MUID, COUNT(*) as u_count FROM data_users GROUP BY MUID
        ) u ON t.MUID = u.MUID
        LEFT JOIN (
          SELECT MUID, COUNT(*) as inf_count FROM data_media WHERE (inference_custom IS NOT NULL AND inference_custom != '' AND inference_custom != '[]') OR (hashtag_detection IS NOT NULL AND hashtag_detection != '' AND hashtag_detection != '[]') OR (inference_world IS NOT NULL AND inference_world != '' AND inference_world != '[]') GROUP BY MUID
        ) i ON t.MUID = i.MUID
        ORDER BY t.id DESC
      `;
      const tasks = db.prepare(query).all();
      db.close();
      if (tasks && tasks.length > 0) return tasks;
    } catch (e) {}
  }

  return getStaticTasks();
}

export function getGraphFallbackData(muid: string) {
  try {
    const jsonDir = path.join(process.cwd(), 'public', 'json');
    const aiJsonDir = path.join(process.cwd(), 'public', 'json', 'ai');

    let targetFile = '';
    if (fs.existsSync(aiJsonDir)) {
      const files = fs.readdirSync(aiJsonDir);
      const match = files.find((f) => f.includes(muid) && f.endsWith('.json'));
      if (match) targetFile = path.join(aiJsonDir, match);
    }
    if (!targetFile && fs.existsSync(jsonDir)) {
      const files = fs.readdirSync(jsonDir);
      const match = files.find((f) => f.includes(muid) && f.endsWith('.json'));
      if (match) targetFile = path.join(jsonDir, match);
    }

    if (!targetFile || !fs.existsSync(targetFile)) {
      return { posts: [], hashtags: [], users: [] };
    }

    const graph = JSON.parse(fs.readFileSync(targetFile, 'utf-8'));
    const nodes = graph.nodes || [];
    const edges = graph.edges || [];

    const userNodes = nodes.filter((n: any) => n.type === 'user');

    const postUserMap: Record<string, string> = {};
    edges.forEach((e: any) => {
      const userNode = userNodes.find((u: any) => u.id === e.source || u.id === e.target);
      if (userNode) {
        const postId = e.source === userNode.id ? e.target : e.source;
        postUserMap[postId] = userNode.label || userNode.id;
      }
    });

    const postNodes = nodes.filter((n: any) => n.type === 'post');
    const posts = postNodes.map((n: any) => ({
      id: n.id,
      m_id: n.id,
      user_id: postUserMap[n.id] || n.label?.replace(/\+$/, '') || 'unknown',
      caption_text: n.label || '',
      like_count: n.attributes?.like_count || 0,
      comment_count: n.attributes?.comment_count || 0,
      taken_at: n.attributes?.taken_at || 'N/A',
      MUID: muid,
    }));

    const hashtagNodes = nodes.filter((n: any) => n.type === 'hashtag' || n.type === 'ai_text_hashtag');
    const hashtags = hashtagNodes.map((n: any) => {
      const edgeCount = edges.filter((e: any) => e.source === n.id || e.target === n.id).length;
      return {
        id: n.id,
        hashtag: n.label || n.id,
        no_publications: edgeCount,
        mined_at: 'N/A',
        MUID: muid,
      };
    });

    return { posts, hashtags, users: userNodes };
  } catch (err) {
    return { posts: [], hashtags: [], users: [] };
  }
}

export async function getTaskDetailServerPayload(idParam: string) {
  return getCachedData(['task_detail_json_payload_v11', idParam], async () => {
    // 1. Try static JSON payload first (100% Vercel compatible, 0% SQLite dependency)
    try {
      const jsonTasksDir = path.join(process.cwd(), 'public', 'json', 'tasks');
      if (fs.existsSync(jsonTasksDir)) {
        const files = fs.readdirSync(jsonTasksDir);
        const match = files.find(
          (f) => f.replace('.json', '') === idParam || f.includes(idParam)
        );
        if (match) {
          const filePath = path.join(jsonTasksDir, match);
          const content = fs.readFileSync(filePath, 'utf-8');
          return JSON.parse(content);
        }
      }
    } catch (err) {}

    // 2. Fallback to SQLite if static JSON not found
    let rawPayload: any = null;

    if (isDbAvailable()) {
      try {
        const db = getDb();
        const task: any = db
          .prepare('SELECT * FROM tasks WHERE MUID = ? OR CAST(id AS TEXT) = ?')
          .get(idParam, idParam);

        if (task) {
          const muid = task.MUID;
          const targetJsonFile = path.join(process.cwd(), 'public', 'json', 'tasks', `${muid}.json`);
          if (fs.existsSync(targetJsonFile)) {
            db.close();
            return JSON.parse(fs.readFileSync(targetJsonFile, 'utf-8'));
          }

          const postsCountRow: any = db
            .prepare('SELECT COUNT(*) as total FROM data_media WHERE MUID = ?')
            .get(muid);
          const hashtagsCountRow: any = db
            .prepare('SELECT COUNT(*) as total FROM data_recent_hashtags WHERE MUID = ?')
            .get(muid);
          const usersCountRow: any = db
            .prepare('SELECT COUNT(*) as total FROM data_users WHERE MUID = ?')
            .get(muid);
          const inferencesCountRow: any = db
            .prepare("SELECT COUNT(*) as total FROM data_media WHERE MUID = ? AND ((inference_custom IS NOT NULL AND inference_custom != '' AND inference_custom != '[]') OR (hashtag_detection IS NOT NULL AND hashtag_detection != '' AND hashtag_detection != '[]') OR (inference_world IS NOT NULL AND inference_world != '' AND inference_world != '[]'))")
            .get(muid);

          const hashtags = db
            .prepare('SELECT * FROM data_recent_hashtags WHERE MUID = ? ORDER BY no_publications DESC')
            .all(muid);

          const posts = db
            .prepare('SELECT * FROM data_media WHERE MUID = ? ORDER BY taken_at DESC')
            .all(muid);

          db.close();

          rawPayload = {
            task,
            stats: {
              posts: postsCountRow?.total || 0,
              hashtags: hashtagsCountRow?.total || 0,
              users: usersCountRow?.total || 0,
              inferences: inferencesCountRow?.total || 0,
            },
            hashtags,
            posts,
          };
        } else {
          db.close();
        }
      } catch (err) {}
    }

    if (!rawPayload) {
      const staticTasks = getStaticTasks();
      const task = staticTasks.find((t: any) => t.MUID === idParam || String(t.id) === idParam);
      if (!task) return null;

      const fallbackData = getGraphFallbackData(task.MUID);
      rawPayload = {
        task,
        stats: {
          posts: fallbackData.posts.length || task.p_count || 0,
          hashtags: fallbackData.hashtags.length || task.h_count || 0,
          users: fallbackData.users.length || task.u_count || 0,
          inferences: task.inf_count || 0,
        },
        hashtags: fallbackData.hashtags,
        posts: fallbackData.posts,
      };
    }

    return rawPayload;
  });
}
