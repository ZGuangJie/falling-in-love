import React, { useState } from 'react';
import {
  Palette,
  Check,
  Sparkles,
  Type,
  LayoutGrid,
  Image as ImageIcon,
  RotateCcw,
  X,
} from 'lucide-react';
import { CoupleProfile, CoupleTheme } from '../types.ts';
import { PRESET_THEMES, FONT_OPTIONS, PATTERN_OPTIONS } from '../utils/themes.ts';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CoupleProfile;
  onSaveTheme: (themeConfig: {
    themeId: string;
    customPrimaryColor: string;
    customBgColor: string;
    customBorderColor: string;
    customFontFamily: string;
    customBgPattern: string;
    customBgImage?: string;
  }) => Promise<void>;
}

const COLOR_SWATCHES = [
  { label: '焦糖暖橙', color: '#E98C58' },
  { label: '樱落胭粉', color: '#E11D48' },
  { label: '星河紫罗兰', color: '#8B5CF6' },
  { label: '林间薄荷', color: '#059669' },
  { label: '静谧海蓝', color: '#0284C7' },
  { label: '蜜桃珊瑚', color: '#F97316' },
  { label: '摩卡暖褐', color: '#78350F' },
];

export const ThemeModal: React.FC<ThemeModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveTheme,
}) => {
  const [selectedThemeId, setSelectedThemeId] = useState<string>(
    profile.themeId || 'warm-cream'
  );
  const [primaryColor, setPrimaryColor] = useState<string>(
    profile.customPrimaryColor || '#E98C58'
  );
  const [bgColor, setBgColor] = useState<string>(
    profile.customBgColor || '#FFF9F2'
  );
  const [borderColor, setBorderColor] = useState<string>(
    profile.customBorderColor || '#4A3528'
  );
  const [fontFamily, setFontFamily] = useState<string>(
    profile.customFontFamily || 'system'
  );
  const [bgPattern, setBgPattern] = useState<string>(
    profile.customBgPattern || 'dots'
  );
  const [bgImage, setBgImage] = useState<string>(
    profile.customBgImage || ''
  );

  if (!isOpen) return null;

  const handleSelectPreset = (theme: CoupleTheme) => {
    setSelectedThemeId(theme.id);
    setPrimaryColor(theme.primaryColor);
    setBgColor(theme.bgColor);
    setBorderColor(theme.borderColor);
    setFontFamily(theme.fontFamily);
    setBgPattern(theme.pattern);
  };

  const handleResetToDefault = () => {
    const defaultTheme = PRESET_THEMES['warm-cream'];
    handleSelectPreset(defaultTheme);
    setBgImage('');
  };

  const handleApply = async () => {
    await onSaveTheme({
      themeId: selectedThemeId,
      customPrimaryColor: primaryColor,
      customBgColor: bgColor,
      customBorderColor: borderColor,
      customFontFamily: fontFamily,
      customBgPattern: bgPattern,
      customBgImage: bgImage,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4 overflow-y-auto backdrop-blur-xs">
      <div className="bg-[#FFFDF9] border-3 border-[#4A3528] rounded-3xl w-full max-w-2xl p-5 sm:p-7 shadow-2xl relative my-6 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FFF2E2] border border-[#4A3528] flex items-center justify-center hover:bg-[#FFE4CC]"
        >
          <X className="w-4 h-4 text-[#4A3528]" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-1">
          <Palette className="w-6 h-6 text-[#E98C58]" />
          <h3 className="text-xl font-black text-[#4A3528] font-serif">
            个性化界面主题系统
          </h3>
        </div>
        <p className="text-xs text-[#8C6D58] mb-5">
          自由切换多种情侣浪漫预设，或随心微调颜色、字体与质感底纹
        </p>

        <div className="space-y-6">
          {/* 1. 预设主题 (Preset Themes - At least 3 options, we provide 4) */}
          <div>
            <label className="block text-xs font-bold text-[#4A3528] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E98C58]" />
              <span>选择预设主题风格</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.values(PRESET_THEMES).map((theme) => {
                const isSelected = selectedThemeId === theme.id;
                return (
                  <div
                    key={theme.id}
                    onClick={() => handleSelectPreset(theme)}
                    className={`cursor-pointer rounded-2xl p-3.5 border-2 transition-all relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#4A3528] ring-3 ring-[#E98C58] shadow-md scale-[1.01]'
                        : 'border-[#4A3528]/30 hover:border-[#4A3528] bg-white'
                    }`}
                    style={{ backgroundColor: theme.bgColor }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/20"
                            style={{ backgroundColor: theme.primaryColor }}
                          />
                          <span
                            className="font-bold text-sm tracking-wide"
                            style={{ color: theme.textColor }}
                          >
                            {theme.name}
                          </span>
                        </div>
                        <p
                          className="text-[11px] mt-1 line-clamp-2 leading-relaxed"
                          style={{ color: theme.secondaryText }}
                        >
                          {theme.subtitle}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-[#10B981] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    {/* Color Swatch Preview Bar */}
                    <div className="mt-3 pt-2 border-t border-black/10 flex items-center gap-1.5">
                      <div
                        className="h-3 rounded-full flex-1"
                        style={{ backgroundColor: theme.primaryColor }}
                        title="主强调色"
                      />
                      <div
                        className="h-3 rounded-full flex-1"
                        style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.borderColor}` }}
                        title="卡片底色"
                      />
                      <div
                        className="h-3 rounded-full flex-1"
                        style={{ backgroundColor: theme.borderColor }}
                        title="边框轮廓"
                      />
                      <span className="text-[10px] text-gray-500 font-mono pl-1">
                        {theme.pattern}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. 自由调整颜色 (Color Customization) */}
          <div className="bg-[#FFF2E2]/50 rounded-2xl p-4 border border-[#4A3528]/20 space-y-3">
            <label className="block text-xs font-bold text-[#4A3528]">
              🎨 自定义配色
            </label>

            {/* Accent Color */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs text-[#8C6D58] font-medium">主强调色 (按钮/高亮天数)</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {COLOR_SWATCHES.map((swatch) => (
                    <button
                      key={swatch.color}
                      type="button"
                      onClick={() => {
                        setPrimaryColor(swatch.color);
                        setSelectedThemeId('custom');
                      }}
                      style={{ backgroundColor: swatch.color }}
                      className={`w-6 h-6 rounded-full border border-black/20 transition-transform ${
                        primaryColor === swatch.color ? 'scale-125 ring-2 ring-[#4A3528]' : ''
                      }`}
                      title={swatch.label}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => {
                    setPrimaryColor(e.target.value);
                    setSelectedThemeId('custom');
                  }}
                  className="w-7 h-7 rounded-lg cursor-pointer border border-[#4A3528]/30"
                />
              </div>
            </div>

            {/* Background Color & Border Color */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center justify-between bg-white rounded-xl p-2.5 border border-[#D1B6A1]">
                <span className="text-xs text-[#8C6D58]">页面背景底色</span>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => {
                    setBgColor(e.target.value);
                    setSelectedThemeId('custom');
                  }}
                  className="w-7 h-7 rounded cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between bg-white rounded-xl p-2.5 border border-[#D1B6A1]">
                <span className="text-xs text-[#8C6D58]">卡片描边轮廓色</span>
                <input
                  type="color"
                  value={borderColor}
                  onChange={(e) => {
                    setBorderColor(e.target.value);
                    setSelectedThemeId('custom');
                  }}
                  className="w-7 h-7 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* 3. 字体风格选择 (Font Family Options) */}
          <div>
            <label className="block text-xs font-bold text-[#4A3528] mb-2 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-[#E98C58]" />
              <span>文字排版字体风格</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {FONT_OPTIONS.map((f) => {
                const isActive = fontFamily === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setFontFamily(f.id);
                      setSelectedThemeId('custom');
                    }}
                    style={{ fontFamily: f.fontFamily }}
                    className={`p-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#E98C58] text-white border-[#4A3528] shadow-xs'
                        : 'bg-white text-[#4A3528] border-[#4A3528]/30 hover:border-[#4A3528]'
                    }`}
                  >
                    {f.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. 底纹与背景图 (Pattern & Background Image) */}
          <div>
            <label className="block text-xs font-bold text-[#4A3528] mb-2 flex items-center gap-1.5">
              <LayoutGrid className="w-3.5 h-3.5 text-[#E98C58]" />
              <span>背景点缀图案</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {PATTERN_OPTIONS.map((p) => {
                const isActive = bgPattern === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setBgPattern(p.id);
                      setSelectedThemeId('custom');
                    }}
                    className={`py-2 px-2 rounded-xl border-2 text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                      isActive
                        ? 'bg-[#E98C58] text-white border-[#4A3528] shadow-xs'
                        : 'bg-white text-[#4A3528] border-[#4A3528]/30 hover:border-[#4A3528]'
                    }`}
                  >
                    <span>{p.icon}</span>
                    <span>{p.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Background Image URL */}
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-1.5 bg-white border border-[#4A3528]/30 rounded-xl px-3 py-1.5">
                  <ImageIcon className="w-4 h-4 text-[#8C6D58]" />
                  <input
                    type="text"
                    placeholder="自定义背景图片 URL (选填)"
                    value={bgImage}
                    onChange={(e) => {
                      setBgImage(e.target.value);
                      setSelectedThemeId('custom');
                    }}
                    className="w-full text-xs text-[#4A3528] bg-transparent focus:outline-none"
                  />
                </div>
                {bgImage && (
                  <button
                    type="button"
                    onClick={() => setBgImage('')}
                    className="text-xs text-red-500 hover:underline px-2 py-1"
                  >
                    清除
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Real-time Preview Miniature Card */}
          <div className="rounded-2xl p-4 border-2 shadow-xs transition-colors"
               style={{
                 backgroundColor: bgColor,
                 borderColor: borderColor,
                 color: borderColor,
               }}>
            <div className="flex items-center justify-between text-xs font-bold pb-2 border-b border-black/10">
              <span className="flex items-center gap-1">
                <span>预览即时效果</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: primaryColor }}>
                  LIVE
                </span>
              </span>
              <span className="text-[11px] opacity-75">
                字体: {FONT_OPTIONS.find((f) => f.id === fontFamily)?.name} · 纹理: {PATTERN_OPTIONS.find((p) => p.id === bgPattern)?.name}
              </span>
            </div>
            <div className="pt-3 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm" style={{ color: borderColor }}>
                  {profile.title || '呆呆 & 圆圆 的恋爱小窝'}
                </h4>
                <p className="text-[11px] opacity-80 mt-0.5">
                  我们已相爱 <span className="font-black font-serif" style={{ color: primaryColor }}>359 天</span>
                </p>
              </div>
              <button
                type="button"
                className="px-3.5 py-1.5 rounded-full text-xs font-bold text-white shadow-xs border"
                style={{ backgroundColor: primaryColor, borderColor: borderColor }}
              >
                甜蜜按钮
              </button>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-6 pt-3 border-t border-[#4A3528]/15 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex items-center gap-1 text-xs text-[#8C6D58] hover:text-[#4A3528] px-2 py-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>恢复默认暖阳奶油</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-[#D1B6A1] text-xs font-semibold text-[#8C6D58]"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-6 py-2 rounded-full bg-[#E98C58] hover:bg-[#d87c48] text-white text-xs font-bold border-2 border-[#4A3528] shadow-sm hover:scale-105 transition-all"
            >
              应用并保存主题
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
