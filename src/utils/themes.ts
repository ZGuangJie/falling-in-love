import { CoupleTheme } from '../types.ts';

export const PRESET_THEMES: Record<string, CoupleTheme> = {
  'warm-cream': {
    id: 'warm-cream',
    name: '暖阳奶油',
    subtitle: '治愈系焦糖奶油插画风，温馨复古如初见',
    primaryColor: '#E98C58',
    bgColor: '#FFF9F2',
    cardBg: '#FFFDF9',
    borderColor: '#4A3528',
    textColor: '#4A3528',
    secondaryText: '#8C6D58',
    fontFamily: 'system',
    pattern: 'dots',
    badgeBg: '#FEF3C7',
    badgeText: '#D97706',
  },
  'sakura-pink': {
    id: 'sakura-pink',
    name: '樱落粉梦',
    subtitle: '春日樱花与草莓酪酪，心动少女感与甜蜜梦境',
    primaryColor: '#E11D48',
    bgColor: '#FFF1F5',
    cardBg: '#FFFFFF',
    borderColor: '#60223B',
    textColor: '#501C2F',
    secondaryText: '#9A4C68',
    fontFamily: 'rounded',
    pattern: 'hearts',
    badgeBg: '#FCE7F3',
    badgeText: '#BE185D',
  },
  'midnight-star': {
    id: 'midnight-star',
    name: '极夜星河',
    subtitle: '浩瀚星空与微醺薰衣草，浪漫静谧的夜空私语',
    primaryColor: '#8B5CF6',
    bgColor: '#161522',
    cardBg: '#211E33',
    borderColor: '#595079',
    textColor: '#F3EEFA',
    secondaryText: '#B8AFD1',
    fontFamily: 'serif',
    pattern: 'stars',
    badgeBg: '#3B3358',
    badgeText: '#DDD6FE',
  },
  'forest-mint': {
    id: 'forest-mint',
    name: '森林薄荷',
    subtitle: '森系抹茶与尤加利叶，清爽治愈的夏日微风',
    primaryColor: '#059669',
    bgColor: '#F4FAF4',
    cardBg: '#FFFFFF',
    borderColor: '#26432F',
    textColor: '#1E3826',
    secondaryText: '#51745C',
    fontFamily: 'system',
    pattern: 'grid',
    badgeBg: '#D1FAE5',
    badgeText: '#047857',
  },
};

export const FONT_OPTIONS = [
  {
    id: 'system',
    name: '经典随性',
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', sans-serif",
  },
  {
    id: 'serif',
    name: '典雅宋体',
    fontFamily: "'Songti SC', 'SimSun', 'STSong', 'Noto Serif SC', serif",
  },
  {
    id: 'rounded',
    name: '萌系圆体',
    fontFamily: "'PingFang SC', 'Hiragino Sans GB', 'Arial Rounded MT Bold', sans-serif",
  },
  {
    id: 'handwritten',
    name: '治愈手写感',
    fontFamily: "'Kaiti SC', 'STKaiti', 'KaiTi', 'Yuanti SC', cursive, sans-serif",
  },
];

export const PATTERN_OPTIONS = [
  { id: 'dots', name: '波点点缀', icon: '🐾' },
  { id: 'hearts', name: '粉爱心雨', icon: '♥' },
  { id: 'stars', name: '璀璨星辰', icon: '✦' },
  { id: 'grid', name: '日系方格', icon: '▦' },
  { id: 'clean', name: '纯净纯色', icon: '◻' },
];

export function getBackgroundPatternStyle(pattern: string, isDark: boolean = false): React.CSSProperties {
  const dotColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(74, 53, 40, 0.08)';

  switch (pattern) {
    case 'dots':
      return {
        backgroundImage: `radial-gradient(${dotColor} 1.5px, transparent 1.5px)`,
        backgroundSize: '24px 24px',
      };
    case 'grid':
      return {
        backgroundImage: `linear-gradient(${dotColor} 1px, transparent 1px), linear-gradient(90deg, ${dotColor} 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      };
    case 'stars':
      return {
        backgroundImage: `radial-gradient(circle at 10px 10px, ${dotColor} 2px, transparent 2px), radial-gradient(circle at 25px 25px, ${dotColor} 1px, transparent 1px)`,
        backgroundSize: '36px 36px',
      };
    case 'hearts':
      return {
        backgroundImage: `radial-gradient(circle at 12px 12px, ${dotColor} 2px, transparent 3px)`,
        backgroundSize: '28px 28px',
      };
    case 'clean':
    default:
      return {
        backgroundImage: 'none',
      };
  }
}
