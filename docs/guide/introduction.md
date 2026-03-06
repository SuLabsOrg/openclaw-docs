# 简介

## 什么是 AI 员工？

AI 员工是运行在你自己设备上的自主 AI Agent。它通过 [OpenClaw](https://github.com/openclaw/openclaw) 框架，在 Slack、Telegram 等渠道与团队协作，自主推进任务、写代码、做 QA、管理 OKR。

**与普通 AI 助手的区别：**

| | AI 助手 | AI 员工 |
|---|---|---|
| 交互模式 | 一问一答 | 自主运行 + 按需交互 |
| 持续性 | 会话结束即停止 | 7×24 持续运行 |
| 记忆 | 无跨会话记忆 | daily notes + MEMORY.md |
| 任务驱动 | 被动接收指令 | OKR 驱动，心跳自检 |
| 协作 | 单人对话 | 多 Agent 协作 (dev/qa/supervisor) |

## 架构概览

```
你 (Slack/Telegram)
  ↓
OpenClaw Gateway (fractalbot)
  ↓
Workspace (oh-my-openclaw/)
  ├── AGENTS.md          ← 行为规范
  ├── SOUL.md            ← 人格定义
  ├── HEARTBEAT.md       ← 心跳任务
  ├── OKR.md             ← 目标管理
  ├── memory/            ← 记忆系统
  ├── agents/            ← AI 员工配置
  │   ├── EMP_0001.md    ← supervisor
  │   ├── EMP_0002.md    ← coder-a
  │   └── EMP_0003.md    ← coder-b
  └── scripts/           ← 工具脚本
```

## 核心组件

- **OpenClaw Gateway**: 消息路由，连接 Slack/Telegram 等渠道
- **Workspace**: AI 员工的工作目录，包含配置、记忆、脚本
- **agent-manager**: tmux-based AI 员工生命周期管理
- **Heartbeat**: 定期心跳，驱动 AI 员工自主工作
- **OKR 系统**: 目标驱动的任务管理

## 适用场景

- 团队需要 7×24 运行的 AI 开发/QA/运维员工
- 想要可复制的 AI 员工部署流程
- 已有 OpenClaw 基础，想扩展到多 Agent 协作
