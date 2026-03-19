# 部署 Dev Agent

::: warning Draft
这是一个可评审的证据优先草稿，不是最终验收稿。

当前页面只做两件事：

- 定义“从空白 workspace 部署最小 Dev Agent”的目标闭环
- 明确每一步还需要补什么 clean-room 证据

它**不声称**本文命令已经在一个全新 workspace 中按顺序重跑并全部通过，因此不会伪造样例输出。
:::

## 案例目标

从零创建一个 OpenClaw workspace，并完成一个最小 Dev Agent 的部署闭环：

1. 创建 workspace 基础文件
2. 创建 Agent 配置
3. 安装并检查 `agent-manager`
4. 启动 Dev Agent
5. 验证 tmux 会话已创建
6. 手动触发一次 heartbeat
7. 确认 Agent 能读取 `HEARTBEAT.md` 并返回结果

## 当前评审边界

当前版本可以评审的内容：

- 步骤顺序是否完整
- 命令路径是否与现有文档一致
- 验收口径是否清楚
- clean-room 证据缺口是否定义准确
- 显式 source 的 official installer 路径是否已经有足够的 clean-room evidence 支撑 `install / doctor / start / status / list --running`

当前版本**不能**宣称的内容：

- 已完成一次按本文显式 source installer 路径、从 install 一直到 heartbeat 的单条顺序链路实跑
- 已拿到**同一条官方 installer 顺序链路上**首次 `heartbeat run` 的成功输出
- 已证明每个最小 workspace 都一定会生成 `memory/heartbeat-state.json`

## 当前 clean-room 证据状态

截至目前，已经拿到三组互补的 clean-room evidence pack：

- `okr5-kr3-case1-20260319-075301`
  - 已证明：空白 workspace 初始化、最小上下文文件、`agents/EMP_0001.md`、工具链预检
  - 首个真实阻塞：当前机器上 `npx` 不在 `PATH`，因此那一轮连 official installer 路径都无法开始
- `okr5-kr3-case1-actual-tools-20260319-083511`
  - bootstrap 路径：vendored `.claude/skills/agent-manager` bundle + `launcher: codex`
  - 已跑通：`doctor`、`start dev`、`status dev`、`list --running`、`tmux capture-pane`、手动 `heartbeat run`、heartbeat 后 `status` / `monitor`
  - 已观察到的运行事实：
    - tmux dedicated session 名按 file ID 命名，例如 `agent-emp-0001`
    - `launcher: codex` 时，fresh workspace 里的 trust prompt 会先阻塞首次 heartbeat
    - 该次成功 runtime slice 中，`memory/heartbeat-state.json` 未生成
- `okr5-kr3-case1-official-installer-20260319-141411`
  - installer 路径：temp-only official Node runtime + explicit local-path openskills source
  - 已跑通：`npx --yes openskills install /Users/sulabs_001/oh-my-openclaw/.claude/skills/agent-manager`、`doctor`、fresh `start dev`、`status dev`、`list --running`
  - 证据读取口径：
    - `02-official-installer-chain.log` 证明 explicit-source install 本身成功
    - `03-post-install-followup.log` 与 `05-fresh-start-after-cleanup.log` 提供纠正后的 `doctor / start / status / list --running` 证据

因此，本页当前已经同时具备：

- 本机实际可用工具链下的最小运行闭环 evidence
- 显式 source 的 official installer evidence

Case 1 已不再是当前 `OKR-5 / KR3` 的 blocker；Case 2 当前也已无剩余技术 blocker。若按整体验收口径，当前只剩 Slack client / admin clean-room artifact acceptance。

## 适用场景

适用于以下需求：

- 团队第一次引入 OpenClaw，需要先验证“最小 Agent 能否跑起来”
- 新成员需要理解 `agent-manager + tmux + heartbeat` 的最小闭环
- 在引入多 Agent 之前，先沉淀一个单 Agent 的可复用部署案例

## 前提条件

以下前提是执行本案例所需的操作要求，不是当前页面已经证明完成的事项：

- Node.js >= 22，且 `npm` / `npx` 可用
- Python 3
- tmux
- Git
- 可用的 launcher CLI
  - 例如 Codex CLI
  - 或 Claude CLI
  - 下文示例里的 `launcher` 必须改成你机器上实际存在的 CLI，不要照抄一个本机不存在的 launcher
- 当前环境允许启动本地 tmux session

## 命令约定

本文沿用当前 docs 基线，使用 `.claude/skills/agent-manager/` 作为安装路径：

```bash
CLI="python3 .claude/skills/agent-manager/scripts/main.py"
```

如果你的环境把 skill 安装在 `.agent/skills/agent-manager/`，只需要统一替换 `CLI` 路径，不要混用两套路径。

## 运行边界：手动 heartbeat vs cron

这个案例的**最小闭环**只要求成功执行一次手动 heartbeat：

```bash
$CLI heartbeat run EMP_0001 --timeout 1m
```

`heartbeat sync` 属于“把 heartbeat 安装到系统调度器”的扩展路径，不是最小闭环的硬前提。

当前页面里的 `heartbeat sync` 示例只覆盖 **system crontab** 路径，因此在执行前需要满足以下前提：

- 主机存在可用的 `crontab` 命令
- 当前用户可读取并写入该主机的 crontab
- 本轮验收范围确实包含“周期 heartbeat 已安装”这件事

如果环境里 `crontab` 不可用、不可写，或被系统策略拦截，那么本页仍可在“手动 heartbeat 闭环”范围内评审；但此时**不能**顺带宣称 cron 已配置完成。

如果你的环境使用 `launchd` 或其他调度后端，那是另一条部署路径；当前这个案例页不把它写成已覆盖事实。

## 最小闭环步骤

下面的步骤是**目标执行路径**。只有补齐每一步下方列出的 clean-room 证据后，本页才可以从草稿转为最终验收稿。

### Step 1: 初始化 workspace

创建空白目录并准备核心文件：

```bash
mkdir my-ai-team && cd my-ai-team
git init
touch AGENTS.md SOUL.md USER.md HEARTBEAT.md OKR.md
mkdir -p agents memory scripts
```

最小目录结构如下：

```text
my-ai-team/
├── AGENTS.md
├── SOUL.md
├── USER.md
├── HEARTBEAT.md
├── OKR.md
├── agents/
├── memory/
└── scripts/
```

预期结果：

- 空白 git 仓库已初始化
- 核心文件和目录已存在

本步对应的 clean-room 证据：

- 新建目录后的终端输出
- 顶层目录结构的终端输出

### Step 2: 写入最小上下文文件

这一步需要先把“哪些文件会被哪个运行阶段消费”写清楚，避免把推荐上下文误写成命令级硬依赖。

在这个最小案例里：

- `SOUL.md`：**启动时上下文**
  - 不由 `agent-manager` 命令自动读取
  - 只有当 Agent 自身 contract 明确要求“session start 先读 `SOUL.md`”时，才属于运行时输入
- `USER.md`：**启动时上下文**
  - 同样不由 `agent-manager` 命令自动读取
  - 只有当 Agent contract 明确要求“session start 先读 `USER.md`”时，才属于运行时输入
- `HEARTBEAT.md`：**heartbeat 执行上下文**
  - `heartbeat run` 的目标就是让 Agent 读取它并执行其中定义的检查 / 推进一步动作
- `OKR.md`：**任务决策上下文**
  - 是否读取它，取决于 `HEARTBEAT.md` 或 Agent contract 是否明确要求

下面的最小 Agent 示例会把这个 contract 写进 `agents/EMP_0001.md`：`SOUL.md` / `USER.md` 在 session start 读取一次，`HEARTBEAT.md` / `OKR.md` 在 heartbeat 或任务执行时读取。

### `SOUL.md`

```md
# SOUL.md

你是团队的 AI 软件工程师。

## 核心特质
- 直接、务实、高效
- 写代码前先理解需求
- 不确定时先澄清
```

### `USER.md`

```md
# USER.md

## 我的老板
- 名字: [你的名字]
- 偏好: 简洁汇报，不要废话
```

### `HEARTBEAT.md`

```md
# HEARTBEAT.md

1. 读 OKR.md
2. 检查当前最高优先级任务
3. 推进一步
4. 更新状态
5. 没事做就回复 HEARTBEAT_OK
```

### `OKR.md`

```md
# OKR

## ACTIVE OKRs

### OKR-1: 让第一个 Dev Agent 跑起来
- KR1: Agent 配置完成
- KR2: Agent 启动成功
- KR3: Heartbeat 手动触发成功
```

预期结果：

- 四个核心上下文文件已写入
- 这些文件的消费边界已经写清楚，不再把推荐上下文和 heartbeat 硬依赖混为一谈

本步对应的 clean-room 证据：

- 四个文件的关键片段
- 能证明这些文件来自新 workspace，而不是从现有仓库复制的终端记录
- 如果最终页面要声称 `SOUL.md` / `USER.md` 在运行时被实际消费，还需要后续 session start 日志或 pane 输出证明

### Step 3: 创建 Dev Agent 配置

下面的示例使用 `launcher: claude`。如果你的机器实际安装的是 `codex` 而不是 `claude`，应在这里先改成与本机一致的 launcher，再继续后续 `start dev` / `heartbeat run` 验证。

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
  enabled: true
---

# Dev Agent

## Startup contract
1. Session start 时先读 `SOUL.md`，建立身份、风格和边界
2. Session start 时再读 `USER.md`，建立汇报对象和沟通偏好
3. 收到 heartbeat 或任务时，读 `HEARTBEAT.md` 与 `OKR.md` 决定下一步

## Role
你是一个开发 Agent，负责写代码、修 bug、提 PR。

## 工作流程
1. 按上面的 startup contract 加载 workspace 上下文
2. 读 HEARTBEAT.md 获取当前任务
3. 检查 OKR.md 确认优先级
4. 执行任务，提交代码
5. 汇报进度
```

预期结果：

- `agents/EMP_0001.md` 已创建
- 该 Agent 可通过名字 `dev` 被 `agent-manager` 启动
- `SOUL.md` / `USER.md` 为什么属于运行 contract，已经由 Agent 自身 prompt 写清楚

本步对应的 clean-room 证据：

- `agents/EMP_0001.md` 的完整 frontmatter 片段
- 含 `Startup contract` 的正文片段
- 能证明配置文件在新 workspace 中可被正常解析的后续命令输出

### Step 4: 安装并检查 agent-manager

```bash
npx --yes openskills install /Users/sulabs_001/oh-my-openclaw/.claude/skills/agent-manager
$CLI doctor
```

这里不要再写 bare skill 名 `agent-manager`。当前 clean-room evidence 已证明：`openskills install` 需要明确 source；本页已验证通过的是本机 local path 形式。

预期结果：

- `agent-manager` 已安装到当前 workspace
- 显式 source 的 `npx --yes openskills install /Users/sulabs_001/oh-my-openclaw/.claude/skills/agent-manager` 这一步在当前机器上可执行
- `doctor` 能完成基础依赖检查
- 在正常通过路径下，`doctor` 以明确的通过结果结束；如果未通过，应先修复环境问题，再继续后续步骤

本步对应的 clean-room 证据：

- 显式 source 安装命令的输出
- 一次完整的 `doctor` 输出
- `doctor` 的最终结果行

### Step 5: 启动 Dev Agent

```bash
$CLI start dev
$CLI status dev
$CLI list --running
```

预期结果：

- `start dev` 成功创建运行中的 Agent 会话
- `status dev` 显示 Agent 处于运行态
- `list --running` 能看到 `dev`

本步对应的 clean-room 证据：

- 首次 `start dev` 的终端输出
- 首次 `status dev` 的终端输出
- 首次 `list --running` 的终端输出

### Step 6: 验证 tmux 会话

```bash
tmux ls | grep ^agent-
tmux capture-pane -p -t agent-emp-0001 -S -100
```

预期结果：

- `tmux ls` 中存在当前 Agent 的 dedicated session
  - 当前 `agent-manager` 运行时里，session 名一般按 file ID 命名，例如 `agent-emp-0001`
- `capture-pane` 能看到 launcher 已进入运行态，或至少已进入等待任务 / 接收输入的可用状态
- 如果使用 `launcher: codex`，在 fresh workspace 中要先确认 pane 没停在 “Do you trust the contents of this directory?” 之类的 trust prompt；只有清掉这个 prompt 后，后续 `send` / `heartbeat run` 才能算有效验证

本步对应的 clean-room 证据：

- `tmux ls` 输出中包含目标 Agent 的实际 session 名
- `tmux capture-pane` 的片段，证明 Agent 已成功进入工作循环

### Step 7: 手动触发 heartbeat（最小闭环必需）

执行前提：

- `status dev` 显示 Agent 处于 `idle` 或至少可接收输入的状态
- launcher pane 没有被 trust prompt、first-run prompt、模型选择 prompt 等前置交互卡住

```bash
$CLI heartbeat run EMP_0001 --timeout 1m
```

预期结果：

- 手动触发成功
- 如果当前 session 正在 `busy`，`auto` 模式下 heartbeat 可能会直接 `skip`，而不是排队再发
- Agent 读取 `HEARTBEAT.md` 并返回：
  - `HEARTBEAT_OK`，或
  - 一个明确的推进动作

本步对应的 clean-room 证据：

- `heartbeat run EMP_0001 --timeout 1m` 的输出

### Step 8: 可选同步 cron（只有当验收范围包含周期 heartbeat 时）

只有在你要证明“heartbeat 已安装到系统调度器”时，才执行这一步。

```bash
$CLI heartbeat sync --dry-run
$CLI heartbeat sync
```

执行前提：

- `doctor` 或等价环境检查已经证明 `crontab` 可用
- 当前机器允许当前用户写入 crontab
- 评审目标确实包含 cron 路径，而不只是单次手动 heartbeat

预期结果：

- `heartbeat sync --dry-run` 能预览将写入 crontab 的内容
- `heartbeat sync` 能成功把 heartbeat 同步到 system crontab

本步仍需补的 clean-room 证据：

- `heartbeat sync --dry-run` 的输出
- `heartbeat sync` 的输出
- 如要宣称 cron 已安装完成，还需要可核对的 crontab / scheduler 结果证据

### Step 9: 检查运行后状态

```bash
$CLI status dev
$CLI monitor dev -n 100

if [ -f memory/heartbeat-state.json ]; then
  cat memory/heartbeat-state.json
fi
```

重点检查：

- Agent 仍处于运行态
- `monitor` 中能看到最近一次 heartbeat 的处理结果
- `memory/heartbeat-state.json` 不是当前最小闭环的必然产物
  - 在 evidence pack `okr5-kr3-case1-actual-tools-20260319-083511` 里，heartbeat 成功后已明确观察到该文件缺失

本步对应的 clean-room 证据：

- heartbeat 之后再次执行的 `status dev` 输出
- `monitor dev -n 100` 的输出片段
- `memory/heartbeat-state.json` 的样例，或一条明确的“不生成该文件也属预期”的说明

## 当前是否可评审

可以评审，但评审目标应限定为：

- 这是一个合理的最小部署路径
- 命令与现有文档基线一致
- 验收口径和证据缺口已经写清楚
- 显式 source 的 official installer 路径已至少拿到一次 `install -> doctor -> start/status/list` 的 clean-room 证据
- 本机实际可用工具链下，已至少拿到一次 `doctor -> start -> heartbeat -> status/monitor` 的 clean-room runtime 证据

就 Case 1 而言，它目前已经不再被 official installer 证据卡住；如果把 `OKR-5 / KR3` 当作整体验收，当前主要剩余 gap 只是 Case 2 的 Slack client / admin clean-room artifact acceptance，而不是技术链路 blocker。

## 最终验收检查表

- [x] 已创建最小 workspace 结构，并保留终端输出
- [x] 已写入 `SOUL.md`、`USER.md`、`HEARTBEAT.md`、`OKR.md`，并保留关键片段
- [x] 已创建 `agents/EMP_0001.md`，并保留完整 frontmatter
- [x] `SOUL.md` / `USER.md` 的消费方式已由 Agent contract 明确写出，而不是靠暗示
- [x] 显式 source 的 `npx --yes openskills install /Users/sulabs_001/oh-my-openclaw/.claude/skills/agent-manager` 成功输出已采集
- [x] `doctor` 输出已采集，且结果清晰
- [x] `start dev` / `status dev` / `list --running` 输出已采集
- [x] `tmux ls` / `tmux capture-pane` 输出已采集
- [x] `heartbeat run EMP_0001 --timeout 1m` 输出已采集
- [x] heartbeat 之后的 `status dev` / `monitor dev -n 100` 输出已采集
- [ ] 如果页面要声称 cron 已安装，则 `heartbeat sync --dry-run` / `heartbeat sync` 与 scheduler 结果证据已采集
- [x] 如果生成了 `memory/heartbeat-state.json`，已保留样例；如果未生成，已明确说明原因
- [x] 页面中不再包含开放式占位符、伪造样例或未验证成功声明

## 仍缺的 clean-room 证据

### Case 1 当前状态

截至 `okr5-kr3-case1-official-installer-20260319-141411`，Case 1 已不再缺显式 source 的 official installer 证据：

1. 显式 source install 已成功
2. `doctor` 已成功
3. fresh `start dev` / `status dev` / `list --running` 已成功
4. 另有独立 runtime evidence pack 覆盖 `tmux capture-pane` / `heartbeat run` / post-heartbeat `status` / `monitor`

### 当前 `OKR-5 / KR3` 剩余 blocker

1. Case 2 已无剩余技术 blocker；若 reviewer 仍要求 clean-room artifact 形态，则还需 Slack client / admin clean-room artifacts：App 创建/安装记录，以及 Slack UI 中 DM / thread 往返截图
2. 如果要把本页再 polish 成单条“official installer -> heartbeat”顺序样例，可再补一轮把 install 与 heartbeat 串在同一条 clean-room 终端记录中；这属于 doc-polish follow-up，不再是当前 blocker
3. 如果要声称 `SOUL.md` / `USER.md` 已被 runtime 实际消费，还需要 session start 读取证据

### 如果还要额外宣称 cron 已安装，则另缺

1. `heartbeat sync --dry-run` 证据
2. `heartbeat sync` 成功证据
3. 能证明 crontab / scheduler 实际落地的结果证据

## 参考路径

- `docs/guide/getting-started.md`
- `docs/operations/workspace.md`
- `docs/operations/agent-lifecycle.md`
- `docs/operations/heartbeat.md`
