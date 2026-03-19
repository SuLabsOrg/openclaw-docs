# 配置 Slack 双向通信

::: warning Draft
这是第二个案例的证据优先草稿，不是最终验收稿。

当前页面记录的边界已经更新为：Slack 双向通信的**技术路径已由本地证据包 + Slack API-visible audit 证明**；剩余 gap 如有，仅是 Slack client / admin clean-room artifact acceptance。不补写无法从当前 workspace、当前 token 或当前 artifact 直接证明的 Slack App 创建细节，也不在文档中暴露任何 token。
:::

## 案例目标

沉淀一个可复现的 Slack 双向通信案例，目标闭环如下：

1. 本地 OpenClaw Gateway（fractalbot）已正确配置并运行
2. Slack 通道已启用
3. Slack 入站消息能够进入 OpenClaw workspace
4. 消息能够被正确路由到目标 Agent / 主 session
5. Agent 的回复能够再发回 Slack

这个案例最终想证明的不是“文档里能写 Slack 配置”，而是“新 workspace 按文档配置后，真的能跑通一条双向消息链路”。

## 前提条件

以下前提是当前草稿可以明确写出的部分：

- 本机存在可执行的 `fractalbot` binary
- 本机存在有效的 `fractalbot` 配置文件
- 本机本地 gateway 端口可访问
- `fractalbot` 配置中 Slack channel 已启用
- `fractalbot` 配置中 workspace 已绑定到 OpenClaw 根目录
- 目标 workspace 已具备 `agent-manager` 和可路由的 Agent（至少 `main`）

以下前提当前只能保留为操作要求，不能写成“已验证完成”：

- 操作者有权限创建 / 修改 Slack App
- 操作者有权限拿到 Bot Token 与 App-Level Token
- 操作者有权限把 Slack App 安装到目标 Workspace
- 操作者能从 Slack 客户端发起真实 DM / channel 消息做端到端验证

## 当前 workspace 已能直接证明的内容

### 1. 文档层已经有基础操作页

当前 `openclaw-docs` 已有消息通道操作文档，覆盖了：

- fractalbot 基本架构
- Slack 配置段结构
- 基本启动方式
- health/status 检查方式
- CLI / HTTP API 的发送命令样例

这意味着本案例不需要从零发明结构，而是要补齐“真实案例 + 证据闭环”。

### 2. 本机存在当前可用的 fractalbot 安装

当前机器上可以直接验证到：

- binary 存在：`~/.local/bin/fractalbot`
- config 存在：`~/.config/fractalbot/config.yaml`
- 本地 gateway health 正常：`curl http://127.0.0.1:27890/health` 返回 `OK`

### 3. 本地 gateway status 显示 Slack 通道正在运行

当前机器上可直接验证到 `/status` 返回：

- `status: ok`
- Slack channel `enabled: true`
- Slack channel `running: true`
- `workspace_configured: true`
- `default_agent: main`
- `allowed_agents` 包含 `main`, `coder-a`, `coder-b`, `qa`

这说明“本地 gateway + workspace 绑定 + Slack channel 运行”在当前机器上是可证明的。

### 4. 历史资料中已经存在 Slack 通路打通过的证据

当前 workspace 中已有历史记录表明：

- fractalbot 安装 / 配置 / 连接验证曾完成
- Slack Socket Mode 通道问题曾修复完成
- Slack DM → fractalbot → agent-manager assign main → 主 session 收到消息 的链路曾跑通
- 发送命令路径和默认配置路径曾有过实际差异，并已通过改用正确 binary/config 解决

这些资料足以支撑本案例先写成“证据优先草稿”，但还不够支撑“完全从零复现”的最终版。

### 5. 当前 run 已补齐本地技术证据包

本轮已经补齐一份最小可验收的本地证据包，位于：

- `/Users/sulabs_001/agent-worktrees/oh-my-openclaw-coder-a/artifacts/okr5-kr3-case2-20260315-025655/`

其中可直接支撑本地技术路径的关键材料包括：

- `01-current-binary-config-health-status.txt`
- `02-redacted-config.yaml`
- `03-fractalbot-startup-and-routing-log.txt`
- `04-dm-routing-and-send-proof.txt`
- `05-thread-routing-and-send-proof.txt`

这意味着当前已经不是“只有 health/status 基础证明”，而是已经能在本机上证明：

- fractalbot binary / config 路径正确
- Slack channel 已成功启动并绑定到目标 workspace
- 入站 Slack DM 能被授权并路由到 `main`
- 出站回复能够发回 DM
- thread 回复会携带正确 `thread_ts` 发回原线程

### 6. 当前 run 已补齐 Slack API-visible proof

在上述本地证据包之外，本轮又补齐了一份只读 Slack API-visible audit，以及对应的 fresh QA review：

- `/Users/sulabs_001/agent-worktrees/oh-my-openclaw-coder-a/workspace/heartbeat-okr5-case2-slack-api-gap-audit-20260320.md`
- `/Users/sulabs_001/agent-worktrees/oh-my-openclaw-qa/workspace/heartbeat-okr5-case2-audit-review-20260320.md`

这两份新证据把 Case 2 的技术事实边界进一步收口为：

- `auth.test` 可证明 live token 绑定在目标 Slack workspace，bot user 为 `openclaw2`
- `conversations.list` / `conversations.info` 可证明目标 DM / 公共频道对当前 token 可见，且 bot 在目标频道中是 member
- `conversations.history` 可直接读到真实 DM 中的人类消息与 bot 回复
- `conversations.replies` 可直接读到至少 1 条真实 thread 的 parent + 多条 bot reply

因此，当前 Case 2 已不再存在“技术路径是否真的跑通”的 blocker；如果还有剩余 gap，也只是 reviewer 是否仍坚持要 Slack UI / admin clean-room artifact 作为最终验收形态。

## 当前可以安全写入文档的验证命令

以下命令可以在不暴露 token 的前提下，验证本地 gateway 是否处于可工作的基础状态：

```bash
ls -l ~/.local/bin/fractalbot
ls -l ~/.config/fractalbot/config.yaml

curl -sf http://127.0.0.1:27890/health
curl -sf http://127.0.0.1:27890/status
```

如果要补齐当前 token 可见的 Slack API-visible 事实边界，还可以执行：

```bash
python3 .claude/skills/slack-workspace-inspector/scripts/slack_workspace_inspector.py list --limit 200
python3 .claude/skills/slack-workspace-inspector/scripts/slack_workspace_inspector.py info --channel D0ACSGK4JE8
python3 .claude/skills/slack-workspace-inspector/scripts/slack_workspace_inspector.py info --channel C0A8CA14KNE
python3 .claude/skills/slack-workspace-inspector/scripts/slack_workspace_inspector.py history --channel D0ACSGK4JE8 --limit 6
```

这些命令组合起来可以证明：

- binary / config 存在
- gateway 活着
- Slack channel 处于 enabled/running 状态
- 当前 token 绑定在目标 Slack workspace
- 目标 DM / 公共频道对当前 token 可见
- 真实 DM 中的人类消息与 bot 回复可被当前 token 读取

但它们仍**不能替代**：

- Slack App 创建过程正确
- token 来源与安装流程正确
- Slack Admin 页面中的 OAuth / Socket Mode / Installed-to-Workspace artifact
- Slack 客户端里的截图式验收画面

## 当前不应伪造的部分

以下内容目前不能写成“已验证可复现步骤”，只能保留为待补证据项：

- 真实 Slack App 创建流程的逐步截图或录屏
- Bot Token / App Token 的获取与安装后验证过程
- Slack 客户端中可见的 DM / channel / thread 往返截图

## 建议的最终案例结构

等证据补齐后，本页应扩展为以下结构：

1. 目标
2. 前提条件
3. Slack App 创建
4. fractalbot 配置
5. 启动 gateway
6. 验证 health/status
7. 入站消息验证（Slack → gateway → Agent）
8. 出站消息验证（Agent / CLI → gateway → Slack）
9. thread 路由验证
10. 常见故障与排查

当前阶段已经完成了第 1、2、5、6 的“本机可证明部分”，并通过本地证据包 + Slack API-visible audit 覆盖了第 7、8、9 的技术事实。当前真正还缺的，不再是消息链路能否跑通，而是第 3、4 对应的 Slack App admin artifact 与 Slack 客户端截图验收。

## 当前验收边界

### 技术事实层：已证明

当前 run 已经在本机上证明了以下链路：

1. binary / config 存在且路径正确
2. gateway health 正常，Slack channel 处于 enabled/running
3. redacted config 可证明 Slack token 字段、allowlist、workspace 绑定、`defaultAgent=main`
4. Slack 入站消息已被授权并路由到目标 workspace / `main`
5. 出站回复已成功发回 DM
6. thread 回复已携带正确 `thread_ts` 发回原 thread
7. Slack API-visible surfaces 已证明 live token 归属、目标 DM / 频道可见、真实 DM reply 可见、至少 1 条真实 thread reply 可见
8. fresh QA review 已明确将 Case 2 归类为 technically closed；不再存在剩余技术 blocker

对应证据包：

- `/Users/sulabs_001/agent-worktrees/oh-my-openclaw-coder-a/artifacts/okr5-kr3-case2-20260315-025655/00-acceptance-ready-bundle.md`
- `/Users/sulabs_001/agent-worktrees/oh-my-openclaw-coder-a/workspace/heartbeat-okr5-case2-slack-api-gap-audit-20260320.md`
- `/Users/sulabs_001/agent-worktrees/oh-my-openclaw-qa/workspace/heartbeat-okr5-case2-audit-review-20260320.md`

### Slack 侧人工 / Admin artifact acceptance：如验收仍要求

如果 reviewer 仍坚持以 Slack UI / admin clean-room capture 作为最终 artifact 形态，那么这个案例还差 Slack 侧的人为截图 / 管理台记录：

1. Slack App 创建 / 安装 / OAuth 或 Socket Mode 配置记录
2. Slack 客户端中可见的 inbound DM 或 thread 消息，以及同一对话中的 bot reply 截图

## 证据采集清单

clean-room 复现时，至少采集以下证据：

- 终端输出：`ls -l ~/.local/bin/fractalbot ~/.config/fractalbot/config.yaml`
- 终端输出：redacted 后的 `config.yaml` 关键片段，只保留 `slack.enabled`、`allowedUsers`、`allowedChannels`、`defaultAgent`、workspace 绑定
- 终端输出：fractalbot 启动日志，包含 Slack channel 启动成功或连接成功信息
- 终端输出：`curl -sf http://127.0.0.1:27890/health`
- 终端输出：`curl -sf http://127.0.0.1:27890/status`
- 终端输出：Slack API-visible 只读验证结果，例如 `auth.test`、`conversations.list` / `info` / `history` / `replies`
- Slack 客户端截图：发送一条 DM 或 channel 消息到 bot
- 终端输出：对应时间点的 gateway / fractalbot 入站日志
- 终端输出：对应时间点的 `agent-manager` / main session 收到任务或消息的日志
- Slack 客户端截图：Agent 回复成功回到 DM 或频道
- 终端输出：对应时间点的出站发送成功日志
- Slack 客户端截图：至少一条 thread reply 成功回到原 thread
- 终端输出：一次完整 clean-room 执行记录，按时间顺序串起配置、启动、health、入站、路由、出站、thread 验证

其中，当前 run 已完成上面的本地终端证据与 Slack API-visible 技术证据；如果验收仍要求 screenshot/admin artifact 形态，仍需补采的是以下 Slack 侧人工 / Admin 证据：

- 截图：Slack App 基本信息页，证明使用的是目标 App
- 截图：Slack OAuth / Socket Mode 配置页，证明 Bot Token 与 App-Level Token 已生成
- 截图：Slack App 已安装到目标 Workspace
- Slack 客户端截图：发送一条 DM 或 channel 消息到 bot
- Slack 客户端截图：Agent 回复成功回到 DM 或频道
- Slack 客户端截图：至少一条 thread reply 成功回到原 thread

## 参考路径

文档路径：

- `docs/operations/messaging.md`
- `docs/cases/deploy-dev-agent.md`

当前 workspace 证据来源：

- `TOOLS.md`
- `okr/archived/fractalbot-setup.md`
- `okr/archived/fractalbot-slack-channel.md`
- `okr/archived/use-fractalbot-slack.md`
- `memory/2026-03-01.md`
- `memory/2026-03-13.md`
- `/Users/sulabs_001/agent-worktrees/oh-my-openclaw-coder-a/artifacts/okr5-kr3-case2-20260315-025655/`
- `/Users/sulabs_001/agent-worktrees/oh-my-openclaw-coder-a/workspace/heartbeat-okr5-case2-slack-api-gap-audit-20260320.md`
- `/Users/sulabs_001/agent-worktrees/oh-my-openclaw-qa/workspace/heartbeat-okr5-case2-audit-review-20260320.md`

当前机器上的本地运行路径：

- `~/.local/bin/fractalbot`
- `~/.config/fractalbot/config.yaml`
