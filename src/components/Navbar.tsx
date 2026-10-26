import React from 'react';
import {
  Heart,
  Home,
  BookOpen,
  Calendar,
  Star,
  Image as ImageIcon,
  CheckCircle2,
  MessageCircleHeart,
  Palette,
  Settings,
  Smartphone,
  Monitor,
} from 'lucide-react';
import { TabKey, CoupleProfile } from '../types.ts';

interface NavbarProps {
  currentTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  profile: CoupleProfile;
  onOpenSettings: () => void;
  onOpenTheme: () => void;
  isWeChatMode: boolean;
  onToggleWeChatMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  profile,
  onOpenSettings,
  onOpenTheme,
  isWeChatMode,
  onToggleWeChatMode,
}) => {
  const navItems: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'home', label: '首页', icon: <Home className="w-4 h-4" /> },
    { key: 'diaries', label: '日常', icon: <BookOpen className="w-4 h-4" /> },
    { key: 'anniversaries', label: '纪念日', icon: <Calendar className="w-4 h-4" /> },
    { key: 'wishes', label: '心愿', icon: <Star className="w-4 h-4" /> },
    { key: 'memories', label: '回忆', icon: <ImageIcon className="w-4 h-4" /> },
    { key: 'checklist', label: '打卡', icon: <CheckCircle2 className="w-4 h-4" /> },
    { key: 'topics', label: '问答', icon: <MessageCircleHeart className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-inherit px-3 sm:px-6 py-2.5 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Brand & Couple Name */}
        <div
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none flex-shrink-0"
        >
          <div className="w-9 h-9 rounded-full bg-[#FCE7F3] border-2 border-inherit flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 text-[#E11D48] fill-[#E11D48] animate-pulse-heart" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm sm:text-base tracking-wide flex items-center gap-1">
              {profile.title || '甜蜜恋爱小窝'}
              <span className="text-xs text-amber-500">✨</span>
            </span>
            <span className="text-[11px] opacity-75 hidden sm:inline">
              记录相爱的每一件小事
            </span>
          </div>
        </div>

        {/* Center: Desktop Navigation Pills */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navItems.map((item) => {
            const isActive = currentTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onSelectTab(item.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all border-2 ${
                  isActive
                    ? 'bg-[var(--accent-orange)] text-white border-inherit shadow-sm scale-105'
                    : 'bg-white/90 border-inherit hover:bg-black/5'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Actions (Theme switch, WeChat Simulator toggle & Settings) */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Theme Palette Button */}
          <button
            onClick={onOpenTheme}
            title="个性化界面主题"
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full border-2 border-inherit bg-white hover:bg-black/5 font-bold shadow-2xs transition-colors"
          >
            <Palette className="w-3.5 h-3.5 text-[var(--accent-orange)]" />
            <span className="hidden sm:inline">主题</span>
          </button>

          {/* WeChat Simulator toggle */}
          <button
            onClick={onToggleWeChatMode}
            title={isWeChatMode ? '切换为网页宽屏视图' : '预览手机/小程序视图'}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full border-2 border-inherit bg-white hover:bg-black/5 font-medium shadow-2xs transition-colors"
          >
            {isWeChatMode ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-[var(--accent-orange)]" />
                <span className="hidden sm:inline">宽屏</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-[var(--accent-orange)]" />
                <span className="hidden sm:inline">小程序</span>
              </>
            )}
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            title="小窝设置"
            className="w-9 h-9 rounded-full bg-[#FEF3C7] border-2 border-inherit flex items-center justify-center hover:bg-[#FDE68A] transition-colors shadow-2xs text-[#4A3528]"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
