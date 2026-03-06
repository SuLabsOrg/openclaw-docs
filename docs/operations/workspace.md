# Workspace 搭建

Workspace 是 AI 员工的"家"——包含身份定义、行为规范、记忆、工具和配置。

## 目录结构

```
my-ai-team/                    ← workspace 根目录
├── AGENTS.md                  ← 行为规范 (所有 Agent 共享)
├── SOUL.md                    ← 人格定义
├── USER.md                    ← 老板/用户信息
├── HEARTBEAT.md               ← 心跳任务定义
├── OKR.md                     ← 目标管理
├── MEMORY.md                  ← 长期记忆 (curated)
├── agents/                    ← AI 员工配置
│   ├── EMP_0001.md
│   ├── EMP_0002.md
│   └── EMP_0003.md
├── memory/                    ← 记忆文件
│   ├── 2026-03-06.md          ← 每日笔记
│   └── heartbeat-state.json   ← 心跳状态追踪
├── scripts/                   ← 工具脚本
└── workspace/                 ← 项目代码
```

## 核心文件详解

### AGENTS.md — 行为规范

这是 AI 员工的"员工手册"，也是主 Agent 的配置文件（frontmatter 部分）。

```yaml
---
name: main
description: Main
enabled: true
working_directory: ${REPO_ROOT}
launcher: claude
launcher_args:
  - --dangerously-skip-permissions
heartbeat:
  cron: "*/10 * * * *"
  max_runtime: 8m
  session_mode: auto
  enabled: true
skills:
  - agent-manager
  - use-fractalbot
---
```

Markdown 正文定义行为规范：

- **启动流程**: 每次会话先读 SOUL.md → USER.md → daily notes
- **记忆管理**: daily notes vs MEMORY.md 的使用规则
- **安全规则**: 不外泄数据、`trash` > `rm`
- **外部 vs 内部操作**: 什么可以自主做，什么要先问
- **群聊规则**: 什么时候发言，什么时候沉默
- **心跳行为**: 收到心跳时做什么

### SOUL.md — 人格定义

定义 AI 员工的核心人格特质和价值观：

```markdown
# SOUL.md - Who You Are

## Core Truths
- Be genuinely helpful, not performatively helpful.
- Have opinions. An assistant with no personality is a search engine.
- Be resourceful before asking. Try to figure it out first.
- Own the outcome, not just the step.

## Boundaries
- Private things stay private. Period.
- When in doubt, ask before acting externally.
```

::: tip 实践建议
SOUL.md 偏抽象和价值观层面。具体的工作规则写在 AGENTS.md 和 HEARTBEAT.md。
:::

### USER.md — 用户信息

告诉 AI 员工"老板是谁、偏好什么"：

```markdown
# USER.md

## 我的老板
- 名字: Elliot
- Slack ID: U08C93FU222
- 偏好: 高信号、务实、简洁
- 语言: 简体中文
- 沟通渠道: Slack DM
```

## 初始化 Workspace

```bash
# 1. 创建目录
mkdir my-ai-team && cd my-ai-team
git init

# 2. 创建核心文件
touch AGENTS.md SOUL.md USER.md HEARTBEAT.md OKR.md MEMORY.md
mkdir -p agents memory scripts

# 3. 编辑各文件 (参考上面的模板)

# 4. 安装 agent-manager skill
npx openskills install agent-manager

# 5. 验证
python3 .claude/skills/agent-manager/scripts/main.py doctor
```

## 注意事项

- `MEMORY.md` 只在主会话加载（安全考虑，不泄露给群聊）
- `memory/` 目录的 daily notes 每个会话都可以读
- `workspace/` 放项目代码，通常是 git submodule
- 所有路径支持 `${REPO_ROOT}` 变量
