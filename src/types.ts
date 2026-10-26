export interface CoupleTheme {
  id: string;
  name: string;
  subtitle: string;
  primaryColor: string;
  bgColor: string;
  cardBg: string;
  borderColor: string;
  textColor: string;
  secondaryText: string;
  fontFamily: 'system' | 'serif' | 'rounded' | 'handwritten';
  pattern: 'dots' | 'hearts' | 'stars' | 'grid' | 'clean';
  badgeBg: string;
  badgeText: string;
}

export interface CoupleProfile {
  id: number;
  title: string;
  subTitle: string;
  togetherDate: string;
  userAName: string;
  userAAvatar: string;
  userBName: string;
  userBAvatar: string;
  quote1: string;
  quote2: string;
  bannerImage: string;
  // Theme System
  themeId: string;
  customPrimaryColor: string;
  customBgColor: string;
  customBorderColor: string;
  customFontFamily: string;
  customBgPattern: string;
  customBgImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CoupleTopic {
  id: number;
  question: string;
  category: '甜蜜回忆' | '深度灵魂' | '脑洞奇想' | '浪漫未来' | '日常温情';
  userAAnswer: string;
  userBAnswer: string;
  answeredAt: string;
  isFavorite: boolean;
  createdAt?: string;
}

export interface Diary {
  id: number;
  title: string;
  content: string;
  date: string;
  location?: string;
  mood: 'happy' | 'sweet' | 'excited' | 'silly' | 'calm';
  weather: 'sunny' | 'cloudy' | 'rainy' | 'snowy';
  photos: string; // JSON array string
  author?: string;
  createdAt?: string;
}

export interface Anniversary {
  id: number;
  title: string;
  date: string;
  repeatType: 'yearly' | 'monthly' | 'once';
  icon: 'gift' | 'heart' | 'cake' | 'ring' | 'plane' | 'star';
  notes?: string;
  isTop?: boolean;
  createdAt?: string;
}

export interface Wish {
  id: number;
  title: string;
  description?: string;
  category: string;
  status: 'pending' | 'completed';
  targetDate?: string;
  completedDate?: string;
  completedNotes?: string;
  completedPhotos?: string;
  createdAt?: string;
}

export interface ChecklistItem {
  id: number;
  itemIndex: number;
  title: string;
  category: string;
  isCompleted: boolean;
  completedDate?: string;
  note?: string;
  photoUrl?: string;
  createdAt?: string;
}

export interface Memory {
  id: number;
  title: string;
  photoUrl: string;
  caption?: string;
  date: string;
  tag?: string;
  createdAt?: string;
}

export type TabKey =
  | 'home'
  | 'diaries'
  | 'anniversaries'
  | 'wishes'
  | 'memories'
  | 'checklist'
  | 'topics'
  | 'theme';
