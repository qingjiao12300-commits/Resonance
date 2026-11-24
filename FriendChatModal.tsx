import React, { useState, useRef, useEffect } from 'react';
import { useDiaryStore } from '../store/useDiaryStore';
import { X, Send, User, Archive, Sparkles, Heart } from 'lucide-react';

interface Message {
  role: 'user' | 'friend';
  content: string;
}

interface FriendChatModalProps {
  friend: {
    id: string;
    name: string;
    tag: string;
  };
  onClose: () => void;
}

// Realistic Friend response generator (Demo)
const generateFriendResponse = (userMessage: string): string => {
  const responses = [
    '我也这么觉得，这种感觉真的很奇妙。',
    '哈哈，你说话真有意思。',
    '嗯嗯，我能理解你的心情。',
    '今天天气确实不错，适合出去走走。',
    '谢谢你的分享，感觉心情好多了。',
    '原来你也喜欢这个，握个手！',
    '有时候生活就是这样，慢慢来吧。',
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

export const FriendChatModal: React.FC<FriendChatModalProps> = ({ friend, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'friend', content: `嘿，我是「${friend.name}」，很高兴因为「${friend.tag}」和你产生共振。` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const addEntry = useDiaryStore(state => state.addEntry);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsTyping(true);

    // Simulate friend typing
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'friend', content: generateFriendResponse(userMsg) }]);
    }, 1500);
  };

  const handleArchive = () => {
    if (messages.length < 2) return;
    
    // Create a summary for the diary entry
    const summary = `与好友 ${friend.name} 的共振对话：${messages[messages.length - 1].content.substring(0, 20)}...`;
    
    addEntry({
      content: summary,
      type: 'friend_chat',
      metadata: {
        chatHistory: messages,
        friendName: friend.name,
      }
    });
    onClose();
  };

  const userMessageCount = messages.filter(m => m.role === 'user').length;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white/90 backdrop-blur-2xl w-full max-w-lg sm:rounded-[2.5rem] rounded-t-[2.5rem] flex flex-col h-[85vh] sm:h-[650px] sm:mx-4 shadow-2xl border border-white/20 overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
        {/* Header */}
        <div className="p-6 border-b border-neutral-100/50 flex items-center justify-between shrink-0 bg-white/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center shadow-sm">
              <span className="text-rose-600 font-bold text-lg">{friend.name[0]}</span>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-800 text-lg">{friend.name}</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <p className="text-xs text-neutral-400 font-medium">在线</p>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-full transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-neutral-50/30">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-neutral-900 text-white rounded-br-none' 
                  : 'bg-white text-neutral-700 border border-neutral-100 rounded-bl-none'
              }`}>
                <p className="text-[15px] leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start animate-in fade-in duration-300">
              <div className="bg-white text-neutral-400 p-4 rounded-2xl rounded-bl-none shadow-sm border border-neutral-100">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-neutral-100/50 bg-white shrink-0 safe-area-pb">
          {/* Archive button */}
          {userMessageCount > 0 && (
            <button
              onClick={handleArchive}
              className="w-full mb-4 flex items-center justify-center gap-2 py-3.5 text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 rounded-2xl transition-all text-sm font-semibold shadow-lg shadow-rose-500/20 transform active:scale-[0.98]"
            >
              <Archive size={18} />
              <span>将对话归档为日记</span>
              <Heart size={14} className="ml-1" />
            </button>
          )}
          
          <div className="flex items-end gap-3">
            <div className="flex-1 bg-neutral-100 rounded-[1.5rem] px-4 py-3 flex items-end gap-2 border border-transparent focus-within:border-neutral-200 focus-within:bg-white transition-all">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="说点什么..."
                rows={1}
                className="flex-1 bg-transparent border-none focus:ring-0 p-0 text-[15px] text-neutral-800 placeholder-neutral-400 resize-none max-h-32"
                style={{ height: 'auto' }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className={`p-3.5 rounded-2xl transition-all ${
                input.trim() 
                  ? 'bg-neutral-900 text-white shadow-lg shadow-neutral-900/20 active:scale-95' 
                  : 'bg-neutral-100 text-neutral-300'
              }`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
