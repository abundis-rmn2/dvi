import { NextResponse } from 'next/server';
import { getDb, isDbAvailable, getGraphFallbackData } from '@/lib/db';
import { logger } from '@/utils/logger';
import { getCachedData } from '@/lib/cache';

export const dynamic = 'force-dynamic';

function hyphenize(str: string | null | undefined): string {
  if (!str) return '';
  const utf8Map: Record<string, string> = {
    '[áàâãªä]': 'a',
    '[ÁÀÂÃÄ]': 'A',
    '[ÍÌÎÏ]': 'I',
    '[íìîï]': 'i',
    '[éèêë]': 'e',
    '[ÉÈÊË]': 'E',
    '[óòôõºö]': 'o',
    '[ÓÒÔÕÖ]': 'O',
    '[úùûü]': 'u',
    '[ÚÙÛÜ]': 'U',
    'ç': 'c',
    'Ç': 'C',
    'ñ': 'n',
    'Ñ': 'N',
    '–': '-',
  };

  let res = str;
  for (const [regex, rep] of Object.entries(utf8Map)) {
    res = res.replace(new RegExp(regex, 'gu'), rep);
  }
  return res;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const node = searchParams.get('node');
    const nodeType = searchParams.get('nodeType');
    const muid = searchParams.get('MUID') || '';

    if (!node || !nodeType) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const payload = await getCachedData(
      ['api_node_inspection', nodeType, node, muid],
      () => {
        if (!isDbAvailable()) {
          logger.log('API:json-data', `SQLite DB not available, parsing graph JSON fallback for MUID: ${muid}`);
          const fallback = getGraphFallbackData(muid);

          if (nodeType === 'hashtag' || nodeType === 'ai_text_hashtag') {
            const postsMap: Record<string, any> = {};
            fallback.posts.forEach((p: any, idx: number) => {
              postsMap[idx + 1] = p;
            });
            return {
              hashtag_info: { MUID: muid, node, no_publications: String(fallback.posts.length), mined_at: 'Static mode' },
              post: postsMap,
            };
          } else if (nodeType === 'user') {
            const cleanUsername = node.startsWith('u_') ? node.substring(2) : node;
            const userPosts = fallback.posts.filter((p: any) => p.user_id === cleanUsername || p.user_id.includes(cleanUsername));
            const postsMap: Record<string, any> = {};
            (userPosts.length ? userPosts : fallback.posts).forEach((p: any, idx: number) => {
              postsMap[idx + 1] = p;
            });
            return {
              user_info: { username: cleanUsername },
              post: postsMap,
            };
          } else {
            const targetPost = fallback.posts.find((p: any) => p.m_id === node || p.id === node);
            return { post: { 1: targetPost || { m_id: node, caption_text: node } } };
          }
        }


        logger.log('API:json-data', `Executing SQLite node lookup`, { node, nodeType, muid });
        const db = getDb();

        if (nodeType === 'hashtag' || nodeType === 'ai_text_hashtag') {
          let hashtagInfo = {
            MUID: muid,
            node: node,
            no_publications: 'Not mined',
            mined_at: 'Not mined',
          };

          if (muid) {
            const dbHashtag: any = db
              .prepare('SELECT * FROM data_recent_hashtags WHERE hashtag = ? AND MUID = ? LIMIT 1')
              .get(node, muid);

            if (dbHashtag) {
              hashtagInfo.no_publications = String(dbHashtag.no_publications ?? 'Not mined');
              hashtagInfo.mined_at = dbHashtag.mined_at ? String(dbHashtag.mined_at) : 'Not mined';
            }
          }

          let posts: Record<string, any> = {};
          if (muid) {
            const mediaRows: any[] = db
              .prepare('SELECT * FROM data_media WHERE MUID = ? AND caption_text LIKE ?')
              .all(muid, `%${node}%`);

            mediaRows.forEach((row, idx) => {
              posts[idx + 1] = {
                ...row,
                caption_text: hyphenize(row.caption_text),
              };
            });
          }

          db.close();

          return {
            hashtag_info: hashtagInfo,
            post: posts,
          };
        } else if (nodeType === 'user') {
          const cleanUsername = node.startsWith('u_') ? node.substring(2) : node;
          const userObj: any = db
            .prepare('SELECT * FROM data_users WHERE username = ? LIMIT 1')
            .get(cleanUsername);

          let posts: Record<string, any> = {};
          if (muid) {
            const mediaRows: any[] = db
              .prepare('SELECT * FROM data_media WHERE user_id = ? AND MUID = ?')
              .all(cleanUsername, muid);

            mediaRows.forEach((row, idx) => {
              posts[idx + 1] = {
                ...row,
                caption_text: hyphenize(row.caption_text),
              };
            });
          }

          db.close();

          return {
            user_info: userObj || { username: cleanUsername },
            post: posts,
          };
        } else if (nodeType === 'post') {
          let posts: Record<string, any> = {};
          const mediaRows: any[] = db
            .prepare('SELECT * FROM data_media WHERE m_id = ?')
            .all(node);

          mediaRows.forEach((row, idx) => {
            posts[idx + 1] = {
              ...row,
              caption_text: hyphenize(row.caption_text),
            };
          });

          db.close();

          return { post: posts };
        }

        db.close();
        return {};
      },
      ['node_data']
    );

    return NextResponse.json(payload);
  } catch (error) {
    logger.error('API:json-data', 'Error fetching node data from SQLite', error);
    return NextResponse.json({
      hashtag_info: { MUID: '', node: '', no_publications: 'Static mode', mined_at: 'Static mode' },
      post: {},
    });
  }
}

