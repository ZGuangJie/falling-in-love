import React from 'react';
import {
  MoreHorizontal,
  CircleDot,
  Signal,
  Wifi,
  Battery,
  Home,
  BookOpen,
  Calendar,
  Star,
  Image as ImageIcon,
  CheckCircle2,
  MessageCircleHeart,
} from 'lucide-react';
import { TabKey, CoupleProfile } from '../types.ts';

interface WeChatSimulatorProps {
  children: React.ReactNode;
  profile: CoupleProfile;
  currentTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  onExit: () => void;
}

export const WeChatSimulator: React.FC<WeChatSimulatorProps> = ({
  children,
  profile,
  currentTab,
  onSelectTab,
  onExit,
}) => {
  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'home', label: '首页', icon: <Home className="w-4 h-4" /> },
    { key: 'diaries', label: '日常', icon: <BookOpen className="w-4 h-4" /> },
    { key: 'anniversaries', label: '纪念日', icon: <Calendar className="w-4 h-4" /> },
    { key: 'wishes', label: '心愿', icon: <Star className="w-4 h-4" /> },
    { key: 'checklist', label: '打卡', icon: <CheckCircle2 className="w-4 h-4" /> },
    { key: 'topics', label: '问答', icon: <MessageCircleHeart className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-6 px-2 min-h-screen bg-[#EFE8DD]/70">
      {/* Top Banner Notice */}
      <div className="mb-4 flex items-center justify-between gap-3 w-full max-w-[430px] bg-white border border-[#4A3528]/30 px-3.5 py-1.5 rounded-full text-xs text-[#8C6D58] shadow-xs">
        <span className="flex items-center gap-1 font-medium">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          微信小程序预览模式 (400×850)
        </span>
        <button
          onClick={onExit}
          className="text-[#E98C58] font-bold hover:underline"
        >
          切回宽屏
        </button>
      </div>

      {/* Phone Shell */}
      <div className="w-full max-w-[410px] h-[840px] bg-[var(--bg-cream)] rounded-[48px] border-[10px] border-[#2C241E] shadow-[0_25px_60px_rgba(44,36,30,0.25)] flex flex-col overflow-hidden relative">
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-[#2C241E] rounded-b-xl z-50 flex items-center justify-center">
          <div className="w-8 h-1 bg-gray-800 rounded-full" />
        </div>

        {/* Status Bar */}
        <div className="pt-3 px-6 pb-1 flex items-center justify-between text-[11px] font-bold text-inherit z-30 bg-inherit/90">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* WeChat Mini-Program Header with Capsule Button */}
        <div className="px-4 py-2 flex items-center justify-between border-b border-inherit/20 bg-inherit z-30">
          <span className="font-bold text-xs truncate max-w-[190px]">
            {profile.title || '恋爱小窝'}
          </span>

          {/* Mini-program capsule button */}
          <div className="flex items-center bg-white/90 border border-inherit/30 rounded-full px-2 py-1 shadow-2xs gap-2">
            <MoreHorizontal className="w-3.5 h-3.5 text-inherit" />
            <div className="w-[1px] h-3 bg-gray-300" />
            <CircleDot className="w-3.5 h-3.5 text-inherit" />
          </div>
        </div>

        {/* Phone Content Scroll Area */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4">
          {children}
        </div>

        {/* Mini-Program Bottom Tab Bar */}
        <div className="bg-white border-t-2 border-inherit/20 px-2 py-2 flex items-center justify-around z-30">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => onSelectTab(tab.key)}
                className={`flex flex-col items-center justify-center px-1 transition-all ${
                  isActive ? 'text-[var(--accent-orange)] font-bold scale-105' : 'text-inherit opacity-75'
                }`}
              >
                <div className={`p-1 rounded-full ${isActive ? 'bg-[#FFE8D6]' : ''}`}>
                  {tab.icon}
                </div>
                <span className="text-[10px]">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Home Indicator bar */}
        <div className="pb-1 pt-0.5 flex justify-center bg-white">
          <div className="w-28 h-1 bg-black/20 rounded-full" />
        </div>
      </div>
    </div>
  );
};
