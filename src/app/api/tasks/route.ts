import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { logger } from '@/utils/logger';
import { getCachedData } from '@/lib/cache';

export const dynamic = 'force-dynamic';

const allowedSortColumns = ['MUID', 'seed_node', 'mining_depth', 'hashtag_media_amount', 'p_count', 'h_count', 'inf_count', 'created_at'];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let sort = searchParams.get('sort') || 'created_at';
    const order = searchParams.get('order') === 'asc' ? 'ASC' : 'DESC';

    if (!allowedSortColumns.includes(sort)) {
      sort = 'created_at';
    }

    const tasks = await getCachedData(
      ['api_tasks_list', sort, order],
      () => {
        logger.log('API:tasks:GET', `Executing SQLite query for tasks sorted by ${sort} ${order}`);
        const db = getDb();
        const query = `
          SELECT t.id, t.MUID, t.seed_node, t.mining_depth, t.mining_type, t.hashtag_media_amount, t.created_at,
              (SELECT COUNT(*) FROM data_media WHERE MUID = t.MUID) as p_count,
              (SELECT COUNT(*) FROM data_recent_hashtags WHERE MUID = t.MUID) as h_count,
              (SELECT COUNT(*) FROM data_media WHERE MUID = t.MUID AND ((inference_custom IS NOT NULL AND inference_custom != '' AND inference_custom != '[]') OR (hashtag_detection IS NOT NULL AND hashtag_detection != '' AND hashtag_detection != '[]') OR (inference_world IS NOT NULL AND inference_world != '' AND inference_world != '[]'))) as inf_count
          FROM tasks t
          ORDER BY ${sort} ${order}
        `;
        const result = db.prepare(query).all();
        db.close();
        return result;
      },
      ['tasks']
    );

    return NextResponse.json(tasks);
  } catch (error) {
    logger.error('API:tasks:GET', 'Error fetching tasks from local SQLite', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}
