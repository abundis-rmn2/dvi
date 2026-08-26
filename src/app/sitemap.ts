import { MetadataRoute } from 'next';
import { getStaticTasks } from '@/lib/db';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://freight-graffiti.abundis.com.mx';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/methodology`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/methodology/mining-shaping-visualizing-and-interpreting-instagram-hypertextual-networks-of-freight-train-graffiti-communalities-in-north-america-using-machine-learning-custom-models-and-graphology`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/hashtags`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  let taskRoutes: MetadataRoute.Sitemap = [];
  try {
    const tasks = getStaticTasks();
    tasks.forEach((task: any) => {
      if (task?.MUID) {
        taskRoutes.push({
          url: `${SITE_URL}/tasks/${task.MUID}`,
          lastModified: task.created_at ? new Date(task.created_at) : new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
        if (task.mining_type?.includes('user')) {
          taskRoutes.push({
            url: `${SITE_URL}/sigma/${task.MUID}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
          });
        } else {
          taskRoutes.push({
            url: `${SITE_URL}/graph/${task.MUID}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
          });
        }
      }
    });
  } catch (err) {
    // Graceful fallback if database file is not available
  }

  return [...staticRoutes, ...taskRoutes];
}
