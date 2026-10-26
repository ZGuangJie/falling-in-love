import React, { useState, useMemo } from 'react';
import {
  MessageCircleHeart,
  Dice5,
  Sparkles,
  Heart,
  Lock,
  Unlock,
  CheckCircle2,
  Star,
  Plus,
  Send,
  Calendar,
  X,
  Share2,
} from 'lucide-react';
import { CoupleTopic, CoupleProfile } from '../types.ts';
import { PRESET_AVATARS } from '../utils/helpers.ts';

interface TopicsViewProps {
  topics: CoupleTopic[];
  profile: CoupleProfile;
  onUpdateTopic: (id: number, updated: Partial<CoupleTopic>) => Promise<void>;
  onAddTopic: (topic: { question: string; category: CoupleTopic['category'] }) => Promise<void>;
}

const CATEGORIES: (CoupleTopic['category'] | '全部')[] = [
  '全部',
  '甜蜜回忆',
  '深度灵魂',
  '脑洞奇想',
  '浪漫未来',
  '日常温情',
];

export const TopicsView: React.FC<TopicsViewProps> = ({
  topics,
  profile,
  onUpdateTopic,
  onAddTopic,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CoupleTopic['category'] | '全部'>('全部');
  const [activeTopicIndex, setActiveTopicIndex] = useState<number>(0);
  const [filterMode, setFilterMode] = useState<'all' | 'answered' | 'pending' | 'favorites'>('all');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newCategory, setNewCategory] = useState<CoupleTopic['category']>('日常温情');

  // Input states for current active topic
  const [answerA, setAnswerA] = useState('');
  const [answerB, setAnswerB] = useState('');
  const [revealB, setRevealB] = useState(false);

  const avatarA = PRESET_AVATARS[profile.userAAvatar] || PRESET_AVATARS.dog;
  const avatarB = PRESET_AVATARS[profile.userBAvatar] || PRESET_AVATARS.cat;

  const filteredTopics = useMemo(() => {
    return topics.filter((t) => {
      if (selectedCategory !== '全部' && t.category !== selectedCategory) return false;
      if (filterMode === 'answered' && (!t.userAAnswer || !t.userBAnswer)) return false;
      if (filterMode === 'pending' && t.userAAnswer && t.userBAnswer) return false;
      if (filterMode === 'favorites' && !t.isFavorite) return false;
      return true;
    });
  }, [topics, selectedCategory, filterMode]);

  // Current active topic for the generator
  const activeTopic = useMemo(() => {
    if (filteredTopics.length === 0) return null;
    const safeIndex = Math.min(activeTopicIndex, filteredTopics.length - 1);
    return filteredTopics[safeIndex];
  }, [filteredTopics, activeTopicIndex]);

  // Sync inputs when active topic changes
  React.useEffect(() => {
    if (activeTopic) {
      setAnswerA(activeTopic.userAAnswer || '');
      setAnswerB(activeTopic.userBAnswer || '');
      setRevealB(Boolean(activeTopic.userAAnswer && activeTopic.userBAnswer));
    }
  }, [activeTopic]);

  // Shuffle next topic
  const handleShuffle = () => {
    if (filteredTopics.length <= 1) return;
    let nextIdx = Math.floor(Math.random() * filteredTopics.length);
    if (nextIdx === activeTopicIndex) {
      nextIdx = (nextIdx + 1) % filteredTopics.length;
    }
    setActiveTopicIndex(nextIdx);
  };

  // Save answers
  const handleSaveAnswers = async () => {
    if (!activeTopic) return;
    const isBothDone = Boolean(answerA.trim() && answerB.trim());
    await onUpdateTopic(activeTopic.id, {
      userAAnswer: answerA.trim(),
      userBAnswer: answerB.trim(),
      answeredAt: isBothDone ? (activeTopic.answeredAt || new Date().toISOString().split('T')[0]) : activeTopic.answeredAt,
    });
    if (isBothDone) {
      setRevealB(true);
    }
  };

  const handleToggleFavorite = async (topic: CoupleTopic) => {
    await onUpdateTopic(topic.id, { isFavorite: !topic.isFavorite });
  };

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    await onAddTopic({
      question: newQuestion.trim(),
      category: newCategory,
    });
    setNewQuestion('');
    setAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Title & Propose Question */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#4A3528] flex items-center gap-2 font-serif">
            <span className="w-8 h-8 rounded-full bg-[#FCE7F3] border-2 border-[#4A3528] flex items-center justify-center text-sm">
              💬
            </span>
            <span>情侣心动互动话题生成器</span>
          </h2>
          <p className="text-xs text-[#8C6D58] mt-0.5">
            每天或每周随机开启一个深度话题，在真诚对答中发现更懂彼此的瞬间
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#E98C58] hover:bg-[#d87c48] text-white font-bold text-xs rounded-full border-2 border-[#4A3528] shadow-sm hover:scale-105 transition-all self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>出一道题目</span>
        </button>
      </div>

      {/* Main Interactive Topic Generator Hero Card */}
      {activeTopic ? (
        <section className="bg-[#FFFDF9] border-3 border-[#4A3528] rounded-3xl p-5 sm:p-7 shadow-sm relative overflow-hidden space-y-5">
          {/* Subtle sparkles decoration */}
          <div className="absolute top-3 right-6 text-2xl text-pink-300 opacity-60 select-none">♥</div>
          <div className="absolute bottom-4 left-6 text-xl text-yellow-300 opacity-60 select-none">✦</div>

          {/* Generator Header: Category Badge + Shuffle Button */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#D97706] border border-[#4A3528]/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-yellow-500" />
                {activeTopic.category}
              </span>
              {activeTopic.answeredAt && (
                <span className="text-[11px] text-[#059669] font-medium flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                  已于 {activeTopic.answeredAt} 默契达成
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleFavorite(activeTopic)}
                className={`p-1.5 rounded-full border border-[#4A3528]/30 transition-colors ${
                  activeTopic.isFavorite ? 'bg-[#FEF3C7] text-[#D97706]' : 'bg-white text-[#8C6D58] hover:bg-gray-50'
                }`}
                title="收藏此话题"
              >
                <Star className={`w-4 h-4 ${activeTopic.isFavorite ? 'fill-[#D97706]' : ''}`} />
              </button>

              <button
                onClick={handleShuffle}
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-white hover:bg-[#FFF2E2] text-[#4A3528] font-bold border-2 border-[#4A3528] shadow-2xs hover:scale-105 transition-all"
              >
                <Dice5 className="w-4 h-4 text-[#E98C58]" />
                <span>换一题</span>
              </button>
            </div>
          </div>

          {/* Question Text */}
          <div className="text-center py-2 sm:py-4 px-2">
            <h3 className="text-lg sm:text-2xl font-black text-[#4A3528] font-serif leading-relaxed tracking-wide">
              “{activeTopic.question}”
            </h3>
          </div>

          {/* Dual-Response Interactive Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#4A3528]/10">
            {/* User A Response Box */}
            <div className="bg-[#FFF2E2]/60 rounded-2xl p-4 border-2 border-[#4A3528]/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    style={{ backgroundColor: avatarA.bg }}
                    className="w-8 h-8 rounded-full border border-[#4A3528] flex items-center justify-center text-base"
                  >
                    {profile.userAAvatar.startsWith('http') ? (
                      <img src={profile.userAAvatar} alt={profile.userAName} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      avatarA.icon
                    )}
                  </div>
                  <span className="font-bold text-xs text-[#4A3528]">
                    {profile.userAName || '呆呆'} 的回答
                  </span>
                </div>
                <textarea
                  rows={3}
                  placeholder={`写下你的真心话对 ${profile.userBName || '圆圆'} 说...`}
                  value={answerA}
                  onChange={(e) => setAnswerA(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#4A3528]/30 bg-white text-xs text-[#4A3528] focus:outline-none focus:ring-1 focus:ring-[#E98C58] leading-relaxed resize-none"
                />
              </div>
            </div>

            {/* User B Response Box */}
            <div className="bg-[#FCE7F3]/60 rounded-2xl p-4 border-2 border-[#4A3528]/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      style={{ backgroundColor: avatarB.bg }}
                      className="w-8 h-8 rounded-full border border-[#4A3528] flex items-center justify-center text-base"
                    >
                      {profile.userBAvatar.startsWith('http') ? (
                        <img src={profile.userBAvatar} alt={profile.userBName} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        avatarB.icon
                      )}
                    </div>
                    <span className="font-bold text-xs text-[#4A3528]">
                      {profile.userBName || '圆圆'} 的回答
                    </span>
                  </div>

                  {/* Secret toggle for couple suspense */}
                  {answerB && !revealB && (
                    <button
                      type="button"
                      onClick={() => setRevealB(true)}
                      className="flex items-center gap-1 text-[11px] text-[#DB2777] font-semibold hover:underline"
                    >
                      <Lock className="w-3 h-3" />
                      <span>点击揭晓</span>
                    </button>
                  )}
                </div>

                {!revealB && answerB && !answerA ? (
                  <div className="h-20 bg-white/70 rounded-xl border border-dashed border-[#DB2777]/40 flex flex-col items-center justify-center text-center p-3">
                    <Lock className="w-5 h-5 text-[#DB2777] mb-1" />
                    <span className="text-[11px] text-[#DB2777] font-bold">
                      {profile.userBName} 已经写下了悄悄话！
                    </span>
                    <span className="text-[10px] text-gray-500">
                      输入你的回答后点击保存即可同时解锁双方答案
                    </span>
                  </div>
                ) : (
                  <textarea
                    rows={3}
                    placeholder={`写下你的真心话对 ${profile.userAName || '呆呆'} 说...`}
                    value={answerB}
                    onChange={(e) => setAnswerB(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#4A3528]/30 bg-white text-xs text-[#4A3528] focus:outline-none focus:ring-1 focus:ring-[#DB2777] leading-relaxed resize-none"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-[#8C6D58]">
              💡 提示：两个人各写一段真心话，让心动答案永存小窝
            </span>

            <button
              onClick={handleSaveAnswers}
              className="flex items-center gap-1.5 px-6 py-2 rounded-full bg-[#E98C58] hover:bg-[#d87c48] text-white text-xs font-bold border-2 border-[#4A3528] shadow-sm hover:scale-105 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>保存双方回答</span>
            </button>
          </div>
        </section>
      ) : (
        <div className="bg-[#FFFDF9] border-2 border-dashed border-[#D1B6A1] rounded-2xl p-8 text-center text-[#8C6D58]">
          <MessageCircleHeart className="w-8 h-8 mx-auto text-[#D1B6A1] mb-2" />
          <p className="text-sm font-medium">当前分类下没有话题</p>
        </div>
      )}

      {/* Filter Categories Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setActiveTopicIndex(0);
              }}
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
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1 rounded-full border ${
              filterMode === 'all' ? 'bg-[#4A3528] text-white' : 'bg-white text-[#4A3528] border-[#D1B6A1]'
            }`}
          >
            全部 ({topics.length})
          </button>
          <button
            onClick={() => setFilterMode('answered')}
            className={`px-2.5 py-1 rounded-full border ${
              filterMode === 'answered' ? 'bg-[#10B981] text-white' : 'bg-white text-[#4A3528] border-[#D1B6A1]'
            }`}
          >
            已双人作答
          </button>
          <button
            onClick={() => setFilterMode('favorites')}
            className={`px-2.5 py-1 rounded-full border ${
              filterMode === 'favorites' ? 'bg-[#F59E0B] text-white' : 'bg-white text-[#4A3528] border-[#D1B6A1]'
            }`}
          >
            ★ 收藏
          </button>
        </div>
      </div>

      {/* Historical Q&A List */}
      <div className="space-y-3.5">
        <h3 className="font-bold text-sm text-[#4A3528] flex items-center gap-1.5">
          <MessageCircleHeart className="w-4 h-4 text-[#E98C58]" />
          <span>往期心动问答记录 ({filteredTopics.length})</span>
        </h3>

        <div className="grid grid-cols-1 gap-3.5">
          {filteredTopics.map((item, idx) => {
            const hasBothAnswers = Boolean(item.userAAnswer && item.userBAnswer);
            return (
              <div
                key={item.id}
                onClick={() => {
                  setActiveTopicIndex(idx);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`cursor-pointer bg-[#FFFDF9] border-2 border-[#4A3528] rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all space-y-3 group ${
                  activeTopic?.id === item.id ? 'ring-2 ring-[#E98C58]' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF3C7] text-[#D97706] border border-[#4A3528]/20">
                      {item.category}
                    </span>
                    {hasBothAnswers ? (
                      <span className="text-[11px] font-bold text-[#059669] flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> 双人已答
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#8C6D58]">待解锁回答</span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(item);
                    }}
                    className="text-[#8C6D58] hover:text-[#D97706]"
                  >
                    <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-[#D97706] text-[#D97706]' : ''}`} />
                  </button>
                </div>

                <h4 className="font-bold text-sm sm:text-base text-[#4A3528] font-serif group-hover:text-[#E98C58] transition-colors">
                  {item.question}
                </h4>

                {/* Snippets of answers if available */}
                {(item.userAAnswer || item.userBAnswer) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    {item.userAAnswer && (
                      <div className="bg-[#FFF2E2]/60 rounded-xl p-2.5 border border-[#D1B6A1]/40">
                        <span className="font-bold text-[11px] text-[#4A3528] block mb-0.5">
                          {profile.userAName}：
                        </span>
                        <p className="text-[#8C6D58] line-clamp-2 italic leading-relaxed">
                          “{item.userAAnswer}”
                        </p>
                      </div>
                    )}
                    {item.userBAnswer && (
                      <div className="bg-[#FCE7F3]/60 rounded-xl p-2.5 border border-[#D1B6A1]/40">
                        <span className="font-bold text-[11px] text-[#4A3528] block mb-0.5">
                          {profile.userBName}：
                        </span>
                        <p className="text-[#8C6D58] line-clamp-2 italic leading-relaxed">
                          “{item.userBAnswer}”
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Custom Topic Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#FFFDF9] border-3 border-[#4A3528] rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setAddModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FFF2E2] border border-[#4A3528] flex items-center justify-center hover:bg-[#FFE4CC]"
            >
              <X className="w-4 h-4 text-[#4A3528]" />
            </button>

            <h3 className="text-lg font-black text-[#4A3528] font-serif mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span>出一道想问TA的心动题目</span>
            </h3>

            <form onSubmit={handleCreateTopic} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4A3528] mb-1">题目分类</label>
                <div className="flex flex-wrap gap-2">
                  {(CATEGORIES.filter((c) => c !== '全部') as CoupleTopic['category'][]).map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setNewCategory(cat)}
                      className={`px-3 py-1 rounded-full text-xs border font-medium ${
                        newCategory === cat
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
                <label className="block text-xs font-bold text-[#4A3528] mb-1">问题内容</label>
                <textarea
                  required
                  rows={3}
                  placeholder="例如：如果明天是我们相爱的最后一天，你最想和我做什么？"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-[#4A3528] bg-white text-sm focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#D1B6A1] text-xs font-semibold text-[#8C6D58]"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#E98C58] hover:bg-[#d87c48] text-white text-xs font-bold border-2 border-[#4A3528] shadow-sm hover:scale-105 transition-all"
                >
                  放入话题库
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
