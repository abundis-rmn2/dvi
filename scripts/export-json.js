const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const Database = require('better-sqlite3');

const projectRoot = process.cwd();
const dbPath = path.join(projectRoot, 'public', 'data', 'app_data.db');
const tasksJsonPath = path.join(projectRoot, 'public', 'data', 'tasks.json');
const outputJsonDir = path.join(projectRoot, 'public', 'json', 'tasks');

if (!fs.existsSync(outputJsonDir)) {
  fs.mkdirSync(outputJsonDir, { recursive: true });
}

if (!fs.existsSync(dbPath)) {
  console.error(`❌ Database not found at ${dbPath}`);
  process.exit(1);
}

const db = new Database(dbPath, { readonly: true });

function checkUrlHttp(url, timeoutMs = 1500) {
  return new Promise((resolve) => {
    try {
      const client = url.startsWith('https') ? https : http;
      const req = client.request(url, { method: 'HEAD', timeout: timeoutMs }, (res) => {
        resolve(res.statusCode === 200);
      });
      req.on('error', () => resolve(false));
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });
      req.end();
    } catch {
      resolve(false);
    }
  });
}

async function resolvePostImageUrl(post, seedNode, muid) {
  if (!post) return null;
  const postMediaId = post.m_id || post.pk;

  let realUser = post.user_id;
  if (post.media && post.media.includes('_')) {
    realUser = post.media.substring(0, post.media.lastIndexOf('_'));
  }
  const mediaName = post.media || (realUser && post.pk ? `${realUser}_${post.pk}` : null);

  const candidateSubpaths = [];

  if (muid && postMediaId) {
    candidateSubpaths.push(`media/exported_images/${muid}/${postMediaId}_exported.jpg`);
    candidateSubpaths.push(`media/exported_images/${muid}/${postMediaId}_exported.webp`);
  }
  if (seedNode && post.user_id && post.pk) {
    candidateSubpaths.push(`media/${seedNode}/${post.user_id}_${post.pk}.jpg`);
    candidateSubpaths.push(`media/${seedNode}/${post.user_id}_${post.pk}.webp`);
  }
  if (realUser && post.pk) {
    candidateSubpaths.push(`media/${realUser}/${realUser}_${post.pk}.jpg`);
    candidateSubpaths.push(`media/${realUser}/${realUser}_${post.pk}.webp`);
  }
  if (seedNode && mediaName) {
    candidateSubpaths.push(`media/${seedNode}/${mediaName}.jpg`);
    candidateSubpaths.push(`media/${seedNode}/${mediaName}.webp`);
  }

  const uniqueSubpaths = Array.from(new Set(candidateSubpaths));

  for (const subpath of uniqueSubpaths) {
    const httpUrl = `http://data.abundis.com.mx/${subpath}`;
    if (await checkUrlHttp(httpUrl)) return httpUrl;

    const httpsUrl = `https://data.abundis.com.mx/${subpath}`;
    if (await checkUrlHttp(httpsUrl)) return httpsUrl;
  }

  return null;
}

async function mapPool(items, concurrency, fn) {
  const results = new Array(items.length);
  let index = 0;

  const workers = Array.from({ length: concurrency }, async () => {
    while (index < items.length) {
      const i = index++;
      results[i] = await fn(items[i], i);
    }
  });

  await Promise.all(workers);
  return results;
}

async function main() {
  console.log('🚀 Starting Vercel Static JSON Export with Image Verification...');

  const tasksQuery = `
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

  const tasks = db.prepare(tasksQuery).all();
  console.log(`📋 Found ${tasks.length} data mining tasks in SQLite database.`);

  // Write consolidated tasks.json for /hashtags page
  fs.writeFileSync(tasksJsonPath, JSON.stringify(tasks, null, 2), 'utf-8');
  console.log(`✅ Saved ${tasks.length} tasks to ${tasksJsonPath}`);

  let totalPostsCount = 0;
  let totalValidImagesCount = 0;

  for (let idx = 0; idx < tasks.length; idx++) {
    const task = tasks[idx];
    const muid = task.MUID;

    const posts = db
      .prepare('SELECT * FROM data_media WHERE MUID = ? ORDER BY taken_at DESC')
      .all(muid);

    const hashtags = db
      .prepare('SELECT * FROM data_recent_hashtags WHERE MUID = ? ORDER BY no_publications DESC')
      .all(muid);

    // Parallel HTTP HEAD verification for posts
    const resolvedPosts = await mapPool(posts, 25, async (p) => {
      const resolved_image_url = await resolvePostImageUrl(p, task.seed_node, muid);
      return {
        ...p,
        resolved_image_url,
      };
    });

    const validImagesCount = resolvedPosts.filter((p) => p.resolved_image_url !== null).length;
    totalPostsCount += resolvedPosts.length;
    totalValidImagesCount += validImagesCount;

    const taskPayload = {
      task,
      stats: {
        posts: posts.length,
        hashtags: hashtags.length,
        users: task.u_count || 0,
        inferences: task.inf_count || 0,
        valid_images: validImagesCount,
      },
      hashtags,
      posts: resolvedPosts,
    };

    const targetFile = path.join(outputJsonDir, `${muid}.json`);
    fs.writeFileSync(targetFile, JSON.stringify(taskPayload), 'utf-8');

    console.log(
      `  [${idx + 1}/${tasks.length}] 📦 ${muid} -> ${posts.length} posts, ${validImagesCount} verified images 200 OK (Saved: ${path.basename(targetFile)})`
    );
  }

  db.close();

  console.log('\n🎉 Export Completed Successfully!');
  console.log(`📊 Summary: ${tasks.length} tasks exported to public/json/tasks/`);
  console.log(`🖼️  Image Verification: ${totalValidImagesCount} / ${totalPostsCount} posts have verified HTTP 200 OK images.`);
}

main().catch((err) => {
  console.error('❌ Export failed:', err);
  process.exit(1);
});
