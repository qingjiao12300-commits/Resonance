import React, { useState } from 'react';
import { useDiaryStore } from '../store/useDiaryStore';
import { Image, MessageCircle, Send, X } from 'lucide-react';
import { AIChatModal } from './AIChatModal';

export const DiaryInput: React.FC = () => {
  const [content, setContent] = useState('');
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const addEntry = useDiaryStore((state) => state.addEntry);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    addEntry({
      content,
      type: 'text',
    });
    setContent('');
  };

  const handlePhotoClick = () => {
    // Mock photo scanning
    const mockContents = [
      '手写日记扫描：今天天气很好，去公园散步了。',
      '手写日记扫描：工作很忙，但学到了很多新东西。',
      '手写日记扫描：晚餐做了红烧肉，味道不错。'
    ];
    const randomContent = mockContents[Math.floor(Math.random() * mockContents.length)];
    
    addEntry({
      content: randomContent,
      type: 'photo',
      metadata: {
        imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=400',
      }
    });
    alert('已模拟扫描手写日记并识别文字');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 transition-all focus-within:shadow-md focus-within:border-indigo-200">
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as any);
            }
          }}
          placeholder="记录下此刻的灵感或感悟..."
          className="w-full min-h-[100px] resize-none border-none focus:ring-0 text-gray-700 placeholder-gray-400"
        />
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePhotoClick}
              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
              title="扫描手写日记"
            >
              <Image size={20} />
            </button>
            <button
              type="button"
              onClick={() => setIsAIChatOpen(true)}
              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
              title="与AI对话"
            >
              <MessageCircle size={20} />
            </button>
          </div>
          <button
            type="submit"
            disabled={!content.trim()}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
          >
            <span>发布</span>
            <Send size={16} />
          </button>
        </div>
      </form>

      {isAIChatOpen && <AIChatModal onClose={() => setIsAIChatOpen(false)} />}
    </div>
  );
};
