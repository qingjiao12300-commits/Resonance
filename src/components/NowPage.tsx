import React, { useState } from 'react';
import { useDiaryStore } from '../store/useDiaryStore';
import { Send, MessageCircle, Lock, Users, User, Image, Mic, Paperclip } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { AIChatModal } from './AIChatModal';

export const NowPage: React.FC = () => {
  const [content, setContent] = useState('');
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  const entries = useDiaryStore((state) => state.entries);
  const addEntry = useDiaryStore((state) => state.addEntry);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    addEntry({
      content,
      type: 'text',
      isPrivate: isPrivateMode,
    });
    setContent('');
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Mode Toggle Header */}
      <div className="px-6 pt-6 pb-4 shrink-0">
        {/* Tagline */}
        <p className="text-center text-neutral-400 text-sm mb-4 transition-all duration-500">
          {isPrivateMode ? '让秘密永远回响在心底' : '感受共振，听见回响'}
        </p>
        
        {/* Toggle Switch */}
        <div className="flex justify-center">
          <div className="relative bg-neutral-100 rounded-full p-1 flex items-center w-[100px] h-[40px]">
            {/* Sliding Background */}
            <div 
              className={`absolute w-[44px] h-[32px] bg-white rounded-full shadow-sm transition-all duration-300 ease-out ${
                isPrivateMode ? 'translate-x-[50px]' : 'translate-x-0'
              }`}
            />
            
            {/* Left Button - Social Mode */}
            <button
              onClick={() => setIsPrivateMode(false)}
              className={`relative z-10 w-[44px] h-[32px] flex items-center justify-center rounded-full transition-colors duration-300 ${
                !isPrivateMode ? 'text-neutral-800' : 'text-neutral-400'
              }`}
            >
              <Users size={18} />
            </button>
            
            {/* Right Button - Private Mode */}
            <button
              onClick={() => setIsPrivateMode(true)}
              className={`relative z-10 w-[44px] h-[32px] flex items-center justify-center rounded-full transition-colors duration-300 ${
                isPrivateMode ? 'text-neutral-800' : 'text-neutral-400'
              }`}
            >
              <User size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Centered Input Area */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-4 shrink-0">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="bg-amber-50/50 rounded-2xl border border-amber-100 p-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as any);
                }
              }}
              placeholder="此刻，你在想什么..."
              className="w-full min-h-[100px] resize-none bg-transparent border-none focus:ring-0 text-neutral-800 placeholder-neutral-400 text-lg leading-relaxed"
            />
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-amber-100/50">
              <div className="flex items-center gap-1">
                {/* AI Chat Button - Icon Only */}
                <button
                  type="button"
                  onClick={() => setIsAIChatOpen(true)}
                  className="p-2.5 text-neutral-400 hover:text-amber-600 transition-colors rounded-full hover:bg-amber-100/50"
                  aria-label="与AI对话"
                >
                  <MessageCircle size={20} />
                </button>

                {/* Image Import - Placeholder */}
                <button
                  type="button"
                  className="p-2.5 text-neutral-400 hover:text-amber-600 transition-colors rounded-full hover:bg-amber-100/50"
                  aria-label="导入图片"
                >
                  <Image size={20} />
                </button>

                {/* Voice Input - Placeholder */}
                <button
                  type="button"
                  className="p-2.5 text-neutral-400 hover:text-amber-600 transition-colors rounded-full hover:bg-amber-100/50"
                  aria-label="语音录入"
                >
                  <Mic size={20} />
                </button>

                {/* Other Import - Placeholder */}
                <button
                  type="button"
                  className="p-2.5 text-neutral-400 hover:text-amber-600 transition-colors rounded-full hover:bg-amber-100/50"
                  aria-label="其他导入"
                >
                  <Paperclip size={20} />
                </button>
              </div>
              
              {/* Submit Button - Icon Only */}
              <button
                type="submit"
                disabled={!content.trim()}
                className="p-2.5 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="记录"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Today's Entries */}
      <div className="overflow-y-auto px-6 pb-6 flex-1">
        {entries.length > 0 && (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div 
                key={entry.id} 
                className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-neutral-800 leading-relaxed whitespace-pre-wrap flex-1">
                    {entry.content}
                  </p>
                  {entry.isPrivate && (
                    <Lock size={14} className="text-neutral-400 shrink-0 mt-1" />
                  )}
                </div>
                {entry.type === 'ai_chat' && (
                  <div className="flex items-center gap-1.5 text-amber-600 text-xs mt-2">
                    <MessageCircle size={12} />
                    <span>AI对话</span>
                  </div>
                )}
                <p className="text-neutral-400 text-xs mt-2">
                  {format(entry.timestamp, 'HH:mm', { locale: zhCN })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Chat Modal */}
      {isAIChatOpen && <AIChatModal onClose={() => setIsAIChatOpen(false)} isPrivateMode={isPrivateMode} />}
    </div>
  );
};
