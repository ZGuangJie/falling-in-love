/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  CoupleProfile,
  CoupleTopic,
  Diary,
  Anniversary,
  Wish,
  ChecklistItem,
  Memory,
  TabKey,
} from './types.ts';
import { Navbar } from './components/Navbar.tsx';
import { MobileBottomBar } from './components/MobileBottomBar.tsx';
import { HomeView } from './components/HomeView.tsx';
import { DiariesView } from './components/DiariesView.tsx';
import { AnniversariesView } from './components/AnniversariesView.tsx';
import { WishesView } from './components/WishesView.tsx';
import { ChecklistView } from './components/ChecklistView.tsx';
import { MemoriesView } from './components/MemoriesView.tsx';
import { TopicsView } from './components/TopicsView.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { ThemeModal } from './components/ThemeModal.tsx';
import { AnnualMemoryModal } from './components/AnnualMemoryModal.tsx';
import { WeChatSimulator } from './components/WeChatSimulator.tsx';
import { default100Items } from './db/seedData.ts';
import { initialCoupleTopics } from './db/topicsData.ts';
import {
  PRESET_THEMES,
  FONT_OPTIONS,
  getBackgroundPatternStyle,
} from './utils/themes.ts';

const FALLBACK_PROFILE: CoupleProfile = {
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
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabKey>('home');
  const [profile, setProfile] = useState<CoupleProfile>(FALLBACK_PROFILE);
  const [topics, setTopics] = useState<CoupleTopic[]>([]);
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [anniversaries, setAnniversaries] = useState<Anniversary[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [checklists, setChecklists] = useState<ChecklistItem[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);

  const [loading, setLoading] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [annualMemoryOpen, setAnnualMemoryOpen] = useState(false);
  const [isWeChatMode, setIsWeChatMode] = useState(false);
  const [openNewDiaryDirectly, setOpenNewDiaryDirectly] = useState(false);

  // Fetch all data from PostgreSQL backend
  const fetchData = useCallback(async () => {
    try {
      const [profRes, topRes, diaRes, annRes, wishRes, chkRes, memRes] =
        await Promise.all([
          fetch('/api/profile').then((r) => r.json()).catch(() => FALLBACK_PROFILE),
          fetch('/api/topics').then((r) => r.json()).catch(() => []),
          fetch('/api/diaries').then((r) => r.json()).catch(() => []),
          fetch('/api/anniversaries').then((r) => r.json()).catch(() => []),
          fetch('/api/wishes').then((r) => r.json()).catch(() => []),
          fetch('/api/checklists').then((r) => r.json()).catch(() => []),
          fetch('/api/memories').then((r) => r.json()).catch(() => []),
        ]);

      if (profRes && !profRes.error) {
        setProfile(profRes);
      }
      if (Array.isArray(topRes) && topRes.length > 0) {
        setTopics(topRes);
      } else {
        setTopics(
          initialCoupleTopics.map((t, idx) => ({
            id: idx + 1,
            ...t,
          }))
        );
      }
      if (Array.isArray(diaRes)) setDiaries(diaRes);
      if (Array.isArray(annRes)) setAnniversaries(annRes);
      if (Array.isArray(wishRes)) setWishes(wishRes);
      if (Array.isArray(chkRes) && chkRes.length > 0) {
        setChecklists(chkRes);
      } else {
        setChecklists(
          default100Items.map((item, idx) => ({
            id: idx + 1,
            itemIndex: item.itemIndex,
            title: item.title,
            category: item.category,
            isCompleted: item.isCompleted,
            completedDate: item.completedDate,
            note: item.note,
          }))
        );
      }
      if (Array.isArray(memRes)) setMemories(memRes);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Dynamic Theme Computation
  const activeTheme = useMemo(() => {
    const preset = PRESET_THEMES[profile.themeId] || PRESET_THEMES['warm-cream'];
    return {
      primaryColor: profile.customPrimaryColor || preset.primaryColor,
      bgColor: profile.customBgColor || preset.bgColor,
      borderColor: profile.customBorderColor || preset.borderColor,
      fontFamily: profile.customFontFamily || preset.fontFamily,
      pattern: profile.customBgPattern || preset.pattern,
      bgImage: profile.customBgImage || '',
    };
  }, [profile]);

  // Selected Font style
  const fontStyle = useMemo(() => {
    const f = FONT_OPTIONS.find((opt) => opt.id === activeTheme.fontFamily);
    return f ? f.fontFamily : 'system-ui, sans-serif';
  }, [activeTheme.fontFamily]);

  // Background Pattern style
  const isDarkTheme = activeTheme.bgColor.toLowerCase() === '#161522' || activeTheme.bgColor.startsWith('#1');
  const patternStyle = useMemo(() => {
    return getBackgroundPatternStyle(activeTheme.pattern, isDarkTheme);
  }, [activeTheme.pattern, isDarkTheme]);

  // Handlers for Profile & Theme
  const handleUpdateProfile = async (updated: Partial<CoupleProfile>) => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data && !data.error) {
        setProfile(data);
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      setProfile((prev) => ({ ...prev, ...updated }));
    }
  };

  const handleSaveTheme = async (themeConfig: {
    themeId: string;
    customPrimaryColor: string;
    customBgColor: string;
    customBorderColor: string;
    customFontFamily: string;
    customBgPattern: string;
    customBgImage?: string;
  }) => {
    await handleUpdateProfile(themeConfig);
  };

  // Handlers for Topics
  const handleUpdateTopic = async (id: number, updated: Partial<CoupleTopic>) => {
    try {
      const res = await fetch(`/api/topics/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data && !data.error) {
        setTopics((prev) => prev.map((t) => (t.id === id ? data : t)));
      } else {
        setTopics((prev) =>
          prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
        );
      }
    } catch (err) {
      console.error('Failed to update topic:', err);
      setTopics((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
      );
    }
  };

  const handleAddTopic = async (topic: { question: string; category: CoupleTopic['category'] }) => {
    try {
      const res = await fetch('/api/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(topic),
      });
      const data = await res.json();
      if (data && !data.error) {
        setTopics((prev) => [data, ...prev]);
      }
    } catch (err) {
      console.error('Failed to add topic:', err);
    }
  };

  // Handlers for Diaries
  const handleAddDiary = async (newDiary: Omit<Diary, 'id'>) => {
    try {
      const res = await fetch('/api/diaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDiary),
      });
      const data = await res.json();
      if (data && !data.error) {
        setDiaries((prev) => [data, ...prev]);
      }
    } catch (err) {
      console.error('Failed to add diary:', err);
    }
  };

  const handleUpdateDiary = async (id: number, updated: Partial<Diary>) => {
    try {
      const res = await fetch(`/api/diaries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data && !data.error) {
        setDiaries((prev) => prev.map((d) => (d.id === id ? data : d)));
      }
    } catch (err) {
      console.error('Failed to update diary:', err);
    }
  };

  const handleDeleteDiary = async (id: number) => {
    try {
      await fetch(`/api/diaries/${id}`, { method: 'DELETE' });
      setDiaries((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error('Failed to delete diary:', err);
    }
  };

  // Handlers for Anniversaries
  const handleAddAnniversary = async (newAnn: Omit<Anniversary, 'id'>) => {
    try {
      const res = await fetch('/api/anniversaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnn),
      });
      const data = await res.json();
      if (data && !data.error) {
        setAnniversaries((prev) => [...prev, data]);
      }
    } catch (err) {
      console.error('Failed to add anniversary:', err);
    }
  };

  const handleUpdateAnniversary = async (id: number, updated: Partial<Anniversary>) => {
    try {
      const res = await fetch(`/api/anniversaries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data && !data.error) {
        setAnniversaries((prev) => prev.map((a) => (a.id === id ? data : a)));
      }
    } catch (err) {
      console.error('Failed to update anniversary:', err);
    }
  };

  const handleDeleteAnniversary = async (id: number) => {
    try {
      await fetch(`/api/anniversaries/${id}`, { method: 'DELETE' });
      setAnniversaries((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error('Failed to delete anniversary:', err);
    }
  };

  // Handlers for Wishes
  const handleAddWish = async (newWish: Omit<Wish, 'id'>) => {
    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWish),
      });
      const data = await res.json();
      if (data && !data.error) {
        setWishes((prev) => [data, ...prev]);
      }
    } catch (err) {
      console.error('Failed to add wish:', err);
    }
  };

  const handleUpdateWish = async (id: number, updated: Partial<Wish>) => {
    try {
      const res = await fetch(`/api/wishes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data && !data.error) {
        setWishes((prev) => prev.map((w) => (w.id === id ? data : w)));
      }
    } catch (err) {
      console.error('Failed to update wish:', err);
    }
  };

  const handleDeleteWish = async (id: number) => {
    try {
      await fetch(`/api/wishes/${id}`, { method: 'DELETE' });
      setWishes((prev) => prev.filter((w) => w.id !== id));
    } catch (err) {
      console.error('Failed to delete wish:', err);
    }
  };

  // Handlers for Checklists
  const handleUpdateChecklist = async (id: number, updated: Partial<ChecklistItem>) => {
    try {
      const res = await fetch(`/api/checklists/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data && !data.error) {
        setChecklists((prev) => prev.map((c) => (c.id === id ? data : c)));
      } else {
        setChecklists((prev) =>
          prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
        );
      }
    } catch (err) {
      console.error('Failed to update checklist:', err);
      setChecklists((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
      );
    }
  };

  // Handlers for Memories
  const handleAddMemory = async (newMem: Omit<Memory, 'id'>) => {
    try {
      const res = await fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMem),
      });
      const data = await res.json();
      if (data && !data.error) {
        setMemories((prev) => [data, ...prev]);
      }
    } catch (err) {
      console.error('Failed to add memory:', err);
    }
  };

  const handleDeleteMemory = async (id: number) => {
    try {
      await fetch(`/api/memories/${id}`, { method: 'DELETE' });
      setMemories((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error('Failed to delete memory:', err);
    }
  };

  const handleGoToNewDiary = () => {
    setCurrentTab('diaries');
    setOpenNewDiaryDirectly(true);
  };

  // Render view by tab
  const renderTabContent = () => {
    switch (currentTab) {
      case 'home':
        return (
          <HomeView
            profile={profile}
            anniversaries={anniversaries}
            todaysTopic={topics[0]}
            onSelectTab={setCurrentTab}
            onOpenSettings={() => setSettingsOpen(true)}
            onOpenNewDiary={handleGoToNewDiary}
            onOpenTheme={() => setThemeOpen(true)}
          />
        );
      case 'topics':
        return (
          <TopicsView
            topics={topics}
            profile={profile}
            onUpdateTopic={handleUpdateTopic}
            onAddTopic={handleAddTopic}
          />
        );
      case 'diaries':
        return (
          <DiariesView
            diaries={diaries}
            profile={profile}
            onAddDiary={handleAddDiary}
            onUpdateDiary={handleUpdateDiary}
            onDeleteDiary={handleDeleteDiary}
            isAddingNew={openNewDiaryDirectly}
            onCloseAddModal={() => setOpenNewDiaryDirectly(false)}
          />
        );
      case 'anniversaries':
        return (
          <AnniversariesView
            anniversaries={anniversaries}
            profile={profile}
            onAddAnniversary={handleAddAnniversary}
            onUpdateAnniversary={handleUpdateAnniversary}
            onDeleteAnniversary={handleDeleteAnniversary}
          />
        );
      case 'wishes':
        return (
          <WishesView
            wishes={wishes}
            onAddWish={handleAddWish}
            onUpdateWish={handleUpdateWish}
            onDeleteWish={handleDeleteWish}
          />
        );
      case 'checklist':
        return (
          <ChecklistView
            checklists={checklists}
            onUpdateChecklist={handleUpdateChecklist}
          />
        );
      case 'memories':
        return (
          <MemoriesView
            memories={memories}
            onAddMemory={handleAddMemory}
            onDeleteMemory={handleDeleteMemory}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9F2] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-full bg-[#FCE7F3] border-3 border-[#4A3528] flex items-center justify-center text-2xl shadow-sm animate-pulse-heart">
          💖
        </div>
        <p className="mt-4 font-bold text-sm text-[#4A3528] tracking-widest font-serif">
          正在载入甜蜜恋爱记录小窝...
        </p>
      </div>
    );
  }

  // Combined root style for theme & font
  const containerStyle: React.CSSProperties = {
    backgroundColor: activeTheme.bgColor,
    borderColor: activeTheme.borderColor,
    color: activeTheme.borderColor,
    fontFamily: fontStyle,
    ...patternStyle,
    ...(activeTheme.bgImage
      ? {
          backgroundImage: `url(${activeTheme.bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }
      : {}),
    // Inject CSS variable for primary accents
    ['--accent-orange' as any]: activeTheme.primaryColor,
    ['--bg-cream' as any]: activeTheme.bgColor,
  };

  // If WeChat Mini-Program Simulator mode is enabled
  if (isWeChatMode) {
    return (
      <div style={{ fontFamily: fontStyle }}>
        <WeChatSimulator
          profile={profile}
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onExit={() => setIsWeChatMode(false)}
        >
          {renderTabContent()}
        </WeChatSimulator>

        <SettingsModal
          profile={profile}
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          onSave={handleUpdateProfile}
          onOpenAnnualMemory={() => setAnnualMemoryOpen(true)}
        />

        <ThemeModal
          isOpen={themeOpen}
          onClose={() => setThemeOpen(false)}
          profile={profile}
          onSaveTheme={handleSaveTheme}
        />

        <AnnualMemoryModal
          isOpen={annualMemoryOpen}
          onClose={() => setAnnualMemoryOpen(false)}
          profile={profile}
          diaries={diaries}
          anniversaries={anniversaries}
          wishes={wishes}
          checklists={checklists}
        />
      </div>
    );
  }

  // Standard Responsive Web View
  return (
    <div
      style={containerStyle}
      className="min-h-screen flex flex-col transition-colors duration-300"
    >
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        profile={profile}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenTheme={() => setThemeOpen(true)}
        isWeChatMode={isWeChatMode}
        onToggleWeChatMode={() => setIsWeChatMode(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-5 pb-20 md:pb-12">
        {renderTabContent()}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomBar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Settings Modal */}
      <SettingsModal
        profile={profile}
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSave={handleUpdateProfile}
        onOpenAnnualMemory={() => setAnnualMemoryOpen(true)}
      />

      {/* Theme Customization Modal */}
      <ThemeModal
        isOpen={themeOpen}
        onClose={() => setThemeOpen(false)}
        profile={profile}
        onSaveTheme={handleSaveTheme}
      />

      {/* Annual Memory Modal */}
      <AnnualMemoryModal
        isOpen={annualMemoryOpen}
        onClose={() => setAnnualMemoryOpen(false)}
        profile={profile}
        diaries={diaries}
        anniversaries={anniversaries}
        wishes={wishes}
        checklists={checklists}
      />
    </div>
  );
}
