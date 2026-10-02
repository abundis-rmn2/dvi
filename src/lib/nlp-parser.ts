export interface NEREntity {
  term: string;
  count: number;
}

export interface ExtractedEntities {
  writers: NEREntity[];
  crews: NEREntity[];
}

export function extractTopEntities(posts: any[], limit: number = 5): ExtractedEntities {
  const writerCounts: Record<string, number> = {};
  const crewCounts: Record<string, number> = {};

  posts.forEach((post) => {
    if (post.hashtag_detection && post.hashtag_detection !== '[]') {
      try {
        const detectionArray = JSON.parse(post.hashtag_detection);
        if (Array.isArray(detectionArray)) {
          detectionArray.forEach((det: any) => {
            if (Array.isArray(det) && det.length >= 4) {
              const [original, baseType, subType, clean] = det;
              
              if (baseType === 'entity') {
                if (subType === 'writer') {
                  writerCounts[clean] = (writerCounts[clean] || 0) + 1;
                } else if (subType === 'crew') {
                  crewCounts[clean] = (crewCounts[clean] || 0) + 1;
                }
              }
            }
          });
        }
      } catch (err) {
        // Skip invalid JSON
      }
    }
  });

  const sortByCount = (a: NEREntity, b: NEREntity) => b.count - a.count;

  const writers = Object.entries(writerCounts)
    .map(([term, count]) => ({ term, count }))
    .sort(sortByCount)
    .slice(0, limit);

  const crews = Object.entries(crewCounts)
    .map(([term, count]) => ({ term, count }))
    .sort(sortByCount)
    .slice(0, limit);

  return { writers, crews };
}
