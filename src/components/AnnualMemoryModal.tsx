import React, { useState, useMemo } from 'react';
import {
  X,
  Sparkles,
  Heart,
  Calendar,
  BookOpen,
  Star,
  CheckCircle2,
  Copy,
  Printer,
  Download,
  Share2,
  Check,
  Gift,
  MapPin,
} from 'lucide-react';
import {
  CoupleProfile,
  Diary,
  Anniversary,
  Wish,
  ChecklistItem,
} from '../types.ts';
import {
  calculateDaysTogether,
  PRESET_AVATARS,
  MOOD_MAP,
  WEATHER_MAP,
} from '../utils/helpers.ts';

interface AnnualMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CoupleProfile;
  diaries: Diary[];
  anniversaries: Anniversary[];
  wishes: Wish[];
  checklists: ChecklistItem[];
}

export const AnnualMemoryModal: React.FC<AnnualMemoryModalProps> = ({
  isOpen,
  onClose,
  profile,
  diaries,
  anniversaries,
  wishes,
  checklists,
}) => {
  // Extract distinct years from diaries, anniversaries, wishes
  const availableYears = useMemo(() => {
    const yearSet = new Set<string>();
    const currentYear = new Date().getFullYear().toString();
    yearSet.add(currentYear);

    diaries.forEach((d) => {
      const y = d.date.split('-')[0];
      if (y) yearSet.add(y);
    });
    wishes.forEach((w) => {
      if (w.completedDate) {
        const y = w.completedDate.split('-')[0];
        if (y) yearSet.add(y);
      }
    });
    return Array.from(yearSet).sort().reverse();
  }, [diaries, wishes]);

  const [selectedYear, setSelectedYear] = useState<string>(
    availableYears[0] || '2026'
  );
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Filter items by selected year (or all)
  const filteredDiaries = useMemo(() => {
    if (selectedYear === 'all') return diaries;
    return diaries.filter((d) => d.date.startsWith(selectedYear));
  }, [diaries, selectedYear]);

  const filteredWishesCompleted = useMemo(() => {
    return wishes.filter((w) => {
      if (w.status !== 'completed') return false;
      if (selectedYear === 'all') return true;
      return w.completedDate && w.completedDate.startsWith(selectedYear);
    });
  }, [wishes, selectedYear]);

  const filteredChecklistsCompleted = useMemo(() => {
    return checklists.filter((c) => {
      if (!c.isCompleted) return false;
      if (selectedYear === 'all') return true;
      return c.completedDate && c.completedDate.startsWith(selectedYear);
    });
  }, [checklists, selectedYear]);

  const avatarA = PRESET_AVATARS[profile.userAAvatar] || PRESET_AVATARS.dog;
  const avatarB = PRESET_AVATARS[profile.userBAvatar] || PRESET_AVATARS.cat;
  const daysTogether = calculateDaysTogether(profile.togetherDate);

  // Generate shareable copy text
  const shareText = useMemo(() => {
    const yearLabel = selectedYear === 'all' ? '全部美好岁月' : `${selectedYear}年度`;
    return `💖【${profile.title} · ${yearLabel}恋爱回忆录】💖
从 ${profile.togetherDate} 牵手至今，我们已相爱 ${daysTogether} 天～

✨ 年度数字密码：
📖 写下了 ${filteredDiaries.length} 篇甜蜜日常日记
🎁 一起度过 ${anniversaries.length} 个难忘纪念日
⭐ 共同点亮实现了 ${filteredWishesCompleted.length} 个心愿
✓ 恋爱100件小事已达成 ${checklists.filter((c) => c.isCompleted).length} 件

🌟 浪漫寄语：
“${profile.quote1 || '和你一起看过的风景，都是最美的画面'}”
“${profile.quote2 || '只要有你在身边，每一天都是好天气'}”

每一天都是新的礼物，愿年年岁岁，有你相伴！💌`;
  }, [profile, selectedYear, daysTogether, filteredDiaries, anniversaries, filteredWishesCompleted, checklists]);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const exportData = {
      profile,
      year: selectedYear,
      exportDate: new Date().toISOString(),
      stats: {
        daysTogether,
        diariesCount: filteredDiaries.length,
        wishesCompletedCount: filteredWishesCompleted.length,
        checklistsCompletedCount: filteredChecklistsCompleted.length,
      },
      diaries: filteredDiaries,
      anniversaries,
      wishes: filteredWishesCompleted,
      checklists: filteredChecklistsCompleted,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.userAName}_${profile.userBName}_${selectedYear}年度恋爱回忆.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-5 overflow-y-auto backdrop-blur-xs">
      <div className="bg-[#FFFDF9] border-3 border-[#4A3528] rounded-3xl w-full max-w-3xl p-5 sm:p-7 shadow-2xl relative my-6 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FFF2E2] border border-[#4A3528] flex items-center justify-center hover:bg-[#FFE4CC]"
        >
          <X className="w-4 h-4 text-[#4A3528]" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pr-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#FEF3C7] border-2 border-[#4A3528] flex items-center justify-center text-sm shadow-xs">
                📜
              </span>
              <h3 className="text-xl font-black text-[#4A3528] font-serif">
                导出年度恋爱回忆手账
              </h3>
            </div>
            <p className="text-xs text-[#8C6D58] mt-0.5">
              将这一年的心动日常、重要纪念日与达成心愿打包生成精美纪念册
            </p>
          </div>

          {/* Year selector tabs */}
          <div className="flex items-center gap-1.5 bg-white border border-[#D1B6A1] rounded-full p-1 self-start sm:self-auto text-xs">
            {availableYears.map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-3 py-1 rounded-full font-bold transition-all ${
                  selectedYear === yr
                    ? 'bg-[#E98C58] text-white'
                    : 'text-[#8C6D58] hover:text-[#4A3528]'
                }`}
              >
                {yr}年
              </button>
            ))}
            <button
              onClick={() => setSelectedYear('all')}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                selectedYear === 'all'
                  ? 'bg-[#E98C58] text-white'
                  : 'text-[#8C6D58] hover:text-[#4A3528]'
              }`}
            >
              全部
            </button>
          </div>
        </div>

        {/* Exquisite Card to Export/Share (Printable Area) */}
        <div
          id="annual-memory-printable"
          className="bg-[#FFF9F2] border-3 border-[#4A3528] rounded-3xl p-5 sm:p-8 shadow-sm space-y-6 relative overflow-hidden"
        >
          {/* Decorative stamp in top right */}
          <div className="absolute top-4 right-4 sm:right-6 border-2 border-dashed border-[#E11D48]/50 text-[#E11D48] rounded-2xl px-3 py-1 rotate-6 text-center select-none bg-white/70">
            <span className="text-[10px] font-bold block uppercase tracking-wider">ANNUAL MEMORY</span>
            <span className="text-xs font-black font-serif">
              {selectedYear === 'all' ? '全程珍藏' : `${selectedYear} 纪念册`}
            </span>
          </div>

          {/* Card Header: Couple Avatars & Title */}
          <div className="flex items-center gap-4 border-b-2 border-[#4A3528]/15 pb-5">
            <div className="flex items-center -space-x-3">
              <div
                style={{ backgroundColor: avatarA.bg }}
                className="w-14 h-14 rounded-full border-2 border-[#4A3528] flex items-center justify-center text-2xl shadow-sm z-10"
              >
                {profile.userAAvatar.startsWith('http') ? (
                  <img src={profile.userAAvatar} alt={profile.userAName} className="w-full h-full object-cover rounded-full" />
                ) : (
                  avatarA.icon
                )}
              </div>
              <div
                style={{ backgroundColor: avatarB.bg }}
                className="w-14 h-14 rounded-full border-2 border-[#4A3528] flex items-center justify-center text-2xl shadow-sm z-20"
              >
                {profile.userBAvatar.startsWith('http') ? (
                  <img src={profile.userBAvatar} alt={profile.userBName} className="w-full h-full object-cover rounded-full" />
                ) : (
                  avatarB.icon
                )}
              </div>
            </div>

            <div>
              <h4 className="text-xl sm:text-2xl font-black text-[#4A3528] font-serif tracking-wide">
                {profile.title || '甜蜜恋爱小窝'}
              </h4>
              <p className="text-xs text-[#8C6D58] mt-0.5 flex items-center gap-2">
                <span>{profile.userAName} & {profile.userBName}</span>
                <span>·</span>
                <span>相爱第 <strong className="text-[#E98C58] text-sm font-serif">{daysTogether}</strong> 天</span>
              </p>
            </div>
          </div>

          {/* 4 Stats Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#FFFDF9] border-2 border-[#4A3528] rounded-2xl p-3 text-center">
              <div className="text-2xl font-black text-[#E98C58] font-serif">
                {filteredDiaries.length}
              </div>
              <div className="text-[11px] font-bold text-[#8C6D58] mt-0.5">记录日常篇数</div>
            </div>

            <div className="bg-[#FFFDF9] border-2 border-[#4A3528] rounded-2xl p-3 text-center">
              <div className="text-2xl font-black text-[#E11D48] font-serif">
                {anniversaries.length}
              </div>
              <div className="text-[11px] font-bold text-[#8C6D58] mt-0.5">纪念日里程度过</div>
            </div>

            <div className="bg-[#FFFDF9] border-2 border-[#4A3528] rounded-2xl p-3 text-center">
              <div className="text-2xl font-black text-[#059669] font-serif">
                {filteredWishesCompleted.length}
              </div>
              <div className="text-[11px] font-bold text-[#8C6D58] mt-0.5">共同达成心愿</div>
            </div>

            <div className="bg-[#FFFDF9] border-2 border-[#4A3528] rounded-2xl p-3 text-center">
              <div className="text-2xl font-black text-[#7C3AED] font-serif">
                {checklists.filter((c) => c.isCompleted).length}
              </div>
              <div className="text-[11px] font-bold text-[#8C6D58] mt-0.5">100件小事打卡</div>
            </div>
          </div>

          {/* Highlights 1: 纪念日合辑 */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-xs sm:text-sm text-[#4A3528] flex items-center gap-1.5 border-b border-[#4A3528]/10 pb-1.5">
              <Gift className="w-4 h-4 text-[#E98C58]" />
              <span>特别的日子 · 纪念日刻印</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {anniversaries.map((ann) => (
                <div
                  key={ann.id}
                  className="bg-white/80 border border-[#4A3528]/30 rounded-xl p-2.5 flex items-center justify-between"
                >
                  <span className="font-bold text-[#4A3528]">{ann.title}</span>
                  <span className="text-[11px] text-[#8C6D58]">{ann.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights 2: 心动日记摘录 */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-xs sm:text-sm text-[#4A3528] flex items-center gap-1.5 border-b border-[#4A3528]/10 pb-1.5">
              <BookOpen className="w-4 h-4 text-[#0284C7]" />
              <span>日常温暖瞬间 · 甜蜜日记精选</span>
            </h5>
            {filteredDiaries.length === 0 ? (
              <p className="text-xs text-[#8C6D58] italic py-2">
                该年度暂无日常记录，期待写下新的篇章～
              </p>
            ) : (
              <div className="space-y-2.5">
                {filteredDiaries.slice(0, 3).map((diary) => {
                  const mood = MOOD_MAP[diary.mood] || MOOD_MAP.happy;
                  const weather = WEATHER_MAP[diary.weather] || WEATHER_MAP.sunny;
                  return (
                    <div
                      key={diary.id}
                      className="bg-white border-2 border-[#4A3528] rounded-2xl p-3.5 space-y-1.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#4A3528]">{diary.title}</span>
                          <span className="text-xs">{mood.emoji}</span>
                          <span className="text-xs">{weather.icon}</span>
                        </div>
                        <span className="text-[11px] text-[#8C6D58]">{diary.date}</span>
                      </div>
                      <p className="text-xs text-[#8C6D58] line-clamp-2 leading-relaxed">
                        {diary.content}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Highlights 3: 已实现的心愿 */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-xs sm:text-sm text-[#4A3528] flex items-center gap-1.5 border-b border-[#4A3528]/10 pb-1.5">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span>共同点亮的心愿清单</span>
            </h5>
            {filteredWishesCompleted.length === 0 ? (
              <p className="text-xs text-[#8C6D58] italic py-2">
                这一年还在为梦想努力积蓄能量中～
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {filteredWishesCompleted.map((wish) => (
                  <div
                    key={wish.id}
                    className="bg-[#D1FAE5]/60 border border-[#059669]/40 rounded-xl p-2.5 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#065F46] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                        {wish.title}
                      </span>
                      <span className="text-[10px] text-[#065F46]/80">{wish.completedDate}</span>
                    </div>
                    {wish.completedNotes && (
                      <p className="text-[11px] text-[#047857] italic line-clamp-1">
                        “{wish.completedNotes}”
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Romantic Bottom Quotes */}
          <div className="text-center pt-3 border-t border-[#4A3528]/15 space-y-1">
            <p className="text-xs font-semibold text-[#4A3528] font-serif italic">
              “{profile.quote1 || '和你一起看过的风景，都是最美的画面'}”
            </p>
            <p className="text-[11px] text-[#8C6D58]">
              {profile.title} · 愿年年岁岁，朝暮相伴
            </p>
          </div>
        </div>

        {/* Action Buttons: Copy Text, Print / Save PDF, Download JSON */}
        <div className="mt-5 pt-3 border-t border-[#4A3528]/15 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border-2 border-[#4A3528] text-xs font-bold transition-all shadow-2xs ${
                copied
                  ? 'bg-[#10B981] text-white'
                  : 'bg-white hover:bg-[#FFF2E2] text-[#4A3528]'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-[#E98C58]" />}
              <span>{copied ? '已复制文案！' : '复制朋友圈分享文案'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#FFF2E2] text-[#4A3528] text-xs font-bold rounded-full border-2 border-[#4A3528] transition-all shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-[#E98C58]" />
              <span>打印 / 存为PDF</span>
            </button>

            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#FFF2E2] text-[#4A3528] text-xs font-bold rounded-full border-2 border-[#4A3528] transition-all shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-[#E98C58]" />
              <span>导出JSON备份</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#E98C58] hover:bg-[#d87c48] text-white text-xs font-bold rounded-full border-2 border-[#4A3528] shadow-sm hover:scale-105 transition-all"
          >
            关闭预览
          </button>
        </div>
      </div>
    </div>
  );
};
