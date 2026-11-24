import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDiaryStore } from '../store/useDiaryStore';
import { X, ChevronDown, ChevronUp, Zap, Maximize2, MessageCircle, Send, UserPlus, Heart, Check, Users, ChevronLeft } from 'lucide-react';
import { FriendChatModal } from './FriendChatModal';

// 简聊消息类型
interface QuickChatMessage {
  id: string;
  text: string;
  fromMe: boolean;
  timestamp: number;
}

// 简聊状态类型
interface QuickChatState {
  [cardId: string]: {
    messages: QuickChatMessage[];
    hasReplied: boolean;
    isFriend: boolean;
    hasSent: boolean; // 是否已发送过消息（只能发一条）
  };
}

// 自动回复内容库（Demo演示用）
const AUTO_REPLIES = [
  '我也有过同样的感受，你不是一个人。',
  '谢谢你的分享，很高兴在这里遇见你。',
  '这种感觉我懂，有些事只有经历过的人才明白。',
  '嗯，有时候文字比说话更容易表达心情。',
  '能在这里相遇，也是一种缘分吧。',
];

// Mock好友列表数据
const MOCK_FRIENDS = [
  { id: 'f1', name: '小阳光', tag: '凉透的水', time: '3天前', online: true },
  { id: 'f2', name: '夜行者', tag: '便利店的灯', time: '1周前', online: false },
  { id: 'f3', name: '飘雪', tag: '空荡的地铁', time: '2周前', online: false },
];

export const ResonancePage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [chatOpen, setChatOpen] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'up' | 'down' | null>(null);
  const [showFriendList, setShowFriendList] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<any | null>(null);
  
  // 简聊功能状态
  const [quickChatOpen, setQuickChatOpen] = useState(false);
  const [chatStates, setChatStates] = useState<QuickChatState>({});
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Use the dynamic feed from store
  const resonanceFeed = useDiaryStore((state) => state.resonanceFeed);

  // Reset to first card when feed changes (new submission)
  useEffect(() => {
    setCurrentIndex(0);
  }, [resonanceFeed]);

  const handleNext = useCallback(() => {
    if (isAnimating || currentIndex >= resonanceFeed.length - 1) return;
    setIsAnimating(true);
    setSwipeDirection('up'); // Card moves up (forward)
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setSwipeDirection(null);
      setIsAnimating(false);
    }, 400);
  }, [isAnimating, currentIndex, resonanceFeed.length]);

  const handlePrev = useCallback(() => {
    if (isAnimating || currentIndex <= 0) return;
    setIsAnimating(true);
    setSwipeDirection('down'); // Card moves down (back)
    
    setTimeout(() => {
      setCurrentIndex(prev => prev - 1);
      setSwipeDirection(null);
      setIsAnimating(false);
    }, 400);
  }, [isAnimating, currentIndex]);

  const handleCardClick = (id: string) => {
    if (isAnimating) return;
    setChatOpen(id);
    setQuickChatOpen(false); // 进入详情时关闭简聊
  };

  // 发送简聊消息
  const handleSendMessage = useCallback(() => {
    if (!inputMessage.trim() || !chatOpen) return;
    
    const cardId = chatOpen;
    const currentState = chatStates[cardId] || { messages: [], hasReplied: false, isFriend: false, hasSent: false };
    
    // 检查是否已发送过（只能发一条）
    if (currentState.hasSent) return;
    
    const newMessage: QuickChatMessage = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      fromMe: true,
      timestamp: Date.now(),
    };
    
    setChatStates(prev => ({
      ...prev,
      [cardId]: {
        ...currentState,
        messages: [...currentState.messages, newMessage],
        hasSent: true,
      },
    }));
    
    setInputMessage('');
    setIsTyping(true);
    
    // 自动回复（Demo演示）
    setTimeout(() => {
      setIsTyping(false);
      const replyText = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
      const replyMessage: QuickChatMessage = {
        id: (Date.now() + 1).toString(),
        text: replyText,
        fromMe: false,
        timestamp: Date.now(),
      };
      
      setChatStates(prev => ({
        ...prev,
        [cardId]: {
          ...prev[cardId],
          messages: [...prev[cardId].messages, replyMessage],
          hasReplied: true,
        },
      }));
    }, 1500 + Math.random() * 1000); // 1.5-2.5秒后回复
  }, [inputMessage, chatOpen, chatStates]);

  // 添加好友
  const handleAddFriend = useCallback((cardId: string) => {
    setChatStates(prev => ({
      ...prev,
      [cardId]: {
        ...prev[cardId],
        isFriend: true,
      },
    }));
  }, []);

  // Touch & Mouse handling for swipe
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  
  const onStart = (clientX: number, clientY: number) => {
    dragStart.current = { x: clientX, y: clientY };
  };
  
  const onEnd = (clientX: number, clientY: number) => {
    if (dragStart.current === null) return;
    const diffY = dragStart.current.y - clientY;
    const diffX = dragStart.current.x - clientX;
    
    // Prioritize horizontal swipe for friend list
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (showFriendList) {
        // Swipe left to close friend list (diffX is positive)
        if (diffX > 40) {
          setShowFriendList(false);
        }
      } else {
        // Swipe right to open friend list (diffX is negative)
        if (diffX < -40) {
          setShowFriendList(true);
        }
      }
    } else if (!showFriendList) {
      // Vertical swipe for card navigation (only when friend list is closed)
      if (diffY > 50) {
        handleNext();
      } else if (diffY < -50) {
        handlePrev();
      }
    }
    dragStart.current = null;
  };

  if (resonanceFeed.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-neutral-50">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <Zap className="text-amber-500" size={32} />
        </div>
        <h3 className="text-neutral-800 font-medium text-lg mb-2">开启共振之旅</h3>
        <p className="text-neutral-400 text-center text-sm max-w-[200px] leading-relaxed">
          写下此刻的心情，让灵魂在茫茫人海中相遇
        </p>
      </div>
    );
  }

  const currentCard = resonanceFeed[currentIndex];
  const nextCard = resonanceFeed[currentIndex + 1];
  const prevCard = resonanceFeed[currentIndex - 1];

  return (
    <div 
      className="h-full relative overflow-hidden touch-none select-none"
      onTouchStart={(e) => onStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={(e) => onEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY)}
      onMouseDown={(e) => onStart(e.clientX, e.clientY)}
      onMouseUp={(e) => onEnd(e.clientX, e.clientY)}
    >
      {/* Friend List Slide Panel */}
      <div className={`absolute inset-0 z-50 transition-transform duration-500 ease-in-out ${
        showFriendList ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-full bg-white/95 backdrop-blur-2xl shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-center p-6 border-b border-neutral-100/50 relative flex-shrink-0">
            <h2 className="text-lg font-semibold text-neutral-800 tracking-tight">共振好友</h2>
          </div>
          
          {/* Friend List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 overscroll-contain">
            {MOCK_FRIENDS.map((friend) => (
              <div 
                key={friend.id}
                onClick={() => setSelectedFriend(friend)}
                className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl hover:bg-neutral-100 transition-colors cursor-pointer active:scale-[0.98]"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                    <span className="text-amber-600 font-medium text-sm">{friend.name[0]}</span>
                  </div>
                  {friend.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-neutral-800 font-medium">{friend.name}</p>
                  <p className="text-neutral-400 text-sm">共振于「{friend.tag}」</p>
                </div>
                <div className="text-right">
                  <p className="text-neutral-300 text-xs">{friend.time}</p>
                </div>
              </div>
            ))}
            
            {MOCK_FRIENDS.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto text-neutral-200 mb-4" size={48} />
                <p className="text-neutral-400 text-sm">还没有共振好友</p>
                <p className="text-neutral-300 text-xs mt-1">在卡片中对方发起简聊吧</p>
              </div>
            )}
          </div>
          
          {/* Swipe hint */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center">
            <div className="flex items-center gap-2 text-neutral-300 text-xs">
              <ChevronLeft size={14} />
              <span>左滑返回卡片</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right swipe indicator */}
      {!showFriendList && resonanceFeed.length > 0 && !chatOpen && (
        <div className="absolute left-1 top-1/2 -translate-y-1/2 z-10 animate-pulse">
          <div className="text-neutral-300/60">
            <ChevronLeft size={16} strokeWidth={3} />
          </div>
        </div>
      )}
      {/* Blurred background */}
      <div className="absolute inset-0 bg-neutral-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/20 to-neutral-100/50 backdrop-blur-3xl" />
      
      {/* Feed indicator */}
      <div className="absolute top-6 left-0 right-0 flex justify-center gap-1.5 z-10">
        {resonanceFeed.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1 rounded-full transition-all duration-300 ${
              idx === currentIndex 
                ? resonanceFeed[idx]?.isReencounter 
                  ? 'w-6 bg-amber-400' 
                  : 'w-6 bg-neutral-400'
                : 'w-1 bg-neutral-200'
            }`}
          />
        ))}
      </div>

      {/* Card stack container */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        {/* Prev card (behind, only visible when swiping down) */}
        {prevCard && swipeDirection === 'down' && (
          <div className="absolute w-full max-w-sm px-4">
            <div className={`bg-white/40 backdrop-blur-md rounded-3xl p-8 border border-white/20 transform scale-95 opacity-40 ${prevCard.isReencounter ? 'border-amber-400/50' : ''}`}>
              <p className="text-neutral-400 text-xl font-serif text-center blur-[1px]">
                {prevCard.visualTag}
              </p>
            </div>
          </div>
        )}

        {/* Next card (behind, only visible when swiping up) */}
        {nextCard && swipeDirection === 'up' && (
          <div className="absolute w-full max-w-sm px-4">
            <div className={`bg-white/40 backdrop-blur-md rounded-3xl p-8 border border-white/20 transform scale-95 opacity-40 ${nextCard.isReencounter ? 'border-amber-400/50' : ''}`}>
              <p className="text-neutral-400 text-xl font-serif text-center blur-[1px]">
                {nextCard.visualTag}
              </p>
            </div>
          </div>
        )}
        
        {/* Current card */}
        <div 
          className={`w-full max-w-sm px-4 transition-all duration-500 ease-in-out cursor-grab active:cursor-grabbing ${
            swipeDirection === 'up' ? 'translate-y-[-120%] opacity-0 -rotate-6 scale-90' : 
            swipeDirection === 'down' ? 'translate-y-[120%] opacity-0 rotate-6 scale-90' : 
            'translate-y-0 opacity-100 scale-100 rotate-0'
          }`}
          onClick={() => handleCardClick(currentCard.id)}
        >
          <div className={`bg-white/70 backdrop-blur-xl rounded-3xl p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center ${
            currentCard.isComplementary ? 'golden-card-effect' : ''
          } ${
            currentCard.isReencounter 
              ? 'border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.3)]' 
              : 'border-white/50'
          }`}>
            {/* Special Badge for Reencounter */}
            {currentCard.isReencounter && (
              <div className="absolute top-6 right-6 flex items-center gap-1 bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                <Zap size={12} className="fill-amber-600" />
                <span>宿命重逢</span>
              </div>
            )}

            <div className="flex-1 flex flex-col items-center justify-center w-full">
              <p className="text-neutral-800 text-3xl font-serif leading-relaxed text-center mb-4">
                {currentCard.visualTag}
              </p>
              <p className="text-neutral-400 text-sm">
                {['1天前', '2天前', '3天前'][currentIndex % 3]}
              </p>
            </div>

            <div className="mt-8">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(currentCard.id);
                }}
                className={`flex items-center gap-2 transition-colors text-sm font-medium px-6 py-2.5 rounded-full border ${
                  currentCard.isReencounter
                    ? 'bg-amber-500 text-white hover:bg-amber-600 border-amber-500'
                    : 'text-neutral-500 hover:text-neutral-700 bg-white/50 hover:bg-white/80 border-neutral-200'
                }`}
              >
                <Maximize2 size={16} />
                <span>展开</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Swipe hints */}
        <div className="absolute bottom-28 left-0 right-0 flex flex-col items-center text-neutral-300 pointer-events-none">
          {currentIndex < resonanceFeed.length - 1 && (
            <div className="flex flex-col items-center animate-bounce opacity-50">
              <ChevronUp size={20} />
              <span className="text-[10px] uppercase tracking-widest">继续探索</span>
            </div>
          )}
          {currentIndex === resonanceFeed.length - 1 && resonanceFeed.length > 1 && (
            <div className="flex flex-col items-center opacity-50">
              <ChevronDown size={20} />
              <span className="text-[10px] uppercase tracking-widest">回到上一个</span>
            </div>
          )}
        </div>
      </div>

      {/* Narrative Modal with Quick Chat */}
      {chatOpen === currentCard.id && (() => {
        const cardChatState = chatStates[currentCard.id] || { messages: [], hasReplied: false, isFriend: false, hasSent: false };
        
        return (
        <div className={`fixed inset-0 z-50 flex flex-col ${currentCard.moodColor || 'bg-slate-900'} transition-colors duration-700 animate-in fade-in`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <button 
              onClick={() => {
                setChatOpen(null);
                setQuickChatOpen(false);
              }}
              className="text-white/50 hover:text-white transition-colors p-2"
            >
              <X size={28} />
            </button>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
            {!quickChatOpen ? (
              // Original Narrative Content
              <div className="max-w-md w-full animate-in slide-in-from-bottom-10 duration-700 delay-150 fill-mode-backwards">
                {currentCard.isReencounter && (
                  <div className="flex items-center gap-2 text-amber-400 mb-8 justify-center">
                    <Zap size={16} className="fill-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em]">宿命重逢</span>
                  </div>
                )}
                
                <div className="space-y-8">
                  <p className="text-white/90 text-xl md:text-2xl leading-loose font-light text-center font-serif">
                    {currentCard.processedContent}
                  </p>
                  
                  <div className="w-12 h-[1px] bg-white/20 mx-auto" />
                  
                  <p className="text-white/40 text-xs text-center font-mono tracking-widest uppercase">
                    {currentCard.timestamp} • {currentCard.visualTag}
                  </p>

                  {/* Quick Chat Entry Button */}
                  <div className="pt-12 flex justify-center">
                    <button
                      onClick={() => setQuickChatOpen(true)}
                      className={`flex items-center gap-3 px-10 py-4 rounded-2xl transition-all duration-300 shadow-xl transform hover:scale-105 active:scale-95 ${
                        cardChatState.hasReplied
                          ? 'bg-green-500 text-white shadow-green-500/30'
                          : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-md border border-white/10'
                      }`}
                    >
                      <MessageCircle size={24} className={cardChatState.hasReplied ? 'fill-white' : ''} />
                      <span className="text-lg font-medium tracking-wide">
                        {cardChatState.isFriend ? '已是好友' : cardChatState.hasReplied ? '查看回复' : '发起简聊'}
                      </span>
                      {cardChatState.hasReplied && !cardChatState.isFriend && (
                        <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Quick Chat Interface
              <div className="w-full max-w-md h-full flex flex-col animate-in slide-in-from-right-10 duration-500">
                {/* Chat Header */}
                <div className="text-center mb-4">
                  <p className="text-white/40 text-xs tracking-wider">与 TA 简聊</p>
                  <p className="text-white/20 text-[10px] mt-1">
                    {cardChatState.hasSent ? '你已发送过消息' : '只能发送一条消息'}
                  </p>
                </div>
                
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-2">
                  {cardChatState.messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <MessageCircle size={48} className="text-white/10 mb-4" />
                      <p className="text-white/30 text-sm">发送一条消息</p>
                      <p className="text-white/20 text-xs mt-1">开启你们的对话</p>
                    </div>
                  )}
                  
                  {cardChatState.messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                        msg.fromMe 
                          ? 'bg-white/20 text-white rounded-br-sm' 
                          : 'bg-white/10 text-white/90 rounded-bl-sm'
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-bl-sm">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Add Friend Button (shows after reply) */}
                {cardChatState.hasReplied && !cardChatState.isFriend && (
                  <div className="mb-4 animate-in slide-in-from-bottom-5 duration-500">
                    <button
                      onClick={() => handleAddFriend(currentCard.id)}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-pink-500/80 to-purple-500/80 hover:from-pink-500 hover:to-purple-500 text-white rounded-2xl transition-all duration-300 shadow-lg shadow-pink-500/20"
                    >
                      <UserPlus size={18} />
                      <span className="font-medium">加为好友，继续聊天</span>
                    </button>
                  </div>
                )}
                
                {/* Friend Added Success */}
                {cardChatState.isFriend && (
                  <div className="mb-4 animate-in slide-in-from-bottom-5 duration-500">
                    <div className="w-full flex items-center justify-center gap-2 py-3 bg-green-500/20 text-green-300 rounded-2xl border border-green-400/30">
                      <Check size={18} />
                      <span className="font-medium">已成为好友</span>
                      <Heart size={14} className="fill-green-300 ml-1" />
                    </div>
                  </div>
                )}
                
                {/* Input Area */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={cardChatState.hasSent ? "你已发送过消息" : "写点什么..."}
                    disabled={cardChatState.hasSent}
                    className={`flex-1 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors text-sm ${
                      cardChatState.hasSent ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || cardChatState.hasSent}
                    className={`p-3 rounded-2xl transition-all duration-300 ${
                      inputMessage.trim() && !cardChatState.hasSent
                        ? 'bg-white/20 text-white hover:bg-white/30' 
                        : 'bg-white/5 text-white/30 cursor-not-allowed'
                    }`}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        );
      })()}
      {/* Friend Chat Modal */}
      {selectedFriend && (
        <FriendChatModal 
          friend={selectedFriend} 
          onClose={() => setSelectedFriend(null)} 
        />
      )}
    </div>
  );
};
