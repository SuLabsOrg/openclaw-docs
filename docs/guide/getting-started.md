# 快速开始

用 15 分钟部署你的第一个 AI 员工。

## 前提条件

- Node.js ≥ 22
- tmux
- Claude API key 或 OpenAI API key
- Git

## Step 1: 安装 OpenClaw

```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
```

## Step 2: 创建 Workspace

```bash
mkdir my-ai-team && cd my-ai-team
git init
```

创建核心文件：

```bash
touch AGENTS.md SOUL.md USER.md HEARTBEAT.md OKR.md
mkdir -p agents memory scripts
```

## Step 3: 配置 AI 员工身份

编辑 `SOUL.md`：

```markdown
# SOUL.md

你是 [公司名] 的 AI 软件工程师。

## 核心特质
- 直接、务实、高效
- 写代码前先理解需求
- 遇到不确定的事先问，不猜

## 工作方式
- 按 OKR.md 中的目标推进工作
- 每次心跳检查任务状态
- 完成任务后主动汇报
```

编辑 `USER.md`：

```markdown
# USER.md

## 我的老板
- 名字: [你的名字]
- 偏好: 简洁汇报，不要废话
- 沟通渠道: Slack DM
```

## Step 4: 创建第一个 Agent 配置

创建 `agents/EMP_0001.md`：

```yaml
---
name: dev
description: Dev Agent
working_directory: ${REPO_ROOT}
launcher: claude
launcher_args:
  - --dangerously-skip-permissions
skills: []
heartbeat:
  cron: "*/30 * * * *"
  max_runtime: 5m
  session_mode: auto
---

# Dev Agent

## Role
你是一个开发 Agent，负责写代码、修 bug、提 PR。

## 工作流程
1. 读 HEARTBEAT.md 获取当前任务
2. 检查 OKR.md 确认优先级
3. 执行任务，提交代码
4. 汇报进度
```

## Step 5: 启动 Agent

```bash
# 安装 agent-manager (如果还没有)
npx openskills install agent-manager

# 启动
python3 .claude/skills/agent-manager/scripts/main.py start dev

# 验证
python3 .claude/skills/agent-manager/scripts/main.py status dev
```

## Step 6: 验证心跳

```bash
# 同步 cron
python3 .claude/skills/agent-manager/scripts/main.py heartbeat sync

# 手动触发一次心跳
python3 .claude/skills/agent-manager/scripts/main.py heartbeat run EMP_0001
```

看到 Agent 回复 `HEARTBEAT_OK` 或执行了 HEARTBEAT.md 中的任务，说明部署成功。

## 下一步

- [Workspace 搭建详解](/operations/workspace) — 完整的工作区配置
- [Agent 配置](/operations/agent-config) — Agent frontmatter 字段详解
- [Heartbeat 机制](/operations/heartbeat) — 心跳驱动 AI 员工自主工作
