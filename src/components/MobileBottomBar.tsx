import React from 'react';
import {
  Home,
  BookOpen,
  Calendar,
  Star,
  Image as ImageIcon,
  CheckCircle2,
  MessageCircleHeart,
} from 'lucide-react';
import { TabKey } from '../types.ts';

interface MobileBottomBarProps {
  currentTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'home', label: '首页', icon: <Home className="w-4 h-4" /> },
    { key: 'diaries', label: '日常', icon: <BookOpen className="w-4 h-4" /> },
    { key: 'anniversaries', label: '纪念日', icon: <Calendar className="w-4 h-4" /> },
    { key: 'wishes', label: '心愿', icon: <Star className="w-4 h-4" /> },
    { key: 'memories', label: '回忆', icon: <ImageIcon className="w-4 h-4" /> },
    { key: 'checklist', label: '打卡', icon: <CheckCircle2 className="w-4 h-4" /> },
    { key: 'topics', label: '问答', icon: <MessageCircleHeart className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-inherit px-1 py-1.5 lg:hidden shadow-[0_-2px_10px_rgba(74,53,40,0.05)] safe-area-bottom">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onSelectTab(tab.key)}
              className={`flex flex-col items-center justify-center py-0.5 px-1 rounded-xl transition-all ${
                isActive
                  ? 'text-[var(--accent-orange)] scale-105 font-bold'
                  : 'text-inherit opacity-75 hover:opacity-100'
              }`}
            >
              <div
                className={`p-1 rounded-full ${
                  isActive ? 'bg-[#FFE8D6]' : 'bg-transparent'
                }`}
              >
                {tab.icon}
              </div>
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
