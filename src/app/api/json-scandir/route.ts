import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { logger } from '@/utils/logger';
import { getCachedData } from '@/lib/cache';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const muid = searchParams.get('MUID');
    const type = searchParams.get('type') || 'standard';

    if (!muid) {
      return NextResponse.json({ error: 'Missing MUID parameter' }, { status: 400 });
    }

    const safeMuid = muid.replace(/[^a-zA-Z0-9_\-]/g, '');

    const matchingFiles = await getCachedData(
      ['api_json_scandir', safeMuid, type],
      () => {
        const subDir = type === 'ai' ? path.join('public', 'json', 'ai') : path.join('public', 'json');
        const targetDir = path.join(process.cwd(), subDir);

        logger.log('API:json-scandir', `Scanning directory ${subDir} for MUID: ${safeMuid}`);

        if (!fs.existsSync(targetDir)) {
          return [];
        }

        const files = fs.readdirSync(targetDir);
        return files.filter(
          (file) => file.includes(safeMuid) && file.endsWith('.json')
        );
      },
      ['json_scandir']
    );

    return NextResponse.json(matchingFiles);
  } catch (error) {
    logger.error('API:json-scandir', 'Error scanning graph JSON directory', error);
    return NextResponse.json({ error: 'Failed to scan directory' }, { status: 500 });
  }
}
