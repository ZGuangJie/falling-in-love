import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Plus,
  MapPin,
  Trash2,
  Edit2,
  Calendar,
  X,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { Diary, CoupleProfile } from '../types.ts';
import {
  calculateDaysTogether,
  MOOD_MAP,
  WEATHER_MAP,
} from '../utils/helpers.ts';

interface DiariesViewProps {
  diaries: Diary[];
  profile: CoupleProfile;
  onAddDiary: (diary: Omit<Diary, 'id'>) => Promise<void>;
  onUpdateDiary: (id: number, diary: Partial<Diary>) => Promise<void>;
  onDeleteDiary: (id: number) => Promise<void>;
  isAddingNew?: boolean;
  onCloseAddModal?: () => void;
}

export const DiariesView: React.FC<DiariesViewProps> = ({
  diaries,
  profile,
  onAddDiary,
  onUpdateDiary,
  onDeleteDiary,
  isAddingNew = false,
  onCloseAddModal,
}) => {
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(isAddingNew);
  const [editingDiary, setEditingDiary] = useState<Diary | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    mood: 'happy' as Diary['mood'],
    weather: 'sunny' as Diary['weather'],
    author: profile.userAName || '呆呆',
    photos: [] as string[],
    newPhotoUrl: '',
  });

  React.useEffect(() => {
    if (isAddingNew) {
      setEditingDiary(null);
      setFormData({
        title: '',
        content: '',
        date: new Date().toISOString().split('T')[0],
        location: '',
        mood: 'happy',
        weather: 'sunny',
        author: profile.userAName || '呆呆',
        photos: [],
        newPhotoUrl: '',
      });
      setModalOpen(true);
    }
  }, [isAddingNew, profile.userAName]);

  // Total days together
  const daysTogether = calculateDaysTogether(profile.togetherDate);

  // Calculate monthly stats
  const currentMonthStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }, []);

  const monthCount = useMemo(() => {
    return diaries.filter((d) => d.date.startsWith(currentMonthStr)).length;
  }, [diaries, currentMonthStr]);

  // Extract available years & months for filtering
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    diaries.forEach((d) => {
      const y = d.date.split('-')[0];
      if (y) years.add(y);
    });
    return Array.from(years).sort().reverse();
  }, [diaries]);

  const filteredDiaries = useMemo(() => {
    return diaries.filter((d) => {
      const parts = d.date.split('-');
      const y = parts[0];
      const m = parts[1];
      if (selectedYear !== 'all' && y !== selectedYear) return false;
      if (selectedMonth !== 'all' && m !== selectedMonth) return false;
      return true;
    });
  }, [diaries, selectedYear, selectedMonth]);

  const handleOpenAdd = () => {
    setEditingDiary(null);
    setFormData({
      title: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      location: '',
      mood: 'sweet',
      weather: 'sunny',
      author: profile.userAName || '呆呆',
      photos: [],
      newPhotoUrl: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (diary: Diary) => {
    setEditingDiary(diary);
    let parsedPhotos: string[] = [];
    try {
      parsedPhotos = JSON.parse(diary.photos);
    } catch {
      parsedPhotos = diary.photos ? [diary.photos] : [];
    }
    setFormData({
      title: diary.title,
      content: diary.content,
      date: diary.date,
      location: diary.location || '',
      mood: diary.mood,
      weather: diary.weather,
      author: diary.author || profile.userAName,
      photos: parsedPhotos,
      newPhotoUrl: '',
    });
    setModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData((prev) => ({
            ...prev,
            photos: [...prev.photos, reader.result as string],
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhotoUrl = () => {
    if (formData.newPhotoUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, prev.newPhotoUrl.trim()],
        newPhotoUrl: '',
      }));
    }
  };

  const handleRemovePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    if (editingDiary) {
      await onUpdateDiary(editingDiary.id, {
        title: formData.title,
        content: formData.content,
        date: formData.date,
        location: formData.location,
        mood: formData.mood,
        weather: formData.weather,
        photos: JSON.stringify(formData.photos),
        author: formData.author,
      });
    } else {
      await onAddDiary({
        title: formData.title,
        content: formData.content,
        date: formData.date,
        location: formData.location,
        mood: formData.mood,
        weather: formData.weather,
        photos: JSON.stringify(formData.photos),
        author: formData.author,
      });
    }

    setModalOpen(false);
    if (onCloseAddModal) onCloseAddModal();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#4A3528] flex items-center gap-2 font-serif">
            <span className="w-8 h-8 rounded-full bg-[#E0F2FE] border-2 border-[#4A3528] flex items-center justify-center text-sm">
              📷
            </span>
            <span>日常记录</span>
          </h2>
          <p className="text-xs text-[#8C6D58] mt-0.5">记录我们的甜蜜日常，写下平凡日子的浪漫</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#E98C58] hover:bg-[#d87c48] text-white font-bold text-sm rounded-full border-2 border-[#4A3528] shadow-sm hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ 添加记录</span>
        </button>
      </div>

      {/* 3 Stats Cards matching screenshot */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {/* 本月记录 */}
        <div className="bg-[#D8ECF8] border-2 border-[#4A3528] rounded-2xl p-3 sm:p-4 text-center shadow-xs">
          <div className="text-2xl sm:text-3xl font-black text-[#4A3528] font-serif">{monthCount}</div>
          <div className="text-[11px] sm:text-xs font-semibold text-[#4A3528]/80 mt-1">本月记录</div>
        </div>

        {/* 总记录数 */}
        <div className="bg-[#F5DCE5] border-2 border-[#4A3528] rounded-2xl p-3 sm:p-4 text-center shadow-xs">
          <div className="text-2xl sm:text-3xl font-black text-[#4A3528] font-serif">{diaries.length}</div>
          <div className="text-[11px] sm:text-xs font-semibold text-[#4A3528]/80 mt-1">总记录数</div>
        </div>

        {/* 相恋天数 */}
        <div className="bg-[#FEF3C7] border-2 border-[#4A3528] rounded-2xl p-3 sm:p-4 text-center shadow-xs">
          <div className="text-2xl sm:text-3xl font-black text-[#E98C58] font-serif">{daysTogether}</div>
          <div className="text-[11px] sm:text-xs font-semibold text-[#4A3528]/80 mt-1">相恋天数</div>
        </div>
      </div>

      {/* Filters: 年份 & 月份 */}
      <div className="flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 bg-white border border-[#D1B6A1] rounded-full px-3 py-1.5">
          <span className="text-[#8C6D58] font-medium">年份</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-transparent text-[#4A3528] font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all">全部年份</option>
            {availableYears.map((yr) => (
              <option key={yr} value={yr}>
                {yr}年
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5 bg-white border border-[#D1B6A1] rounded-full px-3 py-1.5">
          <span className="text-[#8C6D58] font-medium">月份</span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-transparent text-[#4A3528] font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all">全部月份</option>
            {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map((m) => (
              <option key={m} value={m}>
                {m}月
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline List matching screenshot */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-[#D1B6A1]">
        {filteredDiaries.length === 0 ? (
          <div className="bg-[#FFFDF9] border-2 border-dashed border-[#D1B6A1] rounded-2xl p-8 text-center text-[#8C6D58] space-y-2">
            <BookOpen className="w-8 h-8 mx-auto text-[#D1B6A1]" />
            <p className="text-sm font-medium">暂时还没有找到符合筛选的日常记录哦</p>
            <button
              onClick={handleOpenAdd}
              className="text-xs text-[#E98C58] font-bold underline cursor-pointer"
            >
              点击写下第一篇日记
            </button>
          </div>
        ) : (
          filteredDiaries.map((diary) => {
            const dateParts = diary.date.split('-');
            const yearMonth = `${dateParts[0]}年${dateParts[1]}月`;
            const dayNum = dateParts[2];
            const moodInfo = MOOD_MAP[diary.mood] || MOOD_MAP.happy;
            const weatherInfo = WEATHER_MAP[diary.weather] || WEATHER_MAP.sunny;

            // Calculate days together on this specific diary date
            const diaryDays = profile.togetherDate ? calculateDaysTogether(profile.togetherDate) : 0;

            let photoList: string[] = [];
            try {
              photoList = JSON.parse(diary.photos);
            } catch {
              photoList = diary.photos ? [diary.photos] : [];
            }

            return (
              <div key={diary.id} className="relative group">
                {/* Timeline Node Circle */}
                <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-[#E98C58] border-2 border-[#4A3528] text-white flex items-center justify-center shadow-xs">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>

                {/* Date header info */}
                <div className="flex items-center justify-between text-xs text-[#8C6D58] mb-1.5 pl-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-[#4A3528] font-serif">{dayNum}</span>
                    <span>{yearMonth}</span>
                  </div>
                  <span className="text-[11px] font-medium text-[#E98C58]">
                    相恋第 {diaryDays} 天 🎵
                  </span>
                </div>

                {/* Diary Card */}
                <div className="bg-[#FFFDF9] border-2 border-[#4A3528] rounded-2xl p-4 sm:p-5 shadow-xs transition-all hover:shadow-md">
                  {/* Card Header: Title + Mood / Weather + Actions */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div>
                      <h3 className="font-bold text-base sm:text-lg text-[#4A3528] tracking-wide">
                        {diary.title}
                      </h3>
                      {diary.location && (
                        <div className="flex items-center gap-1 text-[11px] text-[#8C6D58] mt-0.5">
                          <MapPin className="w-3 h-3 text-[#E98C58]" />
                          <span>{diary.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Mood & Weather Badges */}
                      <div
                        style={{ backgroundColor: moodInfo.bg }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#4A3528]/30 text-xs font-semibold"
                      >
                        <span>{moodInfo.emoji}</span>
                        <span className="text-[#4A3528]">{moodInfo.label}</span>
                      </div>

                      <div className="px-2 py-1 bg-[#FFF2E2] rounded-full border border-[#4A3528]/30 text-xs font-semibold" title={weatherInfo.label}>
                        <span>{weatherInfo.icon}</span>
                      </div>

                      {/* Edit / Delete */}
                      <button
                        onClick={() => handleOpenEdit(diary)}
                        className="p-1 text-[#8C6D58] hover:text-[#4A3528] hover:bg-[#FFF2E2] rounded-md transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteDiary(diary.id)}
                        className="p-1 text-[#8C6D58] hover:text-[#E11D48] hover:bg-[#FFE4E6] rounded-md transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-xs sm:text-sm text-[#4A3528] leading-relaxed whitespace-pre-line py-1 font-sans">
                    {diary.content}
                  </div>

                  {/* Photos Grid */}
                  {photoList.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {photoList.map((photo, idx) => (
                        <div
                          key={idx}
                          onClick={() => setLightboxPhoto(photo)}
                          className="h-32 sm:h-40 rounded-xl border-2 border-[#4A3528] overflow-hidden cursor-pointer group/photo relative bg-black/5"
                        >
                          <img
                            src={photo}
                            alt="日常记录照片"
                            className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Footer Author Tag */}
                  {diary.author && (
                    <div className="mt-3 pt-2 border-t border-[#4A3528]/10 flex items-center justify-end text-[11px] text-[#8C6D58]">
                      <span>记录人：{diary.author}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxPhoto && (
        <div
          onClick={() => setLightboxPhoto(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs"
        >
          <div className="relative max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden border-2 border-white/20">
            <img src={lightboxPhoto} alt="放大查看" className="max-w-full max-h-[85vh] object-contain" />
            <button
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Diary Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs">
          <div className="bg-[#FFFDF9] border-3 border-[#4A3528] rounded-3xl w-full max-w-lg p-6 shadow-2xl relative my-8">
            <button
              onClick={() => {
                setModalOpen(false);
                if (onCloseAddModal) onCloseAddModal();
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FFF2E2] border border-[#4A3528] flex items-center justify-center hover:bg-[#FFE4CC]"
            >
              <X className="w-4 h-4 text-[#4A3528]" />
            </button>

            <h3 className="text-lg font-black text-[#4A3528] font-serif mb-4 flex items-center gap-2">
              <span>{editingDiary ? '✏️ 编辑日常记录' : '💌 写下新的日常'}</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-[#4A3528] mb-1">记录标题</label>
                <input
                  type="text"
                  required
                  placeholder="例如：好天气春游、手作蛋糕的一天"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-[#4A3528] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E98C58]"
                />
              </div>

              {/* Date & Location */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4A3528] mb-1">记录日期</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border-2 border-[#4A3528] bg-white text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A3528] mb-1">地点 (选填)</label>
                  <input
                    type="text"
                    placeholder="例如：杭州、小窝、电影院"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border-2 border-[#4A3528] bg-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Mood & Weather Picker */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4A3528] mb-1">心情状态</label>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(MOOD_MAP).map(([key, item]) => (
                      <button
                        type="button"
                        key={key}
                        onClick={() => setFormData({ ...formData, mood: key as Diary['mood'] })}
                        className={`px-2 py-1 rounded-full text-xs border flex items-center gap-1 ${
                          formData.mood === key
                            ? 'bg-[#E98C58] text-white border-[#4A3528] font-bold'
                            : 'bg-white border-[#D1B6A1] text-[#4A3528]'
                        }`}
                      >
                        <span>{item.emoji}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3528] mb-1">当时天气</label>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(WEATHER_MAP).map(([key, item]) => (
                      <button
                        type="button"
                        key={key}
                        onClick={() => setFormData({ ...formData, weather: key as Diary['weather'] })}
                        className={`px-2 py-1 rounded-full text-xs border flex items-center gap-1 ${
                          formData.weather === key
                            ? 'bg-[#E98C58] text-white border-[#4A3528] font-bold'
                            : 'bg-white border-[#D1B6A1] text-[#4A3528]'
                        }`}
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-bold text-[#4A3528] mb-1">记录正文</label>
                <textarea
                  required
                  rows={4}
                  placeholder="写下今天的趣事、感动的小细节或者想对TA说的心里话..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-[#4A3528] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E98C58] leading-relaxed"
                />
              </div>

              {/* Photos Attachment */}
              <div>
                <label className="block text-xs font-bold text-[#4A3528] mb-1">上传照片</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="粘贴照片链接 或点击右侧本地上传"
                    value={formData.newPhotoUrl}
                    onChange={(e) => setFormData({ ...formData, newPhotoUrl: e.target.value })}
                    className="flex-1 px-3 py-1.5 rounded-xl border border-[#4A3528] bg-white text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhotoUrl}
                    className="px-3 py-1.5 bg-[#FFF2E2] border border-[#4A3528] rounded-xl text-xs font-bold hover:bg-[#FFE4CC]"
                  >
                    添加链接
                  </button>
                  <label className="px-3 py-1.5 bg-[#E0F2FE] border border-[#4A3528] rounded-xl text-xs font-bold hover:bg-[#BAE6FD] cursor-pointer flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>上传</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Previews */}
                {formData.photos.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.photos.map((p, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-lg border border-[#4A3528] overflow-hidden group">
                        <img src={p} alt="预览" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/70 text-white flex items-center justify-center text-[10px]"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    if (onCloseAddModal) onCloseAddModal();
                  }}
                  className="px-4 py-2 rounded-full border border-[#D1B6A1] text-xs font-semibold text-[#8C6D58] hover:bg-gray-100"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#E98C58] hover:bg-[#d87c48] text-white text-xs font-bold border-2 border-[#4A3528] shadow-sm hover:scale-105 transition-all"
                >
                  {editingDiary ? '保存修改' : '确认发布'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
