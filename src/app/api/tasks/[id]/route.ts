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
    const id = parseInt(params.id, 10);

    const task = await getCachedData(
      ['api_task_by_id', String(id)],
      () => {
        logger.log('API:tasks:id:GET', `Fetching task ID ${id} from local SQLite`);
        const db = getDb();
        const res = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
        db.close();
        return res;
      },
      ['tasks']
    );

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    logger.error('API:tasks:id:GET', 'Error fetching task from local SQLite', error);
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
}
