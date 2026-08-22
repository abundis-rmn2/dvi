import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { logger } from '@/utils/logger';
import { getCachedData } from '@/lib/cache';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = parseInt(params.id, 10);
    const { searchParams } = new URL(request.url);

    const hSort = searchParams.get('h_sort') || 'no_publications';
    const hOrder = searchParams.get('h_order') === 'asc' ? 'ASC' : 'DESC';
    const pSort = searchParams.get('p_sort') || 'taken_at';
    const pOrder = searchParams.get('p_order') === 'asc' ? 'ASC' : 'DESC';

    const allowedHSort = ['hashtag', 'no_publications', 'mined_at'];
    const safeHSort = allowedHSort.includes(hSort) ? hSort : 'no_publications';

    const allowedPSort = ['user_id', 'like_count', 'comment_count', 'taken_at'];
    const safePSort = allowedPSort.includes(pSort) ? pSort : 'taken_at';

    const payload = await getCachedData(
      ['api_task_data_payload', String(taskId), safeHSort, hOrder, safePSort, pOrder],
      () => {
        logger.log('API:tasks:id:data', `Executing SQLite detail payload query for task ID ${taskId}`);

        const db = getDb();
        const task: any = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);

        if (!task) {
          db.close();
          return null;
        }

        const muid = task.MUID;

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
          .prepare(`SELECT * FROM data_recent_hashtags WHERE MUID = ? ORDER BY ${safeHSort} ${hOrder}`)
          .all(muid);

        const posts = db
          .prepare(`SELECT * FROM data_media WHERE MUID = ? ORDER BY ${safePSort} ${pOrder} LIMIT 200`)
          .all(muid);

        db.close();

        return {
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
      },
      ['task_data']
    );

    if (!payload) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(payload);
  } catch (error) {
    logger.error('API:tasks:id:data', 'Error fetching task details', error);
    return NextResponse.json({ error: 'Failed to fetch task details' }, { status: 500 });
  }
}
