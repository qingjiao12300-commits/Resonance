# EchoDiary - 新形态日记 Demo

这是一个基于 React + TypeScript + Tailwind CSS 构建的新形态日记应用演示 Demo。它探索了日记记录的多样性以及 AI 在情感连接和个人成长中的作用。

## 核心功能

### 1. 多样化记录形式
- **传统打字**：简洁的文本输入界面。
- **手写扫描 (Mock)**：模拟拍照扫描手写日记并自动识别文字的功能。
- **AI 灵感对话 (Mock)**：与内置 AI 助手进行对话，AI 会自动提取对话核心内容并归档为日记。

### 2. 回响 (Echo)
- **功能描述**：当你写下一条日记时，系统会自动匹配你过去类似的感悟或经历。
- **实现方式**：通过模拟匹配算法，从“过去”的记录中寻找共鸣，帮助你看见自己的成长。

### 3. 共振 (Resonance)
- **功能描述**：系统会推送与你当前想法类似的他人感悟。
- **实现方式**：模拟社交共鸣，让你感受到“此时此刻，有人正与你产生共鸣”，并支持发送好友申请。

## 技术栈
- **前端框架**: React 18
- **状态管理**: Zustand
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **动画**: Framer Motion
- **日期处理**: date-fns

## 项目结构
- `src/store/useDiaryStore.ts`: 核心状态管理，包含 Mock 匹配逻辑。
- `src/components/DiaryInput.tsx`: 记录入口，集成文本、扫描和 AI 对话。
- `src/components/AIChatModal.tsx`: AI 对话模拟界面。
- `src/components/EntryList.tsx`: 时光轴形式的日记列表。
- `src/components/MatchDisplay.tsx`: 回响与共振的展示区域。

## 开发说明
本项目为演示 Demo，不包含真实的数据库和多模态 AI 接口。所有匹配内容均为预设的 Mock 数据，旨在展示产品逻辑和交互体验。
