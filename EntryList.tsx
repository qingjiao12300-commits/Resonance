import React from 'react';
import { useDiaryStore } from '../store/useDiaryStore';
import { Calendar, Image as ImageIcon, MessageCircle, Quote, Heart } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export const EntryList: React.FC = () => {
  const entries = useDiaryStore((state) => state.entries);

  if (entries.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
          <Quote size={24} />
        </div>
        <p className="text-gray-400 text-sm">还没有记录，开始写下你的第一条日记吧</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
      {entries.map((entry) => (
        <div key={entry.id} className="relative pl-12 group">
          {/* Timeline Dot */}
          <div className="absolute left-0 top-1.5 w-10 h-10 bg-white border-2 border-indigo-500 rounded-full flex items-center justify-center z-10 shadow-sm group-hover:scale-110 transition-transform">
            {entry.type === 'text' && <Quote size={16} className="text-indigo-500" />}
            {entry.type === 'photo' && <ImageIcon size={16} className="text-indigo-500" />}
            {entry.type === 'ai_chat' && <MessageCircle size={16} className="text-indigo-500" />}
            {entry.type === 'friend_chat' && <Heart size={16} className="text-pink-500" />}
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                <Calendar size={12} />
                <span>{format(entry.timestamp, 'HH:mm · yyyy年MM月dd日', { locale: zhCN })}</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${
                entry.type === 'text' ? 'bg-blue-50 text-blue-500' :
                entry.type === 'photo' ? 'bg-amber-50 text-amber-500' :
                entry.type === 'ai_chat' ? 'bg-purple-50 text-purple-500' :
                'bg-pink-50 text-pink-500'
              }`}>
                {entry.type === 'text' ? '文字' : entry.type === 'photo' ? '扫描' : entry.type === 'ai_chat' ? 'AI对话' : '好友共振'}
              </span>
            </div>
            
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{entry.content}</p>

            {entry.type === 'photo' && entry.metadata?.imageUrl && (
              <div className="mt-4 rounded-xl overflow-hidden border border-gray-100">
                <img src={entry.metadata.imageUrl} alt="Scanned diary" className="w-full h-48 object-cover" />
              </div>
            )}

            {entry.type === 'ai_chat' && (
              <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-[10px] text-gray-400 uppercase font-bold mb-2">对话摘要</p>
                <div className="flex items-center gap-2 text-xs text-indigo-600 font-medium">
                  <MessageCircle size={12} />
                  <span>包含 {entry.metadata?.chatHistory?.length || 0} 轮对话内容</span>
                </div>
              </div>
            )}

            {entry.type === 'friend_chat' && (
              <div className="mt-4 p-3 bg-pink-50 rounded-xl border border-pink-100">
                <p className="text-[10px] text-pink-400 uppercase font-bold mb-2">与 {entry.metadata?.friendName} 的共振对话</p>
                <div className="flex items-center gap-2 text-xs text-pink-600 font-medium">
                  <Heart size={12} />
                  <span>包含 {entry.metadata?.chatHistory?.length || 0} 轮对话内容</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
