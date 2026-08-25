import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

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


