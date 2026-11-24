import React, { useState, useRef, useEffect } from 'react';
import { useDiaryStore } from '../store/useDiaryStore';
import { X, Send, Bot, User, Archive, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

// Realistic AI response generator
const generateAIResponse = (userMessage: string, conversationLength: number): string => {
  const lowerMsg = userMessage.toLowerCase();
  
  // Topic-based responses
  if (lowerMsg.includes('编程') || lowerMsg.includes('代码') || lowerMsg.includes('开发')) {
    const responses = [
      '编程确实是一段充满探索的旅程。你最近在学习什么技术？',
      '听起来你对编程有不少思考。遇到什么有趣的问题了吗？',
      '代码的世界总是充满挑战，但每解决一个问题都是成长。'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  if (lowerMsg.includes('累') || lowerMsg.includes('压力') || lowerMsg.includes('焦虑') || lowerMsg.includes('烦')) {
    const responses = [
      '感受到你现在的压力了。有时候停下来深呼吸，允许自己休息一下也很重要。',
      '这种感觉是正常的，每个人都会有疲惫的时刻。你现在最想做什么？',
      '听起来你需要一些喘息的空间。有什么我可以帮你分担的吗？'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  if (lowerMsg.includes('开心') || lowerMsg.includes('高兴') || lowerMsg.includes('快乐') || lowerMsg.includes('棒')) {
    const responses = [
      '真高兴听到这个！是什么让你感到开心呢？',
      '能感受到你的愉悦心情。这样的时刻值得记录下来！',
      '太好了！生活中的小确幸都值得被珍藏。'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  if (lowerMsg.includes('书') || lowerMsg.includes('读') || lowerMsg.includes('看')) {
    const responses = [
      '阅读总能带来新的视角。最近在看什么书呢？',
      '书籍是灵魂的窗户。有什么让你印象深刻的内容吗？',
      '沉浸在文字中的时光总是特别宁静。'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  if (lowerMsg.includes('工作') || lowerMsg.includes('上班') || lowerMsg.includes('公司')) {
    const responses = [
      '工作中的点滴也是生活的一部分。有什么值得分享的事吗？',
      '职场的故事总是丰富多彩。今天有什么特别的经历？',
      '工作和生活的平衡确实很重要。你怎么看待现在的状态？'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Time-based greetings
  const hour = new Date().getHours();
  if (lowerMsg.includes('早') || (hour < 12 && conversationLength === 0)) {
    return '早安！新的一天，有什么想要记录的心情吗？';
  }
  if (lowerMsg.includes('晚') || (hour >= 18 && conversationLength === 0)) {
    return '晚上好！回顾今天，有什么特别的感悟想分享吗？';
  }
  
  // Conversation flow responses
  if (conversationLength > 4) {
    const summaryPrompts = [
      '我们聊了不少，要不要把这些想法归档成日记？',
      '这段对话很有意义，要我帮你总结并保存吗？',
      '你分享了很多真实的感受，要把核心内容记录下来吗？'
    ];
    return summaryPrompts[Math.floor(Math.random() * summaryPrompts.length)];
  }
  
  // General responses
  const generalResponses = [
    '我在这里听着。',
    '很有意思的想法，能多说一点吗？',
    '原来是这样，我能理解这种感觉。',
    '生活总是由这些细碎的瞬间组成的。',
    '谢谢你愿意和我分享这些。'
  ];
  return generalResponses[Math.floor(Math.random() * generalResponses.length)];
};

// Simple summary generator
const generateSummary = (messages: Message[]): string => {
  const userMessages = messages.filter(m => m.role === 'user').map(m => m.content);
  if (userMessages.length === 0) return '';
  
  if (userMessages.length === 1) return userMessages[0];
  
  // Combine last few messages for a summary
  const lastTwo = userMessages.slice(-2).join('。');
  return `AI 对话记录：${lastTwo}`;
};

interface AIChatModalProps {
  onClose: () => void;
}

export const AIChatModal: React.FC<AIChatModalProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: '你好！我是你的 AI 伙伴。今天有什么想聊聊的吗？无论是心情、灵感还是琐事，我都在这里听着。' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const addEntry = useDiaryStore((state) => state.addEntry);
  const isPrivateMode = useDiaryStore((state) => state.entries.some(e => e.isPrivate));

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    
    setIsTyping(true);
    
    // Simulate AI thinking
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMsg, messages.length);
      setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleArchive = () => {
    const summary = generateSummary(messages);
    if (!summary) return;

    addEntry({
      content: summary,
      type: 'ai_chat',
      isPrivate: isPrivateMode,
      metadata: {
        chatHistory: messages,
      }
    });
    onClose();
  };

  const userMessageCount = messages.filter(m => m.role === 'user').length;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white/90 backdrop-blur-2xl w-full max-w-lg sm:rounded-[2.5rem] rounded-t-[2.5rem] flex flex-col h-[85vh] sm:h-[650px] sm:mx-4 shadow-2xl border border-white/20 overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
        {/* Header */}
        <div className="p-6 border-b border-neutral-100/50 flex items-center justify-between shrink-0 bg-white/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center shadow-sm">
              <Bot size={24} className="text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-800 text-lg">AI 伙伴</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <p className="text-xs text-neutral-400 font-medium">在线倾听中</p>
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
          {/* Archive button - show when user has sent messages */}
          {userMessageCount > 0 && (
            <button
              onClick={handleArchive}
              className="w-full mb-4 flex items-center justify-center gap-2 py-3.5 text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-2xl transition-all text-sm font-semibold shadow-lg shadow-amber-500/20 transform active:scale-[0.98]"
            >
              <Archive size={18} />
              <span>将对话归档为日记</span>
              <Sparkles size={14} className="ml-1" />
            </button>
          )}
          
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="说说你的想法..."
                rows={1}
                className="w-full resize-none bg-neutral-100/80 rounded-2xl px-5 py-4 text-[15px] text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all max-h-32"
                style={{ minHeight: '56px' }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={`p-4 rounded-2xl transition-all shrink-0 shadow-md ${
                input.trim() && !isTyping
                  ? 'bg-neutral-900 text-white hover:bg-neutral-800 active:scale-95'
                  : 'bg-neutral-100 text-neutral-300 cursor-not-allowed'
              }`}
            >
              <Send size={22} />
            </button>
          </div>
          <p className="text-[10px] text-neutral-300 text-center mt-4 tracking-widest uppercase">
            对话内容将仅保存在你的本地设备
          </p>
        </div>
      </div>
    </div>
  );
};
