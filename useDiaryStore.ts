import { create } from 'zustand';
import { DiaryEntry, EchoMatch, ResonanceMatch } from '../types/diary';
import { 
  USER_K_ENTRIES, 
  EMOTION_POOLS,
  DiaryEcho,
  Category
} from '../lib/mockData';

interface DiaryState {
  entries: DiaryEntry[];
  echoMatches: EchoMatch[];
  resonanceMatches: ResonanceMatch[];
  resonanceFeed: ResonanceMatch[];
  echoFeed: EchoMatch[]; // Dynamic echo feed based on input
  addEntry: (entry: Omit<DiaryEntry, 'id' | 'timestamp' | 'date'>) => void;
  findMatches: (entryId: string, content: string) => void;
}

// ============================================================
// ECHO MOCK DATA: "Past Self" Diary Entries
// These simulate entries the user wrote in the past
// ============================================================

const MOCK_PAST_ENTRIES: DiaryEntry[] = [
  // 工作/压力相关
  { id: 'past-work-1', content: '今天加班到很晚，感觉身体被掏空了。但想想信用卡账单，只能继续撑着。', type: 'text', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 180, date: '2025-07-20' },
  { id: 'past-work-2', content: '老板又改需求了，第四次了。我笑着说没问题，心里已经在默念滚出地球。', type: 'text', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 90, date: '2025-10-18' },
  { id: 'past-work-3', content: '开会的时候走神了，在想如果中彩票就辞职。清醒过来发现老板在看我。', type: 'text', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 45, date: '2025-12-03' },
  
  // 孤独/情绪低落
  { id: 'past-lonely-1', content: '周末一个人在家待了两天，只有外卖小哥问我"您好"。我回复得特别认真。', type: 'text', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 120, date: '2025-09-19' },
  { id: 'past-lonely-2', content: '翻了一晚上朋友圈，发现大家都在过自己的生活。关掉手机，发呆到天亮。', type: 'text', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 60, date: '2025-11-18' },
  { id: 'past-lonely-3', content: '今天生日，没告诉任何人。买了一块小蛋糕，对着蜡烛许愿，然后一个人吃完了。', type: 'text', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 200, date: '2025-07-01' },
  
  // 开心/治愈时刻
  { id: 'past-happy-1', content: '路边摊的煎饼果子太好吃了！老板还多给了我一个蛋。今天运气不错。', type: 'text', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 30, date: '2025-12-17' },
  { id: 'past-happy-2', content: '下班路上看到超美的晚霞，站在天桥上拍了好多照片。这种时刻，活着真好。', type: 'text', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 75, date: '2025-11-03' },
  { id: 'past-happy-3', content: '今天猫主动跳到我腿上睡觉了，一动不敢动看了两集剧。被需要的感觉真好。', type: 'text', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 15, date: '2026-01-02' },
  
  // 迷茫/思考
  { id: 'past-maze-1', content: '不知道自己到底想要什么。工资够花，工作不喜欢，感情空白。就这样吗？', type: 'text', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 150, date: '2025-08-20' },
  { id: 'past-maze-2', content: '同龄人都结婚了，我还在纠结要不要换工作。时间过得太快，我跟不上。', type: 'text', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 100, date: '2025-10-09' },
  { id: 'past-maze-3', content: '刷到一个视频说"30岁前要想清楚自己要什么"，我都快30了还是一团浆糊。', type: 'text', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 40, date: '2025-12-08' },
  
  // 感情相关
  { id: 'past-crush-1', content: '他今天多看了我一眼，我愣是分析了一整天。下班路上还在傻笑。', type: 'text', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 220, date: '2025-06-11' },
  { id: 'past-crush-2', content: '删掉了前任的所有聊天记录，留下的只有那个还没送出去的礼物。算了，扔了吧。', type: 'text', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 130, date: '2025-09-09' },
  { id: 'past-crush-3', content: '朋友问我"你还喜欢他吗"，我说"早就忘了"。但回家路上，还是绕到了我们以前常去的那条街。', type: 'text', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 50, date: '2025-11-28' },
  
  // 天气/日常
  { id: 'past-weather-1', content: '下雨了，没带伞。站在屋檐下发呆，看着雨滴落在水洼里，画出一圈一圈的涟漪。', type: 'text', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 85, date: '2025-10-24' },
  { id: 'past-weather-2', content: '今天阳光很好，把被子拿出去晒了。收回来的时候闻到了太阳的味道，心情突然好了起来。', type: 'text', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 25, date: '2025-12-23' },
  { id: 'past-weather-3', content: '冷得受不了，但不想开暖气。裹着毯子窝在沙发上，喝了三杯热可可。', type: 'text', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 10, date: '2026-01-07' },
];

// Echo summaries: AI-processed reflections on past entries
const ECHO_SUMMARIES: Record<string, string> = {
  'past-work-1': '那时候你也在硬撑着',
  'past-work-2': '面对不合理的要求，你选择了隐忍',
  'past-work-3': '开会时走神的自己，其实在渴望逃离',
  'past-lonely-1': '那个只有外卖小哥打招呼的周末',
  'past-lonely-2': '刷完朋友圈后的那种空虚感',
  'past-lonely-3': '一个人过生日的勇气',
  'past-happy-1': '被一个小善意温暖到的瞬间',
  'past-happy-2': '那天的晚霞，和那个愿意停下来看的你',
  'past-happy-3': '被一只猫选中的幸福',
  'past-maze-1': '那时也在问自己：就这样吗',
  'past-maze-2': '和时间赛跑的焦虑',
  'past-maze-3': '对"想清楚"这件事的恐惧',
  'past-crush-1': '那时候的你，为一个眼神开心一整天',
  'past-crush-2': '决定放下的那个夜晚',
  'past-crush-3': '说着"忘了"却走到老地方的自己',
  'past-weather-1': '雨天屋檐下的发呆',
  'past-weather-2': '太阳味道带来的好心情',
  'past-weather-3': '冬天裹着毯子的小确幸',
};

// Keyword mapping for Echo matching
const ECHO_KEYWORDS: Record<string, string[]> = {
  'past-work-1': ['累', '加班', '撑', '身体', '钱', '账单', '掏空'],
  'past-work-2': ['老板', '需求', '改', '领导', '无语', '烦'],
  'past-work-3': ['开会', '走神', '辞职', '摸鱼', '不想上班'],
  'past-lonely-1': ['周末', '一个人', '在家', '外卖', '孤独'],
  'past-lonely-2': ['朋友圈', '发呆', '空虚', '夜', '深夜', '睡不着'],
  'past-lonely-3': ['生日', '没人', '一个人', '蛋糕'],
  'past-happy-1': ['好吃', '吃', '美食', '运气', '开心'],
  'past-happy-2': ['晚霞', '下班', '天气', '拍照', '活着', '好看'],
  'past-happy-3': ['猫', '治愈', '温暖', '舒服', '幸福'],
  'past-maze-1': ['不知道', '想要', '迷茫', '工作', '感情'],
  'past-maze-2': ['结婚', '同龄人', '时间', '换工作', '焦虑'],
  'past-maze-3': ['30', '想清楚', '未来', '计划', '怎么办'],
  'past-crush-1': ['喜欢', '他', '她', '暗恋', '心动', '傻笑'],
  'past-crush-2': ['前任', '删掉', '忘记', '放下', '分手'],
  'past-crush-3': ['忘了', '还是', '爱', '思念', '想你'],
  'past-weather-1': ['雨', '下雨', '没带伞', '湿', '发呆'],
  'past-weather-2': ['阳光', '太阳', '晴天', '好天气', '被子'],
  'past-weather-3': ['冷', '冬天', '暖', '热可可', '毯子'],
};

const toResonanceMatch = (echo: DiaryEcho, originalEntryId: string, isComplementary: boolean): ResonanceMatch => ({
  id: echo.id,
  originalEntryId,
  visualTag: echo.visualTag,
  processedContent: echo.processedContent,
  moodColor: echo.moodColor,
  timestamp: '',
  isReencounter: echo.isReencounter,
  isComplementary,
});

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Energy Complementarity Logic
const checkComplementary = (userCat: Category, cardCat: Category): boolean => {
  if (cardCat === 'SCRIPT') return true; // Demo script is always complementary
  
  // Negative states complemented by positive/reflective states
  const negativeStates: Category[] = ['VOID', 'BURNOUT', 'MAZE'];
  const positiveStates: Category[] = ['SPARK', 'MIRROR', 'GROWTH', 'DAILY', 'SOCIAL'];
  
  if (negativeStates.includes(userCat) && positiveStates.includes(cardCat)) return true;
  
  // Positive states complemented by deep reflection or shared vulnerability
  if (userCat === 'SPARK' && (cardCat === 'VOID' || cardCat === 'BURNOUT')) return true;
  
  return false;
};

// Find matching echo entries based on content
const findMatchingEchoes = (content: string, entryId: string, userCat: Category): EchoMatch[] => {
  const lowerContent = content.toLowerCase();
  const matches: { entry: DiaryEntry; score: number }[] = [];
  
  for (const entry of MOCK_PAST_ENTRIES) {
    const keywords = ECHO_KEYWORDS[entry.id] || [];
    let score = 0;
    
    for (const keyword of keywords) {
      if (lowerContent.includes(keyword.toLowerCase())) {
        score += 1;
      }
    }
    
    if (score > 0) {
      matches.push({ entry, score });
    }
  }
  
  matches.sort((a, b) => b.score - a.score);
  const topMatches = matches.slice(0, Math.min(4, Math.max(2, matches.length)));
  
  if (topMatches.length === 0) {
    const randomEntries = shuffleArray(MOCK_PAST_ENTRIES).slice(0, 3);
    return randomEntries.map(entry => ({
      originalEntryId: entryId,
      matchedEntry: entry,
      summary: ECHO_SUMMARIES[entry.id] || '曾经的你也有过类似的心情',
      reason: '随机回响',
      isComplementary: false,
    }));
  }
  
  return topMatches.map(({ entry }) => {
    // Echo complementarity: Negative current state matched with positive past state
    const isPastHappy = entry.id.includes('happy') || entry.id.includes('weather-2');
    const isComplementary = (userCat === 'VOID' || userCat === 'BURNOUT' || userCat === 'MAZE') && isPastHappy;
    
    return {
      originalEntryId: entryId,
      matchedEntry: entry,
      summary: ECHO_SUMMARIES[entry.id] || '曾经的你也有过类似的想法',
      reason: '相似的主题',
      isComplementary,
    };
  });
};

const INITIAL_FEED: ResonanceMatch[] = shuffleArray(EMOTION_POOLS.MIRROR).slice(0, 4).map(e => toResonanceMatch(e, 'init', false));

const INITIAL_ECHO_FEED: EchoMatch[] = shuffleArray(MOCK_PAST_ENTRIES).slice(0, 3).map(entry => ({
  originalEntryId: 'init',
  matchedEntry: entry,
  summary: ECHO_SUMMARIES[entry.id] || '曾经的你也有过类似的想法',
  reason: '初始回响',
  isComplementary: false,
}));

// Keyword definitions for each category (Resonance)
const CATEGORY_KEYWORDS: Record<Exclude<Category, 'SCRIPT' | 'MIRROR'>, string[]> = {
  VOID: ['孤独', '没人', '睡不着', '深夜', '难过', '哭', '失望', '晚安', '一个人', '空虚', '想家', '伤心'],
  BURNOUT: ['烦', '滚', '老板', '加班', '傻逼', '累', 'ddl', '作业', '考试', '催', '不想上班', '社畜', '无语', '操', '通宵'],
  SPARK: ['开心', '快乐', '舒服', '棒', '哈哈', '治愈', '喜欢', '吃了', '阳光', '天气好', '爽', '笑', '周末', '放假', '嘻嘻'],
  CRUSH: ['爱', '想你', '前任', '分手', '恋爱', '男朋友', '女朋友', '暗恋', '表白', '心动', '婚礼', '他', '她', '思念'],
  MAZE: ['未来', '迷茫', '钱', '找工作', '意义', '活着', '选择', '焦虑', '压力', '毕业', '房子', '怎么办', '存在'],
};

export const useDiaryStore = create<DiaryState>((set, get) => ({
  entries: [],
  echoMatches: [],
  resonanceMatches: [],
  resonanceFeed: [],
  echoFeed: [],

  addEntry: (entryData) => {
    const now = new Date();
    const newEntry: DiaryEntry = {
      ...entryData,
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
      date: now.toISOString().split('T')[0],
    };
    set((state) => ({ entries: [newEntry, ...state.entries] }));
    get().findMatches(newEntry.id, newEntry.content);
  },

  findMatches: (entryId, content) => {
    const lowerContent = content.toLowerCase();
    const hasMetFateUser = localStorage.getItem('hasMetFateUser') === 'true';
    
    let userCategory: Category = 'MIRROR';
    let curatedFeed: DiaryEcho[] = [];

    // Determine user's category first
    for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      if (keywords.some(k => lowerContent.includes(k.toLowerCase()))) {
        userCategory = cat as Category;
        break;
      }
    }

    // Priority 0: SCRIPT (User_K Demo)
    const tiredTriggers = USER_K_ENTRIES.entryA.triggers;
    const rainTriggers = USER_K_ENTRIES.entryB.triggers;
    
    const isTiredMatch = tiredTriggers.some(t => lowerContent.includes(t.toLowerCase()));
    const isRainMatch = rainTriggers.some(t => lowerContent.includes(t.toLowerCase()));

    if (isRainMatch && hasMetFateUser) {
      curatedFeed = [USER_K_ENTRIES.entryB, ...shuffleArray(EMOTION_POOLS.VOID).slice(0, 4)];
    } else if (isTiredMatch) {
      const burnoutEntries = shuffleArray(EMOTION_POOLS.BURNOUT).slice(0, 3);
      curatedFeed = [burnoutEntries[0], USER_K_ENTRIES.entryA, ...burnoutEntries.slice(1)];
      localStorage.setItem('hasMetFateUser', 'true');
    } else {
      // Enforce 2:3 ratio for negative states (Mirroring : Complementary)
      const negativeStates: Category[] = ['VOID', 'BURNOUT', 'MAZE'];
      if (negativeStates.includes(userCategory)) {
        // 2 from same category (Mirroring - 同病相怜)
        const mirrorEntries = shuffleArray(EMOTION_POOLS[userCategory]).slice(0, 2);
        
        // 3 from positive categories (Complementary - 能量互补)
        // These are intended to give strength, not to show off
        const positivePool = [
          ...EMOTION_POOLS.SPARK,
          ...EMOTION_POOLS.GROWTH,
          ...EMOTION_POOLS.DAILY,
          ...EMOTION_POOLS.SOCIAL
        ];
        const complementaryEntries = shuffleArray(positivePool).slice(0, 3);
        
        curatedFeed = [...mirrorEntries, ...complementaryEntries];
      } else {
        // For positive or neutral states, provide a balanced mix of 5 entries
        curatedFeed = shuffleArray(EMOTION_POOLS[userCategory]).slice(0, 5);
      }
    }

    // Shuffle the final feed to mix mirror and complementary entries for a natural feel
    curatedFeed = shuffleArray(curatedFeed);

    // Convert to ResonanceMatch with complementarity check
    const newFeed = curatedFeed.map(e => {
      const isComp = checkComplementary(userCategory, e.category);
      return toResonanceMatch(e, entryId, isComp);
    });

    // Find matching Echo entries (Past Self)
    const newEchoFeed = findMatchingEchoes(content, entryId, userCategory);

    set((state) => ({
      echoMatches: [...newEchoFeed, ...state.echoMatches],
      resonanceMatches: [...newFeed, ...state.resonanceMatches],
      resonanceFeed: newFeed,
      echoFeed: newEchoFeed,
    }));
  },
}));

export { MOCK_PAST_ENTRIES, ECHO_SUMMARIES };
