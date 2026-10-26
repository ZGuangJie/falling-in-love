import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import { desc, eq, asc } from 'drizzle-orm';
import { db } from './src/db/index.ts';
import {
  coupleProfile,
  coupleTopics,
  diaries,
  anniversaries,
  wishes,
  checklists,
  memories,
} from './src/db/schema.ts';
import { default100Items } from './src/db/seedData.ts';
import { initialCoupleTopics } from './src/db/topicsData.ts';
import { optionalAuth, AuthRequest } from './src/middleware/auth.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json({ limit: '15mb' }));

// Helper to seed initial sample records if empty
async function ensureInitialData() {
  try {
    const existingProfile = await db.select().from(coupleProfile).limit(1);
    if (existingProfile.length === 0) {
      console.log('Seeding initial couple profile and sample records...');
      await db.insert(coupleProfile).values({
        title: '呆呆 & 圆圆 的恋爱小窝',
        subTitle: '每一天都是新的开始，每一刻都值得被记录',
        togetherDate: '2025-03-24',
        userAName: '呆呆',
        userAAvatar: 'dog',
        userBName: '圆圆',
        userBAvatar: 'cat',
        quote1: '和你一起看过的风景，都是最美的画面',
        quote2: '只要有你在身边，每一天都是好天气',
        bannerImage: '/assets/aistudio/image_c593c0a7.png',
        themeId: 'warm-cream',
        customPrimaryColor: '#E98C58',
        customBgColor: '#FFF9F2',
        customBorderColor: '#4A3528',
        customFontFamily: 'system',
        customBgPattern: 'dots',
        customBgImage: '',
      });

      // Seed Anniversaries
      await db.insert(anniversaries).values([
        {
          title: '一周年 🎉',
          date: '2026-03-24',
          repeatType: 'yearly',
          icon: 'gift',
          notes: '我们相爱一整年啦！准备了惊喜小礼物',
          isTop: true,
        },
        {
          title: '圆圆的生日 🎂',
          date: '2026-05-18',
          repeatType: 'yearly',
          icon: 'cake',
          notes: '带她去吃最爱的日料和定制蛋糕',
          isTop: false,
        },
        {
          title: '第一次约会 🎬',
          date: '2025-02-14',
          repeatType: 'once',
          icon: 'heart',
          notes: '情人节老街影院，紧张得手心出汗',
          isTop: false,
        },
        {
          title: '第一次牵手 🤝',
          date: '2025-03-01',
          repeatType: 'once',
          icon: 'heart',
          notes: '过红绿灯马路时悄悄牵住的手',
          isTop: false,
        },
      ]);

      // Seed Wishes
      await db.insert(wishes).values([
        {
          title: '一起去云南旅行',
          description: '好喜欢《去有风的地方》，我也想去云南旅居！去洱海边骑单车，吹吹大理的晚风。',
          category: '旅行',
          status: 'pending',
          targetDate: '2026-06-01',
        },
        {
          title: '一起看一场浪漫的海边日落',
          description: '找一个海边沙滩，靠在一起静静看着夕阳沉入海平面。',
          category: '浪漫',
          status: 'completed',
          completedDate: '2025-08-15',
          completedNotes: '在青岛海边看到了绝美的橘红色晚霞，特别感动！',
        },
        {
          title: '为对方做一顿丰盛的晚餐',
          description: '做可乐鸡翅、番茄牛腩和爱心蛋包饭！',
          category: '美食',
          status: 'completed',
          completedDate: '2025-10-01',
          completedNotes: '虽然稍微有点咸，但是全部吃光光啦！',
        },
        {
          title: '一起去游乐园坐摩天轮',
          description: '在摩天轮到达最高点的时候许愿。',
          category: '娱乐',
          status: 'pending',
          targetDate: '2026-07-20',
        },
        {
          title: '养一只属于我们的小猫',
          description: '给它起名叫布丁，一起照顾它长大。',
          category: '生活',
          status: 'pending',
          targetDate: '2026-12-31',
        },
      ]);

      // Seed Diaries
      await db.insert(diaries).values([
        {
          title: '好天气春游',
          content: '在学校里逛逛\n看朱一龙的电影\n吃金匠寿司🥰\n春天终于来啦，风吹在脸上软绵绵的，手牵手散步就是世界上最幸福的事～',
          date: '2026-03-15',
          location: '杭州',
          mood: 'excited',
          weather: 'sunny',
          author: '呆呆',
          photos: JSON.stringify(['/assets/aistudio/image_c593c0a7.png']),
        },
        {
          title: '雨天的窝居时光',
          content: '外面淅淅沥沥下着雨，煮了两碗热腾腾的拉面，窝在被窝里一起追番看剧。这种平淡的小日子真的让人心里好踏实。',
          date: '2026-03-20',
          location: '小窝',
          mood: 'sweet',
          weather: 'rainy',
          author: '圆圆',
          photos: JSON.stringify(['/assets/aistudio/image_fe939c68.png']),
        },
        {
          title: '夜晚看星星与散步',
          content: '吹着微凉的晚风，一边喝热奶茶一边聊小时候的趣事。只要有你在身边，每一天都是好天气✨',
          date: '2026-03-28',
          location: '西湖边',
          mood: 'happy',
          weather: 'cloudy',
          author: '呆呆',
          photos: JSON.stringify(['/assets/aistudio/image_f0e5a2c8.png']),
        },
      ]);

      // Seed 100 Checklists
      for (const item of default100Items) {
        await db.insert(checklists).values({
          itemIndex: item.itemIndex,
          title: item.title,
          category: item.category,
          isCompleted: item.isCompleted,
          completedDate: item.completedDate || '',
          note: item.note || '',
          photoUrl: '',
        });
      }

      // Seed Memories
      await db.insert(memories).values([
        {
          title: '春日绿意野餐',
          photoUrl: '/assets/aistudio/image_c593c0a7.png',
          caption: '带了好多好吃的，阳光正好，微风不燥',
          date: '2026-03-15',
          tag: '旅行',
        },
        {
          title: '骑着小电驴吹风',
          photoUrl: '/assets/aistudio/image_fe939c68.png',
          caption: '嘟嘟嘟～只要你在身边，每一刻都值得珍藏',
          date: '2025-09-10',
          tag: '日常',
        },
        {
          title: '山谷与远方的湖泊',
          photoUrl: '/assets/aistudio/image_f0e5a2c8.png',
          caption: '看云卷云舒，和你在一起的岁月静好',
          date: '2025-11-04',
          tag: '纪念',
        },
      ]);
    }

    // Seed Couple Topics if empty
    const existingTopics = await db.select().from(coupleTopics).limit(1);
    if (existingTopics.length === 0) {
      console.log('Seeding initial couple interactive topics...');
      for (const topic of initialCoupleTopics) {
        await db.insert(coupleTopics).values({
          question: topic.question,
          category: topic.category,
          userAAnswer: topic.userAAnswer || '',
          userBAnswer: topic.userBAnswer || '',
          answeredAt: topic.answeredAt || '',
          isFavorite: Boolean(topic.isFavorite),
        });
      }
      console.log('Topics seeded successfully.');
    }
  } catch (err) {
    console.warn('Initial seeding check skipped or deferred:', err);
  }
}

// ----------------- API ROUTES -----------------

// Couple Profile & Theme
app.get('/api/profile', async (_req: Request, res: Response) => {
  try {
    const list = await db.select().from(coupleProfile).limit(1);
    if (list.length > 0) {
      return res.json(list[0]);
    }
    // Return fallback profile if empty
    return res.json({
      id: 1,
      title: '呆呆 & 圆圆 的恋爱小窝',
      subTitle: '每一天都是新的开始，每一刻都值得被记录',
      togetherDate: '2025-03-24',
      userAName: '呆呆',
      userAAvatar: 'dog',
      userBName: '圆圆',
      userBAvatar: 'cat',
      quote1: '和你一起看过的风景，都是最美的画面',
      quote2: '只要有你在身边，每一天都是好天气',
      bannerImage: '/assets/aistudio/image_c593c0a7.png',
      themeId: 'warm-cream',
      customPrimaryColor: '#E98C58',
      customBgColor: '#FFF9F2',
      customBorderColor: '#4A3528',
      customFontFamily: 'system',
      customBgPattern: 'dots',
      customBgImage: '',
    });
  } catch (error: any) {
    console.error('Failed to get profile:', error);
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
});

app.put('/api/profile', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const data = req.body;
    const list = await db.select().from(coupleProfile).limit(1);
    if (list.length > 0) {
      const updated = await db
        .update(coupleProfile)
        .set({
          title: data.title ?? list[0].title,
          subTitle: data.subTitle ?? list[0].subTitle,
          togetherDate: data.togetherDate ?? list[0].togetherDate,
          userAName: data.userAName ?? list[0].userAName,
          userAAvatar: data.userAAvatar ?? list[0].userAAvatar,
          userBName: data.userBName ?? list[0].userBName,
          userBAvatar: data.userBAvatar ?? list[0].userBAvatar,
          quote1: data.quote1 ?? list[0].quote1,
          quote2: data.quote2 ?? list[0].quote2,
          bannerImage: data.bannerImage ?? list[0].bannerImage,
          themeId: data.themeId ?? list[0].themeId,
          customPrimaryColor: data.customPrimaryColor ?? list[0].customPrimaryColor,
          customBgColor: data.customBgColor ?? list[0].customBgColor,
          customBorderColor: data.customBorderColor ?? list[0].customBorderColor,
          customFontFamily: data.customFontFamily ?? list[0].customFontFamily,
          customBgPattern: data.customBgPattern ?? list[0].customBgPattern,
          customBgImage: data.customBgImage ?? list[0].customBgImage,
          updatedAt: new Date(),
        })
        .where(eq(coupleProfile.id, list[0].id))
        .returning();
      return res.json(updated[0]);
    } else {
      const inserted = await db.insert(coupleProfile).values(data).returning();
      return res.json(inserted[0]);
    }
  } catch (error: any) {
    console.error('Failed to update profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Couple Interactive Topics (情侣互动话题生成器)
app.get('/api/topics', async (_req: Request, res: Response) => {
  try {
    const list = await db.select().from(coupleTopics).orderBy(asc(coupleTopics.id));
    res.json(list);
  } catch (error: any) {
    console.error('Failed to get topics:', error);
    res.status(500).json({ error: 'Failed to retrieve topics' });
  }
});

app.post('/api/topics', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { question, category } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }
    const inserted = await db
      .insert(coupleTopics)
      .values({
        question,
        category: category || '日常温情',
        userAAnswer: '',
        userBAnswer: '',
        answeredAt: '',
        isFavorite: false,
      })
      .returning();
    res.json(inserted[0]);
  } catch (error: any) {
    console.error('Failed to create topic:', error);
    res.status(500).json({ error: 'Failed to create topic' });
  }
});

app.put('/api/topics/:id', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { userAAnswer, userBAnswer, answeredAt, isFavorite, question, category } = req.body;
    const updated = await db
      .update(coupleTopics)
      .set({
        ...(userAAnswer !== undefined ? { userAAnswer } : {}),
        ...(userBAnswer !== undefined ? { userBAnswer } : {}),
        ...(answeredAt !== undefined ? { answeredAt } : {}),
        ...(isFavorite !== undefined ? { isFavorite: Boolean(isFavorite) } : {}),
        ...(question !== undefined ? { question } : {}),
        ...(category !== undefined ? { category } : {}),
      })
      .where(eq(coupleTopics.id, id))
      .returning();
    res.json(updated[0]);
  } catch (error: any) {
    console.error('Failed to update topic:', error);
    res.status(500).json({ error: 'Failed to update topic' });
  }
});

app.delete('/api/topics/:id', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(coupleTopics).where(eq(coupleTopics.id, id));
    res.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete topic:', error);
    res.status(500).json({ error: 'Failed to delete topic' });
  }
});

// Diaries
app.get('/api/diaries', async (_req: Request, res: Response) => {
  try {
    const list = await db.select().from(diaries).orderBy(desc(diaries.date), desc(diaries.id));
    res.json(list);
  } catch (error: any) {
    console.error('Failed to get diaries:', error);
    res.status(500).json({ error: 'Failed to retrieve diaries' });
  }
});

app.post('/api/diaries', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, date, location, mood, weather, photos, author } = req.body;
    if (!title || !content || !date) {
      return res.status(400).json({ error: 'Title, content and date are required' });
    }
    const inserted = await db
      .insert(diaries)
      .values({
        title,
        content,
        date,
        location: location || '',
        mood: mood || 'happy',
        weather: weather || 'sunny',
        photos: typeof photos === 'string' ? photos : JSON.stringify(photos || []),
        author: author || '呆呆',
      })
      .returning();
    res.json(inserted[0]);
  } catch (error: any) {
    console.error('Failed to create diary:', error);
    res.status(500).json({ error: 'Failed to create diary' });
  }
});

app.put('/api/diaries/:id', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, content, date, location, mood, weather, photos, author } = req.body;
    const updated = await db
      .update(diaries)
      .set({
        title,
        content,
        date,
        location,
        mood,
        weather,
        photos: typeof photos === 'string' ? photos : JSON.stringify(photos || []),
        author,
      })
      .where(eq(diaries.id, id))
      .returning();
    res.json(updated[0]);
  } catch (error: any) {
    console.error('Failed to update diary:', error);
    res.status(500).json({ error: 'Failed to update diary' });
  }
});

app.delete('/api/diaries/:id', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(diaries).where(eq(diaries.id, id));
    res.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete diary:', error);
    res.status(500).json({ error: 'Failed to delete diary' });
  }
});

// Anniversaries
app.get('/api/anniversaries', async (_req: Request, res: Response) => {
  try {
    const list = await db.select().from(anniversaries).orderBy(asc(anniversaries.date));
    res.json(list);
  } catch (error: any) {
    console.error('Failed to get anniversaries:', error);
    res.status(500).json({ error: 'Failed to retrieve anniversaries' });
  }
});

app.post('/api/anniversaries', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { title, date, repeatType, icon, notes, isTop } = req.body;
    if (!title || !date) {
      return res.status(400).json({ error: 'Title and date are required' });
    }
    const inserted = await db
      .insert(anniversaries)
      .values({
        title,
        date,
        repeatType: repeatType || 'yearly',
        icon: icon || 'gift',
        notes: notes || '',
        isTop: Boolean(isTop),
      })
      .returning();
    res.json(inserted[0]);
  } catch (error: any) {
    console.error('Failed to create anniversary:', error);
    res.status(500).json({ error: 'Failed to create anniversary' });
  }
});

app.put('/api/anniversaries/:id', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, date, repeatType, icon, notes, isTop } = req.body;
    const updated = await db
      .update(anniversaries)
      .set({
        title,
        date,
        repeatType,
        icon,
        notes,
        isTop: Boolean(isTop),
      })
      .where(eq(anniversaries.id, id))
      .returning();
    res.json(updated[0]);
  } catch (error: any) {
    console.error('Failed to update anniversary:', error);
    res.status(500).json({ error: 'Failed to update anniversary' });
  }
});

app.delete('/api/anniversaries/:id', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(anniversaries).where(eq(anniversaries.id, id));
    res.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete anniversary:', error);
    res.status(500).json({ error: 'Failed to delete anniversary' });
  }
});

// Wishes
app.get('/api/wishes', async (_req: Request, res: Response) => {
  try {
    const list = await db.select().from(wishes).orderBy(desc(wishes.id));
    res.json(list);
  } catch (error: any) {
    console.error('Failed to get wishes:', error);
    res.status(500).json({ error: 'Failed to retrieve wishes' });
  }
});

app.post('/api/wishes', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, status, targetDate, completedDate, completedNotes, completedPhotos } =
      req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const inserted = await db
      .insert(wishes)
      .values({
        title,
        description: description || '',
        category: category || '旅行',
        status: status || 'pending',
        targetDate: targetDate || '',
        completedDate: completedDate || '',
        completedNotes: completedNotes || '',
        completedPhotos: typeof completedPhotos === 'string' ? completedPhotos : JSON.stringify(completedPhotos || []),
      })
      .returning();
    res.json(inserted[0]);
  } catch (error: any) {
    console.error('Failed to create wish:', error);
    res.status(500).json({ error: 'Failed to create wish' });
  }
});

app.put('/api/wishes/:id', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, description, category, status, targetDate, completedDate, completedNotes, completedPhotos } =
      req.body;
    const updated = await db
      .update(wishes)
      .set({
        title,
        description,
        category,
        status,
        targetDate,
        completedDate,
        completedNotes,
        completedPhotos: typeof completedPhotos === 'string' ? completedPhotos : JSON.stringify(completedPhotos || []),
      })
      .where(eq(wishes.id, id))
      .returning();
    res.json(updated[0]);
  } catch (error: any) {
    console.error('Failed to update wish:', error);
    res.status(500).json({ error: 'Failed to update wish' });
  }
});

app.delete('/api/wishes/:id', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(wishes).where(eq(wishes.id, id));
    res.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete wish:', error);
    res.status(500).json({ error: 'Failed to delete wish' });
  }
});

// 100 Checklists
app.get('/api/checklists', async (_req: Request, res: Response) => {
  try {
    const list = await db.select().from(checklists).orderBy(asc(checklists.itemIndex));
    res.json(list);
  } catch (error: any) {
    console.error('Failed to get checklists:', error);
    res.status(500).json({ error: 'Failed to retrieve checklists' });
  }
});

app.put('/api/checklists/:id', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { isCompleted, completedDate, note, photoUrl } = req.body;
    const updated = await db
      .update(checklists)
      .set({
        isCompleted: Boolean(isCompleted),
        completedDate: completedDate ?? '',
        note: note ?? '',
        photoUrl: photoUrl ?? '',
      })
      .where(eq(checklists.id, id))
      .returning();
    res.json(updated[0]);
  } catch (error: any) {
    console.error('Failed to update checklist item:', error);
    res.status(500).json({ error: 'Failed to update checklist item' });
  }
});

// Memories / Album
app.get('/api/memories', async (_req: Request, res: Response) => {
  try {
    const list = await db.select().from(memories).orderBy(desc(memories.date), desc(memories.id));
    res.json(list);
  } catch (error: any) {
    console.error('Failed to get memories:', error);
    res.status(500).json({ error: 'Failed to retrieve memories' });
  }
});

app.post('/api/memories', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { title, photoUrl, caption, date, tag } = req.body;
    if (!title || !photoUrl) {
      return res.status(400).json({ error: 'Title and photoUrl are required' });
    }
    const inserted = await db
      .insert(memories)
      .values({
        title,
        photoUrl,
        caption: caption || '',
        date: date || new Date().toISOString().split('T')[0],
        tag: tag || '日常',
      })
      .returning();
    res.json(inserted[0]);
  } catch (error: any) {
    console.error('Failed to create memory:', error);
    res.status(500).json({ error: 'Failed to create memory' });
  }
});

app.delete('/api/memories/:id', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(memories).where(eq(memories.id, id));
    res.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete memory:', error);
    res.status(500).json({ error: 'Failed to delete memory' });
  }
});

// Setup dev server with Vite middlewares
async function startServer() {
  await ensureInitialData();

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer();
