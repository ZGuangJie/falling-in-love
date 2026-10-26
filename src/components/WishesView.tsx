import React, { useState, useMemo } from 'react';
import {
  Star,
  Plus,
  CheckCircle2,
  Circle,
  Edit2,
  Trash2,
  X,
  Sparkles,
  Calendar,
  Heart,
} from 'lucide-react';
import { Wish } from '../types.ts';

interface WishesViewProps {
  wishes: Wish[];
  onAddWish: (wish: Omit<Wish, 'id'>) => Promise<void>;
  onUpdateWish: (id: number, wish: Partial<Wish>) => Promise<void>;
  onDeleteWish: (id: number) => Promise<void>;
}

const CATEGORIES = ['全部标签', '旅行', '娱乐', '美食', '浪漫', '生活'];

export const WishesView: React.FC<WishesViewProps> = ({
  wishes,
  onAddWish,
  onUpdateWish,
  onDeleteWish,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部标签');
  const [modalOpen, setModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [activeWishForComplete, setActiveWishForComplete] = useState<Wish | null>(null);
  const [editingWish, setEditingWish] = useState<Wish | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '旅行',
    targetDate: '',
  });

  // Completion modal form state
  const [completeData, setCompleteData] = useState({
    completedDate: new Date().toISOString().split('T')[0],
    completedNotes: '',
  });

  // Stats calculation
  const totalCount = wishes.length;
  const pendingCount = useMemo(() => wishes.filter((w) => w.status === 'pending').length, [wishes]);
  const completedCount = useMemo(() => wishes.filter((w) => w.status === 'completed').length, [wishes]);

  const filteredWishes = useMemo(() => {
    return wishes.filter((w) => {
      if (statusFilter !== 'all' && w.status !== statusFilter) return false;
      if (selectedCategory !== '全部标签' && w.category !== selectedCategory) return false;
      return true;
    });
  }, [wishes, statusFilter, selectedCategory]);

  const handleOpenAdd = () => {
    setEditingWish(null);
    setFormData({
      title: '',
      description: '',
      category: '旅行',
      targetDate: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (wish: Wish) => {
    setEditingWish(wish);
    setFormData({
      title: wish.title,
      description: wish.description || '',
      category: wish.category,
      targetDate: wish.targetDate || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingWish) {
      await onUpdateWish(editingWish.id, {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        targetDate: formData.targetDate,
      });
    } else {
      await onAddWish({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        status: 'pending',
        targetDate: formData.targetDate,
        completedDate: '',
        completedNotes: '',
        completedPhotos: '[]',
      });
    }

    setModalOpen(false);
  };

  const handleToggleComplete = async (wish: Wish) => {
    if (wish.status === 'pending') {
      // Open modal to record completion feelings & date
      setActiveWishForComplete(wish);
      setCompleteData({
        completedDate: new Date().toISOString().split('T')[0],
        completedNotes: '',
      });
      setCompleteModalOpen(true);
    } else {
      // Revert to pending
      await onUpdateWish(wish.id, {
        status: 'pending',
        completedDate: '',
        completedNotes: '',
      });
    }
  };

  const handleConfirmCompletion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWishForComplete) return;

    await onUpdateWish(activeWishForComplete.id, {
      status: 'completed',
      completedDate: completeData.completedDate,
      completedNotes: completeData.completedNotes,
    });

    setCompleteModalOpen(false);
    setActiveWishForComplete(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#4A3528] flex items-center gap-2 font-serif">
            <span className="text-yellow-500">⭐</span>
            <span>心愿清单</span>
          </h2>
          <p className="text-xs text-[#8C6D58] mt-0.5">好多心愿想和你一起去实现，一件一件慢慢完成</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#E98C58] hover:bg-[#d87c48] text-white font-bold text-sm rounded-full border-2 border-[#4A3528] shadow-sm hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ 添加心愿</span>
        </button>
      </div>

      {/* 3 Stats Cards matching screenshot */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {/* 全部心愿 */}
        <div className="bg-[#FEF9C3] border-2 border-[#4A3528] rounded-2xl p-3 sm:p-4 text-center shadow-xs">
          <div className="text-2xl sm:text-3xl font-black text-[#4A3528] font-serif">{totalCount}</div>
          <div className="text-[11px] sm:text-xs font-semibold text-[#4A3528]/80 mt-1">全部心愿</div>
        </div>

        {/* 待实现 */}
        <div className="bg-[#FCE7F3] border-2 border-[#4A3528] rounded-2xl p-3 sm:p-4 text-center shadow-xs">
          <div className="text-2xl sm:text-3xl font-black text-[#DB2777] font-serif">{pendingCount}</div>
          <div className="text-[11px] sm:text-xs font-semibold text-[#4A3528]/80 mt-1">待实现</div>
        </div>

        {/* 已完成 */}
        <div className="bg-[#D1FAE5] border-2 border-[#4A3528] rounded-2xl p-3 sm:p-4 text-center shadow-xs">
          <div className="text-2xl sm:text-3xl font-black text-[#059669] font-serif">{completedCount}</div>
          <div className="text-[11px] sm:text-xs font-semibold text-[#4A3528]/80 mt-1">已完成</div>
        </div>
      </div>

      {/* Filter Tabs & Category Dropdown */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold border-2 transition-all ${
              statusFilter === 'all'
                ? 'bg-[#E98C58] text-white border-[#4A3528]'
                : 'bg-white text-[#4A3528] border-[#4A3528]'
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1 rounded-full text-xs font-bold border-2 transition-all ${
              statusFilter === 'pending'
                ? 'bg-[#E98C58] text-white border-[#4A3528]'
                : 'bg-white text-[#4A3528] border-[#4A3528]'
            }`}
          >
            待实现
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1 rounded-full text-xs font-bold border-2 transition-all ${
              statusFilter === 'completed'
                ? 'bg-[#E98C58] text-white border-[#4A3528]'
                : 'bg-white text-[#4A3528] border-[#4A3528]'
            }`}
          >
            已实现
          </button>
        </div>

        <div className="flex items-center gap-1.5 bg-white border border-[#D1B6A1] rounded-full px-3 py-1 text-xs">
          <span className="text-[#8C6D58] font-medium">标签</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-transparent text-[#4A3528] font-semibold focus:outline-none cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Wish Cards Grid */}
      <div className="space-y-3.5">
        {filteredWishes.length === 0 ? (
          <div className="bg-[#FFFDF9] border-2 border-dashed border-[#D1B6A1] rounded-2xl p-8 text-center text-[#8C6D58] space-y-2">
            <Star className="w-8 h-8 mx-auto text-[#D1B6A1]" />
            <p className="text-sm font-medium">还没有相关心愿哦，快来添加一个吧！</p>
          </div>
        ) : (
          filteredWishes.map((wish) => {
            const isDone = wish.status === 'completed';
            return (
              <div
                key={wish.id}
                className={`bg-[#FFFDF9] border-2 border-[#4A3528] rounded-2xl p-4 sm:p-5 shadow-xs transition-all relative group ${
                  isDone ? 'bg-[#F9FCF8]' : ''
                }`}
              >
                {/* Header: Category Tag & Actions */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FCE7F3] text-[#DB2777] border border-[#4A3528]/20">
                    {wish.category}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(wish)}
                      className="p-1 text-[#8C6D58] hover:text-[#4A3528] transition-colors"
                      title="编辑"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteWish(wish.id)}
                      className="p-1 text-[#8C6D58] hover:text-[#E11D48] transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Title & Description */}
                <h3
                  className={`font-bold text-base sm:text-lg text-[#4A3528] ${
                    isDone ? 'line-through text-[#8C6D58]' : ''
                  }`}
                >
                  {wish.title}
                </h3>
                {wish.description && (
                  <p className="text-xs sm:text-sm text-[#8C6D58] mt-1 leading-relaxed">
                    {wish.description}
                  </p>
                )}

                {/* Footer: Date & Completion Checkbox */}
                <div className="mt-4 pt-2 border-t border-[#4A3528]/10 flex items-center justify-between">
                  <div className="text-[11px] text-[#8C6D58] flex items-center gap-1.5">
                    {isDone ? (
                      <span className="flex items-center gap-1 text-[#059669] font-medium">
                        <Sparkles className="w-3 h-3" />
                        已于 {wish.completedDate} 实现！
                        {wish.completedNotes && ` · “${wish.completedNotes}”`}
                      </span>
                    ) : wish.targetDate ? (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#E98C58]" />
                        计划于 {wish.targetDate} 前实现
                      </span>
                    ) : (
                      <span>期待未来一起实现 ✨</span>
                    )}
                  </div>

                  {/* Toggle button */}
                  <button
                    onClick={() => handleToggleComplete(wish)}
                    className="flex items-center gap-1 text-xs font-bold transition-all"
                    title={isDone ? '点击恢复为待实现' : '打勾标记为已完成'}
                  >
                    {isDone ? (
                      <div className="w-6 h-6 rounded-full bg-[#10B981] border border-[#4A3528] text-white flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 fill-white text-[#10B981]" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-[#4A3528] hover:border-[#10B981] bg-white flex items-center justify-center text-transparent hover:text-gray-300">
                        <Circle className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Quote Banner matching screenshot */}
      <section className="bg-[#FEF9C3] border-2 border-[#4A3528] rounded-3xl p-6 text-center shadow-xs space-y-2">
        <div className="w-10 h-10 rounded-full bg-white border-2 border-[#4A3528] mx-auto flex items-center justify-center text-yellow-500 shadow-xs">
          <Sparkles className="w-5 h-5 fill-yellow-400 text-yellow-500" />
        </div>
        <h3 className="text-base sm:text-lg font-black text-[#4A3528] font-serif">
          一起实现每一个小小的梦想
        </h3>
        <p className="text-xs text-[#8C6D58] max-w-md mx-auto">
          每一个心愿都是我们共同的期待，让我们一起努力，让梦想成真 🌈
        </p>
      </section>

      {/* Add / Edit Wish Modal */}
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
              <span>{editingWish ? '✏️ 编辑心愿' : '⭐ 许下新的心愿'}</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4A3528] mb-1">心愿标题</label>
                <input
                  type="text"
                  required
                  placeholder="例如：一起去云南旅行、看一场极光"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-[#4A3528] bg-white text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3528] mb-1">心愿分类</label>
                <div className="flex flex-wrap gap-2">
                  {['旅行', '娱乐', '美食', '浪漫', '生活'].map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setFormData({ ...formData, category: cat })}
                      className={`px-3 py-1 rounded-full text-xs border font-medium ${
                        formData.category === cat
                          ? 'bg-[#E98C58] text-white border-[#4A3528] font-bold'
                          : 'bg-white border-[#D1B6A1] text-[#4A3528]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3528] mb-1">计划达成时间 (选填)</label>
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border-2 border-[#4A3528] bg-white text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3528] mb-1">心愿描述 (为什么想实现它)</label>
                <textarea
                  rows={3}
                  placeholder="写下关于这个心愿的憧憬与计划..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  {editingWish ? '保存修改' : '放入心愿瓶'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Completion Modal */}
      {completeModalOpen && activeWishForComplete && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#FFFDF9] border-3 border-[#4A3528] rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setCompleteModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FFF2E2] border border-[#4A3528] flex items-center justify-center hover:bg-[#FFE4CC]"
            >
              <X className="w-4 h-4 text-[#4A3528]" />
            </button>

            <h3 className="text-lg font-black text-[#4A3528] font-serif mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span>哇！心愿实现了 🎉</span>
            </h3>
            <p className="text-xs text-[#8C6D58] mb-4">
              恭喜你们达成了心愿：<span className="font-bold text-[#4A3528]">“{activeWishForComplete.title}”</span>
            </p>

            <form onSubmit={handleConfirmCompletion} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4A3528] mb-1">实现日期</label>
                <input
                  type="date"
                  required
                  value={completeData.completedDate}
                  onChange={(e) => setCompleteData({ ...completeData, completedDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border-2 border-[#4A3528] bg-white text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3528] mb-1">记录此刻的感受 / 纪念备注</label>
                <textarea
                  rows={3}
                  placeholder="例如：在洱海边骑单车，吹着晚风，真的太幸福啦！"
                  value={completeData.completedNotes}
                  onChange={(e) => setCompleteData({ ...completeData, completedNotes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-[#4A3528] bg-white text-sm focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCompleteModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#D1B6A1] text-xs font-semibold text-[#8C6D58]"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold border-2 border-[#4A3528] shadow-sm hover:scale-105 transition-all"
                >
                  点亮心愿 ✨
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
