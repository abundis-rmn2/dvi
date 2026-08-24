import { NextResponse } from 'next/server';
import { getDb, isDbAvailable, getStaticTasks } from '@/lib/db';
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
        if (isDbAvailable()) {
          logger.log('API:tasks:id:GET', `Fetching task ID ${id} from local SQLite`);
          const db = getDb();
          const res = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
          db.close();
          return res;
        }

        logger.log('API:tasks:id:GET', `Fetching task ID ${id} from static JSON`);
        const staticTasks = getStaticTasks();
        return staticTasks.find((t: any) => t.id === id) || null;
      },
      ['tasks']
    );

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    logger.error('API:tasks:id:GET', 'Error fetching task, trying static fallback', error);
    try {
      const id = parseInt(params.id, 10);
      const staticTasks = getStaticTasks();
      const task = staticTasks.find((t: any) => t.id === id);
      if (task) return NextResponse.json(task);
    } catch (e) {}
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
}

