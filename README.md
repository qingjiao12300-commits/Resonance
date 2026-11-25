# Resonance (Re: 重逢)

> 在喧嚣的互联网，找回失落的频率。

[![Live Demo](https://img.shields.io/badge/Demo-Live%20Site-blue?style=for-the-badge)](https://qingjiao12300-commits.github.io/Resonance77/)

**Resonance 是一款基于 AI 叙事转译的日记社交 App。**

“我们在社交网络上表演生活，却只敢在备忘录里记录真实。”Resonance 由 AI 担任“守门人”：不匹配“发生了什么”，只匹配“感觉像什么”。

写一句此刻的心情，AI 把它转译成一个电影感的场景。你先只看到一个意象词——“凉透的水”“便利店的灯”——点开才知道那是谁的心事。感觉像的人，会在几天后以“宿命重逢”再次相遇；回响里，你会遇见过去的自己。

## ✨ 怎么玩

| 页面 | 在这里做什么 |
| --- | --- |
| 此刻 | 写下此刻的心情，可切换社交 / 私密模式 |
| 共振 | 刷到与你同频的陌生人意象卡片，点开展开叙事，只能发一条简聊 |
| 回响 | 遇见过去的自己：按心情匹配你写过的日记 |

## 🧩 核心机制

- **AI 棱镜**：把原始的情绪转译成第一人称的叙事场景，狼狈被体面地藏起来，“破碎感”被精准传达。
- **意象社交**：没有自拍，没有标题党，只有“月亮”“冰美式”“末班车”这样的意象暗号，点开才是内页。
- **宿命算法**：不追求“千人一面”的推荐。数天后因相似心境再次相遇时，触发金色的“宿命重逢”。

## 🔗 在线体验

https://qingjiao12300-commits.github.io/Resonance77/

打开页面，在首页输入框里随便写一句心情，就可以开始用了，无需登录。

## 📖 产品愿景

完整介绍见 [docs/PRODUCT-VISION.md](./docs/PRODUCT-VISION.md)。

## 🛠️ 技术栈

React 18 + TypeScript + Vite + Tailwind CSS + Zustand

## 🚀 本地运行

```bash
npm install
npm run dev
npm run build
```

## 📝 Demo 说明

Demo 中的叙事卡片与回响内容为预置示例，按心情关键词匹配，用于展示完整体验流程。
