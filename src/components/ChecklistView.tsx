import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Circle,
  Sparkles,
  Heart,
  Calendar,
  X,
  FileText,
} from 'lucide-react';
import { ChecklistItem } from '../types.ts';

interface ChecklistViewProps {
  checklists: ChecklistItem[];
  onUpdateChecklist: (id: number, item: Partial<ChecklistItem>) => Promise<void>;
}

const CATEGORIES = ['全部分类', '日常浪漫', '旅行出游', '美食打卡', '趣味互动', '温馨回忆', '共同成长'];

export const ChecklistView: React.FC<ChecklistViewProps> = ({
  checklists,
  onUpdateChecklist,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部分类');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [modalItem, setModalItem] = useState<ChecklistItem | null>(null);

  const [modalForm, setModalForm] = useState({
    completedDate: new Date().toISOString().split('T')[0],
    note: '',
  });

  const totalCount = checklists.length;
  const completedCount = useMemo(() => checklists.filter((c) => c.isCompleted).length, [checklists]);
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredItems = useMemo(() => {
    return checklists.filter((item) => {
      if (selectedCategory !== '全部分类' && item.category !== selectedCategory) return false;
      if (statusFilter === 'completed' && !item.isCompleted) return false;
      if (statusFilter === 'pending' && item.isCompleted) return false;
      return true;
    });
  }, [checklists, selectedCategory, statusFilter]);

  const handleToggle = (item: ChecklistItem) => {
    if (!item.isCompleted) {
      setModalItem(item);
      setModalForm({
        completedDate: new Date().toISOString().split('T')[0],
        note: item.note || '',
      });
    } else {
      // Toggle off
      onUpdateChecklist(item.id, {
        isCompleted: false,
        completedDate: '',
        note: '',
      });
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalItem) return;

    await onUpdateChecklist(modalItem.id, {
      isCompleted: true,
      completedDate: modalForm.completedDate,
      note: modalForm.note,
    });

    setModalItem(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-[#4A3528] flex items-center gap-2 font-serif">
          <span className="w-8 h-8 rounded-full bg-[#FEF3C7] border-2 border-[#4A3528] flex items-center justify-center text-sm">
            ✨
          </span>
          <span>情侣必做100件小事</span>
        </h2>
        <p className="text-xs text-[#8C6D58] mt-0.5">收集100个心动瞬间，把平凡的岁月填满浪漫</p>
      </div>

      {/* Progress Hero Banner */}
      <section className="bg-[#FFFDF9] border-3 border-[#4A3528] rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] border border-[#4A3528]/20">
                打卡进度
              </span>
              <span className="text-xs text-[#8C6D58]">
                已完成 {completedCount} / {totalCount} 件小事
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#4A3528] font-serif mt-1">
              {progressPercent}% <span className="text-sm font-normal text-[#8C6D58]">达成度</span>
            </h3>
          </div>

          {/* Progress Bar with heart */}
          <div className="w-full sm:w-64">
            <div className="w-full h-4 bg-[#FFF2E2] rounded-full border-2 border-[#4A3528] overflow-hidden p-0.5 relative">
              <div
                style={{ width: `${Math.max(5, progressPercent)}%` }}
                className="h-full bg-gradient-to-r from-[#E98C58] to-[#F472B6] rounded-full transition-all duration-500"
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-[#8C6D58] mt-1 font-medium">
              <span>0% 牵手起步</span>
              <span>100% 白头偕老</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-bold border-2 whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#E98C58] text-white border-[#4A3528]'
                  : 'bg-white text-[#4A3528] border-[#4A3528] hover:bg-[#FFF3E6]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-full border ${
              statusFilter === 'all' ? 'bg-[#4A3528] text-white' : 'bg-white text-[#4A3528] border-[#D1B6A1]'
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-2.5 py-1 rounded-full border ${
              statusFilter === 'completed' ? 'bg-[#10B981] text-white' : 'bg-white text-[#4A3528] border-[#D1B6A1]'
            }`}
          >
            已打卡 ({completedCount})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-2.5 py-1 rounded-full border ${
              statusFilter === 'pending' ? 'bg-[#E98C58] text-white' : 'bg-white text-[#4A3528] border-[#D1B6A1]'
            }`}
          >
            未打卡 ({totalCount - completedCount})
          </button>
        </div>
      </div>

      {/* 100 Items List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredItems.map((item) => {
          const isDone = item.isCompleted;
          return (
            <div
              key={item.id}
              className={`border-2 border-[#4A3528] rounded-2xl p-4 transition-all flex items-start justify-between gap-3 ${
                isDone ? 'bg-[#F9FCF8] shadow-xs' : 'bg-[#FFFDF9] hover:shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3 flex-1">
                {/* Index badge */}
                <div
                  className={`w-8 h-8 rounded-full border-2 border-[#4A3528] flex items-center justify-center text-xs font-black flex-shrink-0 ${
                    isDone ? 'bg-[#D1FAE5] text-[#059669]' : 'bg-[#FFF2E2] text-[#E98C58]'
                  }`}
                >
                  #{item.itemIndex}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] border border-[#4A3528]/20">
                      {item.category}
                    </span>
                    {isDone && (
                      <span className="text-[10px] text-[#059669] font-semibold flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" /> 已达成
                      </span>
                    )}
                  </div>

                  <h4
                    className={`font-bold text-sm sm:text-base text-[#4A3528] ${
                      isDone ? 'line-through text-[#8C6D58]' : ''
                    }`}
                  >
                    {item.title}
                  </h4>

                  {isDone && (
                    <div className="text-[11px] text-[#8C6D58] bg-[#FFF2E2]/60 rounded-xl p-2 border border-[#D1B6A1]/40 mt-1 space-y-0.5">
                      {item.completedDate && (
                        <div className="flex items-center gap-1 font-medium text-[#4A3528]">
                          <Calendar className="w-3 h-3 text-[#E98C58]" />
                          <span>打卡日期：{item.completedDate}</span>
                        </div>
                      )}
                      {item.note && (
                        <p className="italic text-[#8C6D58] line-clamp-2">
                          “{item.note}”
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Toggle Button */}
              <button
                onClick={() => handleToggle(item)}
                className="flex-shrink-0 p-1 hover:scale-110 transition-transform"
                title={isDone ? '点击取消打卡' : '点击完成打卡'}
              >
                {isDone ? (
                  <div className="w-7 h-7 rounded-full bg-[#10B981] border-2 border-[#4A3528] text-white flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 fill-white text-[#10B981]" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full border-2 border-[#4A3528] bg-white hover:border-[#10B981] flex items-center justify-center text-transparent hover:text-gray-300">
                    <Circle className="w-4 h-4" />
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Check-in Modal */}
      {modalItem && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#FFFDF9] border-3 border-[#4A3528] rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setModalItem(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FFF2E2] border border-[#4A3528] flex items-center justify-center hover:bg-[#FFE4CC]"
            >
              <X className="w-4 h-4 text-[#4A3528]" />
            </button>

            <h3 className="text-lg font-black text-[#4A3528] font-serif mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span>打卡记录 #{modalItem.itemIndex}</span>
            </h3>
            <p className="text-sm font-bold text-[#E98C58] mb-4">“{modalItem.title}”</p>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4A3528] mb-1">完成日期</label>
                <input
                  type="date"
                  required
                  value={modalForm.completedDate}
                  onChange={(e) => setModalForm({ ...modalForm, completedDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border-2 border-[#4A3528] bg-white text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3528] mb-1">打卡心得 / 甜蜜笔记 (选填)</label>
                <textarea
                  rows={3}
                  placeholder="写下我们一起做这件事时的心情、好玩的小插曲..."
                  value={modalForm.note}
                  onChange={(e) => setModalForm({ ...modalForm, note: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-[#4A3528] bg-white text-sm focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalItem(null)}
                  className="px-4 py-2 rounded-full border border-[#D1B6A1] text-xs font-semibold text-[#8C6D58]"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold border-2 border-[#4A3528] shadow-sm hover:scale-105 transition-all"
                >
                  确认打卡 ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
