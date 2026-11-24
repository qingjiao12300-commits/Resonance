import React from 'react';
import { useDiaryStore } from '../store/useDiaryStore';
import { History, Users, ArrowRight, Sparkles, Heart } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export const MatchDisplay: React.FC = () => {
  const { entries, echoMatches, resonanceMatches } = useDiaryStore();

  if (entries.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-200">
          <Sparkles size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">听见内心的回响</h3>
        <p className="text-gray-400 text-sm max-w-xs mx-auto">当你写下日记时，AI会为你寻找过去相似的瞬间，以及此刻共鸣的灵魂。</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {entries.map((entry) => {
        const echo = echoMatches.find((m) => m.originalEntryId === entry.id);
        const resonance = resonanceMatches.find((m) => m.originalEntryId === entry.id);

        if (!echo && !resonance) return null;

        return (
          <div key={entry.id} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-100"></div>
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">针对该条记录的匹配</span>
              <div className="h-px flex-1 bg-gray-100"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Echo Card */}
              {echo && (
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-indigo-50 hover:border-indigo-200 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-indigo-600">
                      <History size={18} />
                      <h4 className="font-bold text-sm">回响 · 过去的你</h4>
                    </div>
                    <span className="text-[10px] text-gray-400">{format(echo.matchedEntry.timestamp, 'yyyy年MM月dd日', { locale: zhCN })}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">“{echo.matchedEntry.content}”</p>
                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[10px] text-indigo-400 font-medium">{echo.reason}</span>
                    <button className="text-indigo-600 hover:translate-x-1 transition-transform">
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Resonance Card */}
              {resonance && (
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-rose-50 hover:border-rose-200 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-rose-500">
                      <Users size={18} />
                      <h4 className="font-bold text-sm">共振 · 此时此刻</h4>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                      <Heart size={10} className="fill-rose-400 text-rose-400" />
                      <span>99+ 共鸣</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">“{resonance.matchedContent}”</p>
                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-rose-100 rounded-full flex items-center justify-center text-[10px] text-rose-500 font-bold">
                        {resonance.author[0]}
                      </div>
                      <span className="text-[10px] text-gray-500 font-medium">{resonance.author}</span>
                    </div>
                    <button className="text-xs text-rose-500 font-bold hover:underline">
                      申请好友
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
