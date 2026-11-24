import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDiaryStore } from '../store/useDiaryStore';
import { X, ChevronDown, ChevronUp, Clock, Sparkles, Maximize2 } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export const EchoPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'up' | 'down' | null>(null);

  // Get dynamic echo feed from store
  const echoFeed = useDiaryStore((state) => state.echoFeed);

  // Reset to first card when feed changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [echoFeed]);

  const handleNext = useCallback(() => {
    if (isAnimating || currentIndex >= echoFeed.length - 1) return;
    setIsAnimating(true);
    setSwipeDirection('up');
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setSwipeDirection(null);
      setIsAnimating(false);
    }, 400);
  }, [isAnimating, currentIndex, echoFeed.length]);

  const handlePrev = useCallback(() => {
    if (isAnimating || currentIndex <= 0) return;
    setIsAnimating(true);
    setSwipeDirection('down');
    
    setTimeout(() => {
      setCurrentIndex(prev => prev - 1);
      setSwipeDirection(null);
      setIsAnimating(false);
    }, 400);
  }, [isAnimating, currentIndex]);

  const handleCardClick = (id: string) => {
    if (isAnimating) return;
    setSelectedEntry(id);
  };

  // Touch & Mouse handling for swipe
  const dragStart = useRef<number | null>(null);
  
  const onStart = (clientY: number) => {
    dragStart.current = clientY;
  };
  
  const onEnd = (clientY: number) => {
    if (dragStart.current === null) return;
    const diff = dragStart.current - clientY;
    
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    dragStart.current = null;
  };

  if (echoFeed.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-neutral-50">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <Clock className="text-indigo-500" size={32} />
        </div>
        <h3 className="text-neutral-800 font-medium text-lg mb-2">听见过去的回响</h3>
        <p className="text-neutral-400 text-center text-sm max-w-[200px] leading-relaxed">
          记录当下的瞬间，让曾经的你与现在的你在此重逢
        </p>
      </div>
    );
  }

  const currentEcho = echoFeed[currentIndex];
  const currentCard = currentEcho.matchedEntry;
  const nextEcho = echoFeed[currentIndex + 1];
  const prevEcho = echoFeed[currentIndex - 1];

  const selectedEcho = selectedEntry 
    ? echoFeed.find(e => e.matchedEntry.id === selectedEntry)
    : null;

  return (
    <div 
      className="h-full relative overflow-hidden touch-none select-none"
      onTouchStart={(e) => onStart(e.touches[0].clientY)}
      onTouchEnd={(e) => onEnd(e.changedTouches[0].clientY)}
      onMouseDown={(e) => onStart(e.clientY)}
      onMouseUp={(e) => onEnd(e.clientY)}
    >
      {/* Blurred background - Unified with ResonancePage */}
      <div className="absolute inset-0 bg-neutral-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/20 to-neutral-100/50 backdrop-blur-3xl" />
      
      {/* Feed indicator - Unified with ResonancePage */}
      <div className="absolute top-6 left-0 right-0 flex justify-center gap-1.5 z-10">
        {echoFeed.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1 rounded-full transition-all duration-300 ${
              idx === currentIndex 
                ? 'w-6 bg-amber-400' 
                : 'w-1 bg-neutral-200'
            }`}
          />
        ))}
      </div>

      {/* Card stack container */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        {/* Prev card (behind) */}
        {prevEcho && swipeDirection === 'down' && (
          <div className="absolute w-full max-w-sm px-4">
            <div className="bg-white/40 backdrop-blur-md rounded-3xl p-8 border border-white/20 transform scale-95 opacity-40">
              <p className="text-neutral-400 text-xl font-serif text-center blur-[1px]">
                {prevEcho.summary}
              </p>
            </div>
          </div>
        )}

        {/* Next card (behind) */}
        {nextEcho && swipeDirection === 'up' && (
          <div className="absolute w-full max-w-sm px-4">
            <div className="bg-white/40 backdrop-blur-md rounded-3xl p-8 border border-white/20 transform scale-95 opacity-40">
              <p className="text-neutral-400 text-xl font-serif text-center blur-[1px]">
                {nextEcho.summary}
              </p>
            </div>
          </div>
        )}
        
        {/* Current card - Unified with ResonancePage */}
        <div 
          className={`w-full max-w-sm px-4 transition-all duration-500 ease-in-out cursor-grab active:cursor-grabbing ${
            swipeDirection === 'up' ? 'translate-y-[-120%] opacity-0 -rotate-6 scale-90' : 
            swipeDirection === 'down' ? 'translate-y-[120%] opacity-0 rotate-6 scale-90' : 
            'translate-y-0 opacity-100 scale-100 rotate-0'
          }`}
          onClick={() => handleCardClick(currentCard.id)}
        >
          <div className={`bg-white/70 backdrop-blur-xl rounded-3xl p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/50 relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center ${
            currentEcho.isComplementary ? 'golden-card-effect' : ''
          }`}>
            <div className="flex-1 flex flex-col items-center justify-center w-full">
              <p className="text-neutral-800 text-3xl font-serif leading-relaxed text-center mb-6">
                {currentEcho.summary}
              </p>
              <div className="flex items-center gap-1.5">
                <Clock size={12} className="text-neutral-400" />
                <p className="text-neutral-400 text-xs font-mono tracking-widest uppercase">
                  {format(currentCard.timestamp, 'yyyy.MM.dd', { locale: zhCN })}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(currentCard.id);
                }}
                className="flex items-center gap-2 transition-colors text-sm font-medium px-6 py-2.5 rounded-full border text-neutral-500 hover:text-neutral-700 bg-white/50 hover:bg-white/80 border-neutral-200"
              >
                <Maximize2 size={16} />
                <span>回溯</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Swipe hints - Unified with ResonancePage */}
        <div className="absolute bottom-28 left-0 right-0 flex flex-col items-center text-neutral-300 pointer-events-none">
          {currentIndex < echoFeed.length - 1 && (
            <div className="flex flex-col items-center animate-bounce opacity-50">
              <ChevronUp size={20} />
              <span className="text-[10px] uppercase tracking-widest">继续回溯</span>
            </div>
          )}
          {currentIndex === echoFeed.length - 1 && echoFeed.length > 1 && (
            <div className="flex flex-col items-center opacity-50">
              <ChevronDown size={20} />
              <span className="text-[10px] uppercase tracking-widest">回到近日</span>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal - Unified with ResonancePage Narrative Modal */}
      {selectedEcho && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-900 transition-colors duration-700 animate-in fade-in">
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <button 
              onClick={() => setSelectedEntry(null)}
              className="text-white/50 hover:text-white transition-colors p-2"
            >
              <X size={28} />
            </button>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
            <div className="max-w-md w-full animate-in slide-in-from-bottom-10 duration-700 delay-150 fill-mode-backwards">
              <div className="flex items-center gap-2 text-amber-400 mb-8 justify-center">
                <Clock size={16} className="fill-amber-400" />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">
                  {format(selectedEcho.matchedEntry.timestamp, 'yyyy年MM月dd日', { locale: zhCN })}
                </span>
              </div>
              
              <div className="space-y-8">
                <p className="text-white/90 text-xl md:text-2xl leading-loose font-light text-center font-serif italic">
                  "{selectedEcho.matchedEntry.content}"
                </p>
                
                <div className="w-12 h-[1px] bg-white/20 mx-auto" />
                
                <p className="text-white/40 text-xs text-center font-mono tracking-widest uppercase">
                  {selectedEcho.summary}
                </p>
                
                <div className="pt-12 flex justify-center">
                  <p className="text-white/20 text-[10px] tracking-[0.3em] uppercase">
                    那时的你，和现在的你，是同一个人吗？
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
