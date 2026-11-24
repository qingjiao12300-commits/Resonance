import React, { useState } from 'react';
import { NowPage } from './components/NowPage';
import { ResonancePage } from './components/ResonancePage';
import { EchoPage } from './components/EchoPage';
import { PenLine, Users, Clock } from 'lucide-react';

type TabType = 'now' | 'resonance' | 'echo';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('now');

  return (
    <div className="h-screen bg-white text-neutral-900 font-sans flex flex-col overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 max-w-lg mx-auto w-full overflow-hidden">
        <div className="h-full">
          {activeTab === 'now' && <NowPage />}
          {activeTab === 'resonance' && <ResonancePage />}
          {activeTab === 'echo' && <EchoPage />}
        </div>
      </main>

      {/* Bottom Navigation - Icons Only */}
      <nav className="shrink-0 bg-white border-t border-neutral-100 safe-area-pb">
        <div className="max-w-lg mx-auto px-6 py-3 flex items-center justify-around">
          <button
            onClick={() => setActiveTab('now')}
            className={`p-3 rounded-full transition-all ${
              activeTab === 'now' 
                ? 'bg-neutral-900 text-white' 
                : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50'
            }`}
            aria-label="此刻"
          >
            <PenLine size={22} />
          </button>
          <button
            onClick={() => setActiveTab('resonance')}
            className={`p-3 rounded-full transition-all ${
              activeTab === 'resonance' 
                ? 'bg-neutral-900 text-white' 
                : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50'
            }`}
            aria-label="共振"
          >
            <Users size={22} />
          </button>
          <button
            onClick={() => setActiveTab('echo')}
            className={`p-3 rounded-full transition-all ${
              activeTab === 'echo' 
                ? 'bg-neutral-900 text-white' 
                : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50'
            }`}
            aria-label="回响"
          >
            <Clock size={22} />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;
