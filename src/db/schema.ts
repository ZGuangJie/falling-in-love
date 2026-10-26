import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Couple Profile Settings & Theme Customization
export const coupleProfile = pgTable('couple_profile', {
  id: serial('id').primaryKey(),
  title: text('title').notNull().default('呆呆 & 圆圆 的恋爱小窝'),
  subTitle: text('sub_title').notNull().default('每一天都是新的开始，每一刻都值得被记录'),
  togetherDate: text('together_date').notNull().default('2025-03-24'),
  userAName: text('user_a_name').notNull().default('呆呆'),
  userAAvatar: text('user_a_avatar').notNull().default('dog'),
  userBName: text('user_b_name').notNull().default('圆圆'),
  userBAvatar: text('user_b_avatar').notNull().default('cat'),
  quote1: text('quote_1').notNull().default('和你一起看过的风景，都是最美的画面'),
  quote2: text('quote_2').notNull().default('只要有你在身边，每一天都是好天气'),
  bannerImage: text('banner_image').default('/assets/aistudio/image_c593c0a7.png'),
  // Theme System
  themeId: text('theme_id').notNull().default('warm-cream'),
  customPrimaryColor: text('custom_primary_color').notNull().default('#E98C58'),
  customBgColor: text('custom_bg_color').notNull().default('#FFF9F2'),
  customBorderColor: text('custom_border_color').notNull().default('#4A3528'),
  customFontFamily: text('custom_font_family').notNull().default('system'),
  customBgPattern: text('custom_bg_pattern').notNull().default('dots'),
  customBgImage: text('custom_bg_image').default(''),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Couple Interactive Topics / Daily Q&A Generator (情侣互动话题)
export const coupleTopics = pgTable('couple_topics', {
  id: serial('id').primaryKey(),
  question: text('question').notNull(),
  category: text('category').notNull().default('甜蜜回忆'), // 甜蜜回忆, 深度灵魂, 脑洞奇想, 浪漫未来, 日常温情
  userAAnswer: text('user_a_answer').default(''),
  userBAnswer: text('user_b_answer').default(''),
  answeredAt: text('answered_at').default(''),
  isFavorite: boolean('is_favorite').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Daily Diaries / Timeline
export const diaries = pgTable('diaries', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  date: text('date').notNull(), // 'YYYY-MM-DD'
  location: text('location').default(''),
  mood: text('mood').notNull().default('happy'), // happy, sweet, excited, silly, calm
  weather: text('weather').notNull().default('sunny'), // sunny, cloudy, rainy, snowy
  photos: text('photos').notNull().default('[]'), // JSON string array of image URLs
  author: text('author').default('呆呆'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Anniversaries
export const anniversaries = pgTable('anniversaries', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  date: text('date').notNull(), // 'YYYY-MM-DD'
  repeatType: text('repeat_type').notNull().default('yearly'), // 'yearly', 'monthly', 'once'
  icon: text('icon').notNull().default('gift'), // gift, heart, cake, ring, plane, star
  notes: text('notes').default(''),
  isTop: boolean('is_top').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Wishlist
export const wishes = pgTable('wishes', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').default(''),
  category: text('category').notNull().default('旅行'), // 旅行, 娱乐, 美食, 浪漫, 生活
  status: text('status').notNull().default('pending'), // pending, completed
  targetDate: text('target_date').default(''),
  completedDate: text('completed_date').default(''),
  completedNotes: text('completed_notes').default(''),
  completedPhotos: text('completed_photos').default('[]'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 100 Things to do together (恋爱100件小事)
export const checklists = pgTable('checklists', {
  id: serial('id').primaryKey(),
  itemIndex: integer('item_index').notNull().unique(),
  title: text('title').notNull(),
  category: text('category').notNull().default('日常陪伴'),
  isCompleted: boolean('is_completed').notNull().default(false),
  completedDate: text('completed_date').default(''),
  note: text('note').default(''),
  photoUrl: text('photo_url').default(''),
  createdAt: timestamp('created_at').defaultNow(),
});

// Memory Photo Album
export const memories = pgTable('memories', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  photoUrl: text('photo_url').notNull(),
  caption: text('caption').default(''),
  date: text('date').notNull(),
  tag: text('tag').default('日常'),
  createdAt: timestamp('created_at').defaultNow(),
});
