import React, { useState, useMemo } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  X,
  Upload,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Memory } from '../types.ts';

interface MemoriesViewProps {
  memories: Memory[];
  onAddMemory: (memory: Omit<Memory, 'id'>) => Promise<void>;
  onDeleteMemory: (id: number) => Promise<void>;
}

const MEMORY_TAGS = ['全部', '日常', '旅行', '纪念', '美食', '搞怪'];

export const MemoriesView: React.FC<MemoriesViewProps> = ({
  memories,
  onAddMemory,
  onDeleteMemory,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('全部');
  const [modalOpen, setModalOpen] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<Memory | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    photoUrl: '',
    caption: '',
    date: new Date().toISOString().split('T')[0],
    tag: '日常',
  });

  const filteredMemories = useMemo(() => {
    return memories.filter((m) => {
      if (selectedTag !== '全部' && m.tag !== selectedTag) return false;
      return true;
    });
  }, [memories, selectedTag]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData((prev) => ({
            ...prev,
            photoUrl: reader.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.photoUrl.trim()) return;

    await onAddMemory(formData);
    setModalOpen(false);
    setFormData({
      title: '',
      photoUrl: '',
      caption: '',
      date: new Date().toISOString().split('T')[0],
      tag: '日常',
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#4A3528] flex items-center gap-2 font-serif">
            <span className="w-8 h-8 rounded-full bg-[#FCE7F3] border-2 border-[#4A3528] flex items-center justify-center text-sm">
              📸
            </span>
            <span>甜蜜回忆库</span>
          </h2>
          <p className="text-xs text-[#8C6D58] mt-0.5">珍藏每一个定格的瞬间，用胶卷记录我们走过的路</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#E98C58] hover:bg-[#d87c48] text-white font-bold text-sm rounded-full border-2 border-[#4A3528] shadow-sm hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ 添加回忆相片</span>
        </button>
      </div>

      {/* Filter Tags */}
      <div className="flex items-center gap-2 overflow-x-auto py-1">
        {MEMORY_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1 rounded-full text-xs font-bold border-2 transition-all ${
              selectedTag === tag
                ? 'bg-[#E98C58] text-white border-[#4A3528]'
                : 'bg-white text-[#4A3528] border-[#4A3528] hover:bg-[#FFF3E6]'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Polaroid Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMemories.map((memory) => (
          <div
            key={memory.id}
            className="group relative bg-[#FFFDF9] border-2 border-[#4A3528] rounded-2xl p-3 sm:p-4 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all flex flex-col"
          >
            {/* Cute Tape Sticker on Top Center */}
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#FEF3C7]/90 border border-[#D1B6A1] rotate-1 shadow-2xs z-10" />

            {/* Photo Container */}
            <div
              onClick={() => setLightboxPhoto(memory)}
              className="h-56 sm:h-64 rounded-xl border-2 border-[#4A3528] overflow-hidden bg-black/5 cursor-pointer relative"
            >
              <img
                src={memory.photoUrl}
                alt={memory.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-2 right-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded-full font-medium">
                {memory.tag || '日常'}
              </span>
            </div>

            {/* Caption & Info */}
            <div className="mt-3 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm sm:text-base text-[#4A3528] truncate">
                  {memory.title}
                </h4>
                <button
                  onClick={() => onDeleteMemory(memory.id)}
                  className="p-1 text-[#8C6D58] hover:text-[#E11D48] transition-colors"
                  title="删除"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {memory.caption && (
                <p className="text-xs text-[#8C6D58] line-clamp-2 leading-relaxed italic">
                  “{memory.caption}”
                </p>
              )}

              <div className="flex items-center gap-1 text-[11px] text-[#A88B77] pt-1">
                <Calendar className="w-3 h-3 text-[#E98C58]" />
                <span>{memory.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxPhoto && (
        <div
          onClick={() => setLightboxPhoto(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FFFDF9] border-3 border-[#4A3528] rounded-3xl max-w-2xl max-h-[90vh] overflow-hidden p-4 relative"
          >
            <button
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="rounded-2xl overflow-hidden border-2 border-[#4A3528] max-h-[60vh] bg-black">
              <img
                src={lightboxPhoto.photoUrl}
                alt={lightboxPhoto.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="pt-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-[#4A3528]">{lightboxPhoto.title}</h3>
                <span className="text-xs text-[#8C6D58]">{lightboxPhoto.date}</span>
              </div>
              {lightboxPhoto.caption && (
                <p className="text-xs text-[#8C6D58] mt-1 leading-relaxed">
                  {lightboxPhoto.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Memory Modal */}
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
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span>添加回忆相片</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4A3528] mb-1">相片标题</label>
                <input
                  type="text"
                  required
                  placeholder="例如：春日绿意野餐、在游乐园的那一天"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-[#4A3528] bg-white text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3528] mb-1">拍摄日期</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border-2 border-[#4A3528] bg-white text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3528] mb-1">回忆相片</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="输入图片URL 或点击上传"
                    value={formData.photoUrl}
                    onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                    className="flex-1 px-3 py-1.5 rounded-xl border border-[#4A3528] bg-white text-xs"
                  />
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
                {formData.photoUrl && (
                  <div className="mt-2 h-28 rounded-xl border border-[#4A3528] overflow-hidden">
                    <img src={formData.photoUrl} alt="预览" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3528] mb-1">标签分类</label>
                <div className="flex flex-wrap gap-2">
                  {['日常', '旅行', '纪念', '美食', '搞怪'].map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => setFormData({ ...formData, tag })}
                      className={`px-3 py-1 rounded-full text-xs border font-medium ${
                        formData.tag === tag
                          ? 'bg-[#E98C58] text-white border-[#4A3528] font-bold'
                          : 'bg-white border-[#D1B6A1] text-[#4A3528]'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3528] mb-1">回忆小记 (选填)</label>
                <textarea
                  rows={2}
                  placeholder="写下这张照片背后的故事..."
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
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
                  珍藏相片
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
