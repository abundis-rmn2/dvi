const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const tasksJsonPath = path.join(projectRoot, 'public', 'data', 'tasks.json');

// Target base URL (e.g. http://localhost:3000 or https://freight-graffiti.abundis.com.mx)
const targetBaseUrl = process.argv[2] || process.env.WARM_TARGET_URL || 'http://localhost:3000';

function fetchUrl(url, timeoutMs = 15000) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    try {
      const client = url.startsWith('https') ? https : http;
      const req = client.request(url, { method: 'GET', timeout: timeoutMs }, (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          const duration = Date.now() - startTime;
          resolve({ ok: res.statusCode >= 200 && res.statusCode < 400, statusCode: res.statusCode, duration, size: body.length });
        });
      });
      req.on('error', (err) => {
        const duration = Date.now() - startTime;
        resolve({ ok: false, statusCode: 0, duration, error: err.message });
      });
      req.on('timeout', () => {
        req.destroy();
        const duration = Date.now() - startTime;
        resolve({ ok: false, statusCode: 408, duration, error: 'Timeout' });
      });
      req.end();
    } catch (err) {
      const duration = Date.now() - startTime;
      resolve({ ok: false, statusCode: 0, duration, error: err.message });
    }
  });
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
  console.log(`🔥 Starting Sitemap Cache Warming for ${targetBaseUrl}...`);

  const urls = [
    '/',
    '/methodology',
    '/methodology/mining-shaping-visualizing-and-interpreting-instagram-hypertextual-networks-of-freight-train-graffiti-communalities-in-north-america-using-machine-learning-custom-models-and-graphology',
    '/hashtags',
  ];

  if (fs.existsSync(tasksJsonPath)) {
    try {
      const tasks = JSON.parse(fs.readFileSync(tasksJsonPath, 'utf-8'));
      tasks.forEach((task) => {
        if (task?.MUID) {
          urls.push(`/tasks/${task.MUID}`);
          urls.push(`/graph/${task.MUID}`);
        }
      });
    } catch (e) {}
  }

  console.log(`📋 Loaded ${urls.length} URLs from Sitemap / Task index.`);

  let successCount = 0;
  let failCount = 0;
  let totalTime = 0;

  const results = await mapPool(urls, 5, async (relUrl, i) => {
    const fullUrl = `${targetBaseUrl.replace(/\/$/, '')}${relUrl}`;
    const res = await fetchUrl(fullUrl);
    totalTime += res.duration;

    if (res.ok) {
      successCount++;
      console.log(`  [${i + 1}/${urls.length}] ✅ 200 OK (${res.duration}ms) -> ${relUrl}`);
    } else {
      failCount++;
      console.log(`  [${i + 1}/${urls.length}] ❌ ${res.statusCode || 'ERR'} (${res.duration}ms) -> ${relUrl} (${res.error || 'Failed'})`);
    }
    return res;
  });

  const avgTime = Math.round(totalTime / urls.length);
  console.log('\n🎉 Cache Warming Completed Successfully!');
  console.log(`📊 Total URLs: ${urls.length} | Success (200 OK): ${successCount} | Failed: ${failCount}`);
  console.log(`⚡ Average response time per page: ${avgTime} ms`);
}

main().catch((err) => {
  console.error('❌ Cache warming script error:', err);
  process.exit(1);
});
