import React from 'react';
import {
  Heart,
  Gift,
  BookOpen,
  Calendar,
  Star,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Edit3,
  MessageCircleHeart,
  Palette,
  Dice5,
} from 'lucide-react';
import { CoupleProfile, TabKey, Anniversary, CoupleTopic } from '../types.ts';
import {
  calculateDaysTogether,
  calculateDaysUntil,
  PRESET_AVATARS,
} from '../utils/helpers.ts';

interface HomeViewProps {
  profile: CoupleProfile;
  anniversaries: Anniversary[];
  todaysTopic?: CoupleTopic;
  onSelectTab: (tab: TabKey) => void;
  onOpenSettings: () => void;
  onOpenNewDiary: () => void;
  onOpenTheme: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  profile,
  anniversaries,
  todaysTopic,
  onSelectTab,
  onOpenSettings,
  onOpenNewDiary,
  onOpenTheme,
}) => {
  const daysTogether = calculateDaysTogether(profile.togetherDate);

  // Find nearest upcoming anniversary
  const upcomingAnniversary = React.useMemo(() => {
    if (!anniversaries || anniversaries.length === 0) {
      return {
        title: '一周年 🎉',
        daysRemaining: 7,
        progressPercent: 98,
        notes: '我们相爱一整年啦！',
      };
    }
    const withCountdowns = anniversaries.map((ann) => {
      const { daysRemaining, progressPercent } = calculateDaysUntil(
        ann.date,
        ann.repeatType
      );
      return {
        ...ann,
        daysRemaining,
        progressPercent,
      };
    });
    withCountdowns.sort((a, b) => a.daysRemaining - b.daysRemaining);
    return withCountdowns[0];
  }, [anniversaries]);

  const avatarA = PRESET_AVATARS[profile.userAAvatar] || PRESET_AVATARS.dog;
  const avatarB = PRESET_AVATARS[profile.userBAvatar] || PRESET_AVATARS.cat;

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Hero Love Days Card */}
      <section className="relative overflow-hidden bg-white/95 border-2 border-inherit rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(74,53,40,0.06)]">
        {/* Subtle background sparkles */}
        <div className="absolute top-4 left-6 text-pink-300 opacity-40 select-none text-xl">✦</div>
        <div className="absolute top-8 right-12 text-yellow-400 opacity-50 select-none text-lg">★</div>
        <div className="absolute bottom-4 left-16 text-pink-300 opacity-50 select-none text-sm">♥</div>
        <div className="absolute bottom-6 right-20 text-sky-300 opacity-60 select-none text-xl">✦</div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Couple Avatars with Heartbeat Pulse Line */}
          <div className="w-full max-w-xl flex items-center justify-between gap-2 sm:gap-4 my-2">
            {/* Avatar A */}
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0 group">
              <div className="relative">
                <div
                  style={{ backgroundColor: avatarA.bg }}
                  className="w-18 h-18 sm:w-24 sm:h-24 rounded-full border-3 border-inherit flex items-center justify-center text-3xl sm:text-4xl shadow-md group-hover:scale-105 transition-transform overflow-hidden"
                >
                  {profile.userAAvatar.startsWith('http') || profile.userAAvatar.startsWith('data:') ? (
                    <img src={profile.userAAvatar} alt={profile.userAName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{avatarA.icon}</span>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border-2 border-inherit flex items-center justify-center text-[10px] font-bold">
                  ♂
                </div>
              </div>
              <span className="font-bold text-xs sm:text-sm bg-black/5 px-2.5 py-0.5 rounded-full border border-inherit/20">
                {profile.userAName || '呆呆'}
              </span>
            </div>

            {/* Center Heartbeat Line + Days Counter */}
            <div className="flex-1 flex flex-col items-center justify-center px-1 sm:px-4">
              <span className="text-xs sm:text-sm font-medium opacity-80 tracking-widest mb-0.5">
                我们已相爱
              </span>

              {/* Heartbeat ECG Line */}
              <div className="w-full flex items-center justify-center gap-1 sm:gap-2 my-1">
                <svg
                  className="w-full max-w-[280px] h-8 sm:h-10 text-[var(--accent-pink)]"
                  viewBox="0 0 240 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M 0 20 L 50 20 L 60 12 L 70 28 L 80 16 L 90 20 L 110 20" />
                  <path d="M 130 20 L 150 20 L 160 12 L 170 28 L 180 16 L 190 20 L 240 20" />
                </svg>
              </div>

              {/* Huge Days Badge */}
              <div className="flex items-baseline gap-1 my-0.5">
                <span className="text-4xl sm:text-5xl font-black text-[var(--accent-orange)] tracking-tight drop-shadow-xs font-serif">
                  {daysTogether}
                </span>
                <span className="text-xl sm:text-2xl font-bold text-[var(--accent-orange)]">天</span>
              </div>

              {/* Heart Icon */}
              <div className="my-1">
                <Heart className="w-4 h-4 text-[#F472B6] fill-[#F472B6] animate-pulse-heart" />
              </div>

              {/* Start Date & Quick Edit Button */}
              <button
                onClick={onOpenSettings}
                className="mt-1 flex items-center gap-1 text-[11px] sm:text-xs opacity-80 hover:opacity-100 bg-white/80 border border-inherit/30 hover:border-inherit px-2.5 py-1 rounded-full transition-all"
              >
                <span>从 {profile.togetherDate} 开始</span>
                <Edit3 className="w-3 h-3 text-[var(--accent-orange)]" />
              </button>
            </div>

            {/* Avatar B */}
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0 group">
              <div className="relative">
                <div
                  style={{ backgroundColor: avatarB.bg }}
                  className="w-18 h-18 sm:w-24 sm:h-24 rounded-full border-3 border-inherit flex items-center justify-center text-3xl sm:text-4xl shadow-md group-hover:scale-105 transition-transform overflow-hidden"
                >
                  {profile.userBAvatar.startsWith('http') || profile.userBAvatar.startsWith('data:') ? (
                    <img src={profile.userBAvatar} alt={profile.userBName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{avatarB.icon}</span>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border-2 border-inherit flex items-center justify-center text-[10px] font-bold">
                  ♀
                </div>
              </div>
              <span className="font-bold text-xs sm:text-sm bg-black/5 px-2.5 py-0.5 rounded-full border border-inherit/20">
                {profile.userBName || '圆圆'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 即将到来的纪念日 */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold">
            <Calendar className="w-4 h-4 text-[var(--accent-orange)]" />
            <span>即将到来的纪念日</span>
          </h2>
          <button
            onClick={() => onSelectTab('anniversaries')}
            className="text-xs opacity-75 hover:opacity-100 font-medium flex items-center gap-0.5"
          >
            全部纪念日 <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-white/95 border-2 border-inherit rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-[var(--accent-orange)] border-2 border-inherit flex items-center justify-center flex-shrink-0 text-white shadow-xs">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg">
                  {upcomingAnniversary.title}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 bg-[#FEF3C7] text-[#D97706] border border-inherit/30 rounded-full">
                  还有 {upcomingAnniversary.daysRemaining} 天
                </span>
              </div>
              <p className="text-xs opacity-75 mt-0.5">
                {upcomingAnniversary.notes || '期待这一天的到来，一起创造更多甜甜回忆'}
              </p>
            </div>
          </div>

          {/* Countdown Progress Bar */}
          <div className="flex flex-col sm:items-end gap-1.5 sm:min-w-[200px]">
            <span className="text-[11px] opacity-75 font-medium">倒计时进度</span>
            <div className="w-full sm:w-48 h-3.5 bg-black/5 rounded-full border-2 border-inherit overflow-hidden p-0.5">
              <div
                style={{ width: `${Math.max(8, upcomingAnniversary.progressPercent)}%` }}
                className="h-full bg-[var(--accent-orange)] rounded-full transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. 今日心动互动话题 (Topic Generator Mini Card) */}
      {todaysTopic && (
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold">
              <MessageCircleHeart className="w-4 h-4 text-[#DB2777]" />
              <span>今日心动问答 · 发现更懂TA的瞬间</span>
            </h2>
            <button
              onClick={() => onSelectTab('topics')}
              className="text-xs text-[var(--accent-orange)] hover:underline font-bold flex items-center gap-0.5"
            >
              进入问答小馆 <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div
            onClick={() => onSelectTab('topics')}
            className="cursor-pointer bg-gradient-to-r from-[#FFF5F7] to-[#FFFBF5] border-2 border-inherit rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
          >
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-full bg-[#FCE7F3] border-2 border-inherit flex items-center justify-center flex-shrink-0 text-xl group-hover:scale-110 transition-transform">
                💬
              </div>
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-inherit/20 text-[#DB2777]">
                  {todaysTopic.category}
                </span>
                <h3 className="font-bold text-sm sm:text-base mt-1 line-clamp-1 font-serif group-hover:text-[var(--accent-orange)] transition-colors">
                  “{todaysTopic.question}”
                </h3>
                <p className="text-xs opacity-70 mt-0.5">
                  {todaysTopic.userAAnswer && todaysTopic.userBAnswer
                    ? '🎉 双方已完成真心话作答，点击回顾甜蜜回答'
                    : '💌 专属两人互动，各写一句真心话解锁对方答案'}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="flex items-center gap-1.5 px-4 py-2 bg-[var(--accent-orange)] text-white text-xs font-bold rounded-full border-2 border-inherit self-start sm:self-auto shadow-2xs group-hover:scale-105 transition-all flex-shrink-0"
            >
              <span>{todaysTopic.userAAnswer && todaysTopic.userBAnswer ? '查看回答' : '去回答'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </section>
      )}

      {/* 4. 快速入口 */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>快速入口</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5">
          {/* 日常记录 */}
          <div
            onClick={() => onSelectTab('diaries')}
            className="group cursor-pointer bg-white/95 border-2 border-inherit rounded-2xl p-3.5 flex flex-col items-center text-center shadow-xs hover:-translate-y-1 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-[#E0F2FE] border-2 border-inherit flex items-center justify-center text-xl mb-1.5 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5 text-[#0284C7]" />
            </div>
            <span className="font-bold text-xs sm:text-sm">日常记录</span>
            <span className="text-[10px] opacity-70 mt-0.5">记录美好瞬间</span>
          </div>

          {/* 纪念日 */}
          <div
            onClick={() => onSelectTab('anniversaries')}
            className="group cursor-pointer bg-white/95 border-2 border-inherit rounded-2xl p-3.5 flex flex-col items-center text-center shadow-xs hover:-translate-y-1 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-[#D1FAE5] border-2 border-inherit flex items-center justify-center text-xl mb-1.5 group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5 text-[#059669]" />
            </div>
            <span className="font-bold text-xs sm:text-sm">纪念日</span>
            <span className="text-[10px] opacity-70 mt-0.5">重要的日子</span>
          </div>

          {/* 心愿清单 */}
          <div
            onClick={() => onSelectTab('wishes')}
            className="group cursor-pointer bg-white/95 border-2 border-inherit rounded-2xl p-3.5 flex flex-col items-center text-center shadow-xs hover:-translate-y-1 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-[#EDE9FE] border-2 border-inherit flex items-center justify-center text-xl mb-1.5 group-hover:scale-110 transition-transform">
              <Star className="w-5 h-5 text-[#7C3AED]" />
            </div>
            <span className="font-bold text-xs sm:text-sm">心愿清单</span>
            <span className="text-[10px] opacity-70 mt-0.5">未来的计划</span>
          </div>

          {/* 回忆库 */}
          <div
            onClick={() => onSelectTab('memories')}
            className="group cursor-pointer bg-white/95 border-2 border-inherit rounded-2xl p-3.5 flex flex-col items-center text-center shadow-xs hover:-translate-y-1 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-[#FCE7F3] border-2 border-inherit flex items-center justify-center text-xl mb-1.5 group-hover:scale-110 transition-transform">
              <ImageIcon className="w-5 h-5 text-[#DB2777]" />
            </div>
            <span className="font-bold text-xs sm:text-sm">回忆库</span>
            <span className="text-[10px] opacity-70 mt-0.5">珍藏的时光</span>
          </div>

          {/* 100件小事打卡 */}
          <div
            onClick={() => onSelectTab('checklist')}
            className="group cursor-pointer bg-white/95 border-2 border-inherit rounded-2xl p-3.5 flex flex-col items-center text-center shadow-xs hover:-translate-y-1 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-[#FEF3C7] border-2 border-inherit flex items-center justify-center text-xl mb-1.5 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5 text-[#D97706]" />
            </div>
            <span className="font-bold text-xs sm:text-sm">100件小事</span>
            <span className="text-[10px] opacity-70 mt-0.5">恋爱打卡清单</span>
          </div>

          {/* 心动问答 */}
          <div
            onClick={() => onSelectTab('topics')}
            className="group cursor-pointer bg-white/95 border-2 border-inherit rounded-2xl p-3.5 flex flex-col items-center text-center shadow-xs hover:-translate-y-1 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-[#FFE4E6] border-2 border-inherit flex items-center justify-center text-xl mb-1.5 group-hover:scale-110 transition-transform">
              <MessageCircleHeart className="w-5 h-5 text-[#E11D48]" />
            </div>
            <span className="font-bold text-xs sm:text-sm">心动问答</span>
            <span className="text-[10px] opacity-70 mt-0.5">情侣默契话题</span>
          </div>
        </div>
      </section>

      {/* 5. Sweet Couple Story Cards (Quotes & Illustrations) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1 */}
        <div className="bg-white/95 border-2 border-inherit rounded-2xl overflow-hidden shadow-xs flex flex-col group">
          <div className="h-52 sm:h-60 overflow-hidden bg-black/5 relative">
            <img
              src="/assets/aistudio/image_fe939c68.png"
              alt="和你一起看过的风景"
              className="w-full h-full object-cover object-bottom group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-4 text-center bg-white/95 border-t-2 border-inherit">
            <p className="text-sm font-semibold font-serif tracking-wide italic">
              "{profile.quote1 || '和你一起看过的风景，都是最美的画面'}"
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white/95 border-2 border-inherit rounded-2xl overflow-hidden shadow-xs flex flex-col group">
          <div className="h-52 sm:h-60 overflow-hidden bg-black/5 relative">
            <img
              src="/assets/aistudio/image_c593c0a7.png"
              alt="只要有你在身边"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-4 text-center bg-white/95 border-t-2 border-inherit">
            <p className="text-sm font-semibold font-serif tracking-wide italic">
              "{profile.quote2 || '只要有你在身边，每一天都是好天气'}"
            </p>
          </div>
        </div>
      </section>

      {/* 6. "继续创造 属于我们的故事" Banner */}
      <section className="bg-white/95 border-2 border-inherit rounded-3xl p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="w-full lg:w-3/5 rounded-2xl border-2 border-inherit overflow-hidden h-48 sm:h-60 bg-black/5">
            <img
              src="/assets/aistudio/image_f0e5a2c8.png"
              alt="继续创造我们的故事"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full lg:w-2/5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-3">
            <span className="text-xs font-bold text-[var(--accent-orange)] tracking-widest uppercase flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> OUR SWEET STORY
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight font-serif">
              继续创造<br className="hidden sm:inline" />属于我们的故事
            </h3>
            <p className="text-xs sm:text-sm opacity-80 leading-relaxed max-w-sm">
              每一天都是新的开始，每一刻都值得被记录。用镜头和文字，把平凡的日子写成我们的诗。
            </p>
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={onOpenNewDiary}
                className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent-orange)] hover:opacity-90 text-white font-bold text-sm rounded-full border-2 border-inherit shadow-md hover:scale-105 transition-all"
              >
                <Clock className="w-4 h-4" />
                <span>去记录</span>
              </button>

              <button
                onClick={onOpenTheme}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-black/5 font-bold text-xs rounded-full border-2 border-inherit shadow-2xs transition-all"
              >
                <Palette className="w-3.5 h-3.5 text-[var(--accent-orange)]" />
                <span>换个主题</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Quote */}
      <footer className="text-center pt-4 pb-2 opacity-75 text-xs space-y-1">
        <div className="flex items-center justify-center gap-1">
          <Heart className="w-3.5 h-3.5 text-[#F472B6] fill-[#F472B6]" />
          <span className="font-medium">{profile.title || '呆呆 & 圆圆 的恋爱小窝'}</span>
        </div>
        <p className="text-[11px] opacity-80">每一天都是礼物 · 永远相爱</p>
      </footer>
    </div>
  );
};
