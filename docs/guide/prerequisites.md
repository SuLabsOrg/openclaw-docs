# 环境准备

## 必需软件

| 软件 | 最低版本 | 用途 |
|------|---------|------|
| Node.js | ≥ 22 | OpenClaw 运行时 |
| npm/pnpm | latest | 包管理 |
| tmux | ≥ 3.0 | Agent 会话管理 |
| Python 3 | ≥ 3.9 | agent-manager 脚本 |
| Git | ≥ 2.0 | 版本控制 |

## 安装检查

```bash
node --version     # ≥ 22
tmux -V            # ≥ 3.0
python3 --version  # ≥ 3.9
git --version      # ≥ 2.0
```

## API Keys

AI 员工需要至少一个 LLM provider 的 API key：

| Provider | 推荐模型 | 用途 |
|----------|---------|------|
| Anthropic | Claude Opus 4.6 | 主力开发、复杂任务 |
| Anthropic | Claude Haiku 4.5 | 轻量任务、快速响应 |
| OpenAI | GPT-5 | 替代选择 |

设置环境变量：

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
# 或
export OPENAI_API_KEY="sk-..."
```

::: tip 建议
将 API key 写入 `~/.zshrc` 或 `~/.bashrc`，确保 cron 任务也能访问。
:::

## 消息通道（可选）

如果需要 Slack/Telegram 双向通信：

- **Slack**: Bot Token (`xoxb-...`) + App-level Token (`xapp-...`)
- **Telegram**: Bot Token (from @BotFather)

详见 [消息通道接入](/operations/messaging)。

## 服务器建议

| 场景 | 配置 |
|------|------|
| 1-2 个 Agent | 本地 Mac/Linux，4GB RAM |
| 3-5 个 Agent | VPS 4C8G (每个 Agent ~1-2GB) |
| 生产环境 | 独立服务器，systemd 管理 |

::: warning 注意
每个 Agent 运行一个独立的 LLM CLI 进程。内存消耗主要来自 Node.js 进程和上下文窗口。
:::
