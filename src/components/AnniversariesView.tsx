import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Gift,
  Heart,
  Cake,
  Plane,
  Star,
  Edit2,
  Trash2,
  X,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Anniversary, CoupleProfile } from '../types.ts';
import {
  calculateDaysUntil,
  calculateDaysTogether,
} from '../utils/helpers.ts';

interface AnniversariesViewProps {
  anniversaries: Anniversary[];
  profile: CoupleProfile;
  onAddAnniversary: (ann: Omit<Anniversary, 'id'>) => Promise<void>;
  onUpdateAnniversary: (id: number, ann: Partial<Anniversary>) => Promise<void>;
  onDeleteAnniversary: (id: number) => Promise<void>;
}

const ICON_MAP: Record<string, { label: string; icon: React.ReactNode; bg: string }> = {
  gift: { label: '礼物', icon: <Gift className="w-5 h-5 text-white" />, bg: '#E98C58' },
  heart: { label: '爱心', icon: <Heart className="w-5 h-5 text-white fill-white" />, bg: '#F43F5E' },
  cake: { label: '生日', icon: <Cake className="w-5 h-5 text-white" />, bg: '#EC4899' },
  ring: { label: '誓言', icon: <Sparkles className="w-5 h-5 text-white" />, bg: '#8B5CF6' },
  plane: { label: '旅行', icon: <Plane className="w-5 h-5 text-white" />, bg: '#0EA5E9' },
  star: { label: '纪念', icon: <Star className="w-5 h-5 text-white fill-white" />, bg: '#F59E0B' },
};

export const AnniversariesView: React.FC<AnniversariesViewProps> = ({
  anniversaries,
  profile,
  onAddAnniversary,
  onUpdateAnniversary,
  onDeleteAnniversary,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState<Anniversary | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    repeatType: 'yearly' as Anniversary['repeatType'],
    icon: 'gift' as Anniversary['icon'],
    notes: '',
  });

  const daysTogether = calculateDaysTogether(profile.togetherDate);

  // Process countdowns
  const processedAnniversaries = anniversaries.map((ann) => {
    const { daysRemaining, nextDateStr, progressPercent } = calculateDaysUntil(
      ann.date,
      ann.repeatType
    );
    // Calculate cumulative days since original date
    const start = new Date(ann.date);
    const now = new Date();
    const diffTime = now.getTime() - start.getTime();
    const elapsedDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return {
      ...ann,
      daysRemaining,
      nextDateStr,
      progressPercent,
      elapsedDays: Math.max(0, elapsedDays),
    };
  });

  // Sort upcoming first
  const sortedUpcoming = [...processedAnniversaries].sort(
    (a, b) => a.daysRemaining - b.daysRemaining
  );

  const primaryUpcoming = sortedUpcoming[0];

  const handleOpenAdd = () => {
    setEditingAnn(null);
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      repeatType: 'yearly',
      icon: 'gift',
      notes: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (ann: Anniversary) => {
    setEditingAnn(ann);
    setFormData({
      title: ann.title,
      date: ann.date,
      repeatType: ann.repeatType,
      icon: ann.icon,
      notes: ann.notes || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingAnn) {
      await onUpdateAnniversary(editingAnn.id, formData);
    } else {
      await onAddAnniversary(formData);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#4A3528] flex items-center gap-2 font-serif">
            <span className="w-8 h-8 rounded-full bg-[#FEF3C7] border-2 border-[#4A3528] flex items-center justify-center text-sm">
              🎁
            </span>
            <span>纪念日倒数</span>
          </h2>
          <p className="text-xs text-[#8C6D58] mt-0.5">记录属于我们每一个特别的日子，倒数下一次心动</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#E98C58] hover:bg-[#d87c48] text-white font-bold text-sm rounded-full border-2 border-[#4A3528] shadow-sm hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ 添加纪念日</span>
        </button>
      </div>

      {/* Top Featured Countdown Card */}
      {primaryUpcoming && (
        <section className="bg-[#FFFDF9] border-3 border-[#4A3528] rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-2 right-4 text-6xl opacity-10 select-none">🎂</div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#D97706] border border-[#4A3528]/30 inline-block">
                🌟 最近的纪念日
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#4A3528] font-serif">
                {primaryUpcoming.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#8C6D58]">
                下次日期：{primaryUpcoming.nextDateStr} · {primaryUpcoming.notes || '期待为对方准备惊喜！'}
              </p>
            </div>

            <div className="flex flex-col sm:items-end">
              <div className="flex items-baseline gap-1">
                <span className="text-xs font-bold text-[#8C6D58]">还有</span>
                <span className="text-5xl sm:text-6xl font-black text-[#E98C58] font-serif">
                  {primaryUpcoming.daysRemaining}
                </span>
                <span className="text-lg font-bold text-[#E98C58]">天</span>
              </div>

              {/* Progress Track */}
              <div className="w-full sm:w-56 h-4 bg-[#FFF2E2] rounded-full border-2 border-[#4A3528] overflow-hidden p-0.5 mt-2">
                <div
                  style={{ width: `${Math.max(10, primaryUpcoming.progressPercent)}%` }}
                  className="h-full bg-[#E98C58] rounded-full transition-all duration-700"
                />
              </div>
              <span className="text-[11px] text-[#8C6D58] mt-1 font-medium">
                倒计时进度 {primaryUpcoming.progressPercent}%
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Love Base Info Banner */}
      <div className="bg-[#FCE7F3]/70 border-2 border-[#4A3528] rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F43F5E] text-white flex items-center justify-center border-2 border-[#4A3528]">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="font-bold text-sm text-[#4A3528]">我们已经相爱了</div>
            <div className="text-xs text-[#8C6D58]">从 {profile.togetherDate} 牵手至今</div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl sm:text-3xl font-black text-[#E11D48] font-serif">{daysTogether}</span>
          <span className="text-xs font-bold text-[#E11D48] ml-1">天</span>
        </div>
      </div>

      {/* All Anniversaries List */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-[#4A3528] flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[#E98C58]" />
          <span>所有纪念日列表 ({anniversaries.length})</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {sortedUpcoming.map((ann) => {
            const iconObj = ICON_MAP[ann.icon] || ICON_MAP.gift;
            return (
              <div
                key={ann.id}
                className="bg-[#FFFDF9] border-2 border-[#4A3528] rounded-2xl p-4 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <div
                    style={{ backgroundColor: iconObj.bg }}
                    className="w-12 h-12 rounded-full border-2 border-[#4A3528] flex items-center justify-center flex-shrink-0 shadow-xs"
                  >
                    {iconObj.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-[#4A3528]">{ann.title}</h4>
                    <p className="text-[11px] text-[#8C6D58] mt-0.5">
                      {ann.date} · {ann.repeatType === 'yearly' ? '每年重复' : ann.repeatType === 'monthly' ? '每月重复' : '单次纪念'}
                    </p>
                    {ann.notes && (
                      <p className="text-[11px] text-[#8C6D58]/80 line-clamp-1 italic mt-0.5">
                        {ann.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <div className="text-right">
                    <span className="text-xs text-[#8C6D58]">还有</span>
                    <span className="text-xl sm:text-2xl font-black text-[#E98C58] font-serif ml-1">
                      {ann.daysRemaining}
                    </span>
                    <span className="text-xs font-bold text-[#E98C58] ml-0.5">天</span>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenEdit(ann)}
                      className="p-1 text-[#8C6D58] hover:text-[#4A3528] transition-colors"
                      title="编辑"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteAnniversary(ann.id)}
                      className="p-1 text-[#8C6D58] hover:text-[#E11D48] transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#FFFDF9] border-3 border-[#4A3528] rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FFF2E2] border border-[#4A3528] flex items-center justify-center hover:bg-[#FFE4CC]"
            >
              <X className="w-4 h-4 text-[#4A3528]" />
            </button>

            <h3 className="text-lg font-black text-[#4A3528] font-serif mb-4 flex items-center gap-2">
              <span>{editingAnn ? '✏️ 编辑纪念日' : '🎁 添加纪念日'}</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4A3528] mb-1">纪念日名称</label>
                <input
                  type="text"
                  required
                  placeholder="例如：一周年纪念日、圆圆的生日、第一次牵手"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-[#4A3528] bg-white text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3528] mb-1">纪念日期</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border-2 border-[#4A3528] bg-white text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3528] mb-1">重复频率</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'yearly', label: '每年重复' },
                    { key: 'monthly', label: '每月重复' },
                    { key: 'once', label: '仅纪念一次' },
                  ].map((rep) => (
                    <button
                      type="button"
                      key={rep.key}
                      onClick={() => setFormData({ ...formData, repeatType: rep.key as Anniversary['repeatType'] })}
                      className={`py-1.5 rounded-xl text-xs border font-medium ${
                        formData.repeatType === rep.key
                          ? 'bg-[#E98C58] text-white border-[#4A3528] font-bold'
                          : 'bg-white border-[#D1B6A1] text-[#4A3528]'
                      }`}
                    >
                      {rep.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3528] mb-1">选择图标</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(ICON_MAP).map(([key, item]) => (
                    <button
                      type="button"
                      key={key}
                      onClick={() => setFormData({ ...formData, icon: key as Anniversary['icon'] })}
                      style={{ backgroundColor: item.bg }}
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-transform ${
                        formData.icon === key ? 'border-[#4A3528] scale-110 shadow-md ring-2 ring-[#E98C58]' : 'border-white/50 opacity-80'
                      }`}
                    >
                      {item.icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3528] mb-1">纪念备忘 (选填)</label>
                <textarea
                  rows={2}
                  placeholder="写下关于这个日子的故事或特别安排..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-[#4A3528] bg-white text-sm focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#D1B6A1] text-xs font-semibold text-[#8C6D58]"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#E98C58] hover:bg-[#d87c48] text-white text-xs font-bold border-2 border-[#4A3528] shadow-sm hover:scale-105 transition-all"
                >
                  {editingAnn ? '保存修改' : '确认添加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
