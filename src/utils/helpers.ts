export function calculateDaysTogether(startDateStr: string): number {
  if (!startDateStr) return 0;
  const start = new Date(startDateStr);
  const now = new Date();
  // Normalize to UTC midnight to avoid DST issues
  const diffTime = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export function calculateDaysUntil(targetDateStr: string, repeatType: string = 'yearly'): { daysRemaining: number; nextDateStr: string; progressPercent: number } {
  if (!targetDateStr) return { daysRemaining: 0, nextDateStr: '', progressPercent: 0 };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parts = targetDateStr.split('-');
  if (parts.length < 3) return { daysRemaining: 0, nextDateStr: targetDateStr, progressPercent: 0 };

  const targetYear = parseInt(parts[0], 10);
  const targetMonth = parseInt(parts[1], 10) - 1;
  const targetDay = parseInt(parts[2], 10);

  let nextDate = new Date(today.getFullYear(), targetMonth, targetDay);

  if (repeatType === 'yearly') {
    if (nextDate.getTime() < today.getTime()) {
      nextDate = new Date(today.getFullYear() + 1, targetMonth, targetDay);
    }
    const daysInYear = 365;
    const diffTime = nextDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const progressPercent = Math.min(100, Math.max(5, Math.round(((daysInYear - daysRemaining) / daysInYear) * 100)));
    return {
      daysRemaining,
      nextDateStr: `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(nextDate.getDate()).padStart(2, '0')}`,
      progressPercent,
    };
  } else if (repeatType === 'monthly') {
    nextDate = new Date(today.getFullYear(), today.getMonth(), targetDay);
    if (nextDate.getTime() < today.getTime()) {
      nextDate = new Date(today.getFullYear(), today.getMonth() + 1, targetDay);
    }
    const diffTime = nextDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const progressPercent = Math.min(100, Math.max(5, Math.round(((30 - daysRemaining) / 30) * 100)));
    return {
      daysRemaining,
      nextDateStr: `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(nextDate.getDate()).padStart(2, '0')}`,
      progressPercent,
    };
  } else {
    const directTarget = new Date(targetYear, targetMonth, targetDay);
    const diffTime = directTarget.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return {
      daysRemaining: Math.max(0, daysRemaining),
      nextDateStr: targetDateStr,
      progressPercent: daysRemaining <= 0 ? 100 : Math.max(10, 100 - daysRemaining),
    };
  }
}

// Preset cute avatars
export const PRESET_AVATARS: Record<string, { label: string; icon: string; bg: string }> = {
  dog: { label: '呆萌修勾', icon: '🐶', bg: '#FEEFD6' },
  cat: { label: '可爱猫咪', icon: '🐱', bg: '#FCE7F3' },
  bunny: { label: '软萌小兔', icon: '🐰', bg: '#FEF3C7' },
  bear: { label: '温顺小熊', icon: '🐻', bg: '#E2E8F0' },
  fox: { label: '机灵小狐', icon: '🦊', bg: '#FFEDD5' },
  penguin: { label: '憨憨企鹅', icon: '🐧', bg: '#E0F2FE' },
};

export const MOOD_MAP: Record<string, { label: string; emoji: string; color: string; bg: string }> = {
  excited: { label: '兴奋', emoji: '😆', color: '#D97706', bg: '#FEF3C7' },
  sweet: { label: '甜蜜', emoji: '🥰', color: '#DB2777', bg: '#FCE7F3' },
  happy: { label: '开心', emoji: '😊', color: '#EA580C', bg: '#FFEDD5' },
  silly: { label: '搞怪', emoji: '🤪', color: '#7C3AED', bg: '#EDE9FE' },
  calm: { label: '平静', emoji: '🌿', color: '#059669', bg: '#D1FAE5' },
};

export const WEATHER_MAP: Record<string, { label: string; icon: string }> = {
  sunny: { label: '晴天', icon: '☀️' },
  cloudy: { label: '多云', icon: '🌤️' },
  rainy: { label: '雨天', icon: '🌧️' },
  snowy: { label: '雪天', icon: '❄️' },
};
