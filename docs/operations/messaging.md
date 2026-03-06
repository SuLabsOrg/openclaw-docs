# 消息通道接入

AI 员工通过 OpenClaw Gateway (fractalbot) 与团队在 Slack、Telegram 等渠道双向通信。

## 架构

```
Slack/Telegram → OpenClaw Gateway (fractalbot) → AI 员工
                                ↑
                        config.yaml (路由规则)
```

## 安装 fractalbot

```bash
# 克隆或获取 fractalbot
git clone <fractalbot-repo> workspace/fractalmind-ai/fractalbot/
cd workspace/fractalmind-ai/fractalbot/

# 配置
cp config.example.yaml config.yaml
```

## 配置 Slack

### 1. 创建 Slack App

1. 访问 [api.slack.com/apps](https://api.slack.com/apps)
2. Create New App → From scratch
3. 添加 Bot Token Scopes:
   - `chat:write`
   - `channels:history`
   - `channels:read`
   - `groups:history`
   - `im:history`
   - `im:read`
   - `im:write`
   - `users:read`
4. Install to Workspace
5. 复制 Bot User OAuth Token (`xoxb-...`)
6. 启用 Socket Mode，获取 App-Level Token (`xapp-...`)

### 2. 配置 config.yaml

```yaml
slack:
  enabled: true
  bot_token: "xoxb-..."
  app_token: "xapp-..."
  allowed_users:
    - U08C93FU222    # Elliot
  routing:
    default_agent: main
```

### 3. 启动

```bash
# 前台启动
./fractalbot --config config.yaml

# 或在 tmux 中后台运行
tmux new-session -d -s fractalbot './fractalbot --config config.yaml'
```

### 4. 验证

```bash
curl -s http://127.0.0.1:27890/health
# 应返回: OK

curl -s http://127.0.0.1:27890/status | python3 -m json.tool
```

## 配置 Telegram

### 1. 创建 Bot

1. 与 @BotFather 对话
2. `/newbot` 创建 Bot
3. 复制 Bot Token

### 2. 配置

```yaml
telegram:
  enabled: true
  bot_token: "123456:ABC-..."
  admin_id: 5088760910
  allowed_users:
    - 5088760910
```

## 发送消息

### CLI 方式

```bash
./fractalbot --config config.yaml \
  message send \
  --channel slack \
  --to U08C93FU222 \
  --text "Hello from AI employee"

# 发到 Slack 频道
./fractalbot --config config.yaml \
  message send \
  --channel slack \
  --to C0AJJ7FTZFC \
  --text "OKR 进度更新"

# 回复到特定 thread
./fractalbot --config config.yaml \
  message send \
  --channel slack \
  --to C0AJJ7FTZFC \
  --thread-ts 1772640900.217279 \
  --text "KR5 完成"
```

### HTTP API 方式

```bash
curl -s -X POST http://127.0.0.1:27890/api/v1/message/send \
  -H "Content-Type: application/json" \
  -d '{"channel":"slack","to":"U08C93FU222","text":"Hello"}'
```

## 消息路由

fractalbot 支持将收到的消息路由到不同 Agent：

```yaml
routing:
  default_agent: main           # 默认路由到 main agent
  rules:
    - channel: slack
      user_id: U08C93FU222
      agent: main               # Elliot 的消息发给 main
```

## 实践建议

1. **安全**: 限制 `allowed_users`，不要开放给所有人
2. **Thread**: 发到频道时务必用 `--thread-ts` 回复到正确的 thread
3. **包装脚本**: 对常用发送目标写包装脚本，避免手动拼参数出错
4. **健康检查**: 心跳时检查 `curl http://127.0.0.1:27890/health`
