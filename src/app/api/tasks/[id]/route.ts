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
    const idParam = params.id;

    const task = await getCachedData(
      ['api_task_by_id_v3', idParam],
      () => {
        if (isDbAvailable()) {
          logger.log('API:tasks:id:GET', `Fetching task ${idParam} from local SQLite`);
          const db = getDb();
          const res = db.prepare('SELECT * FROM tasks WHERE MUID = ? OR CAST(id AS TEXT) = ?').get(idParam, idParam);
          db.close();
          return res;
        }

        logger.log('API:tasks:id:GET', `Fetching task ${idParam} from static JSON`);
        const staticTasks = getStaticTasks();
        return staticTasks.find((t: any) => t.MUID === idParam || String(t.id) === idParam) || null;
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
      const idParam = params.id;
      const staticTasks = getStaticTasks();
      const task = staticTasks.find((t: any) => t.MUID === idParam || String(t.id) === idParam);
      if (task) return NextResponse.json(task);
    } catch (e) {}
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const idParam = params.id;
    if (isDbAvailable()) {
      const db = getDb();
      const task: any = db.prepare('SELECT MUID FROM tasks WHERE MUID = ? OR CAST(id AS TEXT) = ?').get(idParam, idParam);
      if (task) {
        db.prepare('DELETE FROM tasks WHERE MUID = ?').run(task.MUID);
        db.prepare('DELETE FROM data_media WHERE MUID = ?').run(task.MUID);
        db.prepare('DELETE FROM data_users WHERE MUID = ?').run(task.MUID);
        db.prepare('DELETE FROM data_recent_hashtags WHERE MUID = ?').run(task.MUID);
      }
      db.close();
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('API:tasks:id:DELETE', 'Error deleting task', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
