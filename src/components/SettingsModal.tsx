import React, { useState } from 'react';
import { X, Heart, Settings, Upload, Sparkles, BookHeart, FileText } from 'lucide-react';
import { CoupleProfile } from '../types.ts';
import { PRESET_AVATARS } from '../utils/helpers.ts';

interface SettingsModalProps {
  profile: CoupleProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Partial<CoupleProfile>) => Promise<void>;
  onOpenAnnualMemory: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSave,
  onOpenAnnualMemory,
}) => {
  const [formData, setFormData] = useState({
    title: profile.title,
    togetherDate: profile.togetherDate,
    userAName: profile.userAName,
    userAAvatar: profile.userAAvatar,
    userBName: profile.userBName,
    userBAvatar: profile.userBAvatar,
    quote1: profile.quote1,
    quote2: profile.quote2,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs">
      <div className="bg-[#FFFDF9] border-3 border-[#4A3528] rounded-3xl w-full max-w-lg p-6 shadow-2xl relative my-8 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FFF2E2] border border-[#4A3528] flex items-center justify-center hover:bg-[#FFE4CC]"
        >
          <X className="w-4 h-4 text-[#4A3528]" />
        </button>

        <h3 className="text-xl font-black text-[#4A3528] font-serif mb-1 flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#E98C58]" />
          <span>小窝设置与情侣档案</span>
        </h3>
        <p className="text-xs text-[#8C6D58] mb-4">自定义你们的昵称、专属头像和相恋纪念起始日</p>

        {/* 🌟 Export Annual Memory Banner (导出年度回忆) */}
        <div className="mb-5 bg-gradient-to-r from-[#FFF0E6] via-[#FFF5ED] to-[#FCE7F3] border-2 border-[#4A3528] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E98C58] text-white flex items-center justify-center border-2 border-[#4A3528] flex-shrink-0 shadow-2xs">
              <Sparkles className="w-5 h-5 text-yellow-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-[#4A3528]">导出年度回忆手账</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-[#FEF3C7] text-[#D97706] rounded-full border border-[#4A3528]/20">
                  NEW
                </span>
              </div>
              <p className="text-[11px] text-[#8C6D58] mt-0.5 leading-relaxed">
                汇总纪念日、日常日记与心愿，生成精美摘要卡片，支持长图/PDF打印与朋友圈文案
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenAnnualMemory();
            }}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#E98C58] hover:bg-[#d87c48] text-white text-xs font-bold rounded-full border-2 border-[#4A3528] shadow-xs hover:scale-105 transition-all flex-shrink-0"
          >
            <BookHeart className="w-3.5 h-3.5" />
            <span>生成回忆</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Couple Nest Title */}
          <div>
            <label className="block text-xs font-bold text-[#4A3528] mb-1">小窝名称</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border-2 border-[#4A3528] bg-white text-sm focus:outline-none"
            />
          </div>

          {/* Together Date */}
          <div>
            <label className="block text-xs font-bold text-[#4A3528] mb-1">相恋纪念日 (在一起的日期)</label>
            <input
              type="date"
              required
              value={formData.togetherDate}
              onChange={(e) => setFormData({ ...formData, togetherDate: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border-2 border-[#4A3528] bg-white text-xs focus:outline-none"
            />
            <span className="text-[11px] text-[#8C6D58] mt-0.5 block">
              更改后，首页相恋天数与倒数日将自动重新计算
            </span>
          </div>

          {/* Partner A */}
          <div className="bg-[#FFF2E2]/60 rounded-2xl p-3 border border-[#4A3528]/20 space-y-2">
            <span className="text-xs font-bold text-[#4A3528] flex items-center gap-1">
              <span>👦 伴侣 A 昵称与头像</span>
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="例如：呆呆"
                value={formData.userAName}
                onChange={(e) => setFormData({ ...formData, userAName: e.target.value })}
                className="flex-1 px-3 py-1.5 rounded-xl border border-[#4A3528] bg-white text-xs"
              />
            </div>
            {/* Avatar choices */}
            <div className="flex flex-wrap gap-2 pt-1">
              {Object.entries(PRESET_AVATARS).map(([key, item]) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => setFormData({ ...formData, userAAvatar: key })}
                  style={{ backgroundColor: item.bg }}
                  className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-lg ${
                    formData.userAAvatar === key ? 'border-[#4A3528] scale-110 shadow-sm' : 'border-transparent'
                  }`}
                  title={item.label}
                >
                  {item.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Partner B */}
          <div className="bg-[#FCE7F3]/60 rounded-2xl p-3 border border-[#4A3528]/20 space-y-2">
            <span className="text-xs font-bold text-[#4A3528] flex items-center gap-1">
              <span>👧 伴侣 B 昵称与头像</span>
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="例如：圆圆"
                value={formData.userBName}
                onChange={(e) => setFormData({ ...formData, userBName: e.target.value })}
                className="flex-1 px-3 py-1.5 rounded-xl border border-[#4A3528] bg-white text-xs"
              />
            </div>
            {/* Avatar choices */}
            <div className="flex flex-wrap gap-2 pt-1">
              {Object.entries(PRESET_AVATARS).map(([key, item]) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => setFormData({ ...formData, userBAvatar: key })}
                  style={{ backgroundColor: item.bg }}
                  className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-lg ${
                    formData.userBAvatar === key ? 'border-[#4A3528] scale-110 shadow-sm' : 'border-transparent'
                  }`}
                  title={item.label}
                >
                  {item.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Quotes */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#4A3528]">首页浪漫寄语</label>
            <input
              type="text"
              value={formData.quote1}
              onChange={(e) => setFormData({ ...formData, quote1: e.target.value })}
              className="w-full px-3 py-1.5 rounded-xl border border-[#4A3528] bg-white text-xs mb-1"
              placeholder="寄语 1"
            />
            <input
              type="text"
              value={formData.quote2}
              onChange={(e) => setFormData({ ...formData, quote2: e.target.value })}
              className="w-full px-3 py-1.5 rounded-xl border border-[#4A3528] bg-white text-xs"
              placeholder="寄语 2"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-[#D1B6A1] text-xs font-semibold text-[#8C6D58]"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-[#E98C58] hover:bg-[#d87c48] text-white text-xs font-bold border-2 border-[#4A3528] shadow-sm hover:scale-105 transition-all"
            >
              保存修改
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
