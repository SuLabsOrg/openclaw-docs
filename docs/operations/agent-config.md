# Agent 配置

每个 AI 员工对应一个 `agents/EMP_XXXX.md` 配置文件。

## Frontmatter 字段

```yaml
---
name: coder-a                         # Agent 标识符
role: developer                        # 角色描述
description: "coder-a — developer"     # Agent 描述
enabled: true                          # 是否启用 (默认 true)
working_directory: ${REPO_ROOT}        # 工作目录
launcher: claude                       # 启动器
launcher_args:                         # 启动器参数
  - --dangerously-skip-permissions
skills:                                # 技能列表
  - agent-manager
  - planning-with-files
heartbeat:                             # 心跳配置
  cron: "*/30 * * * *"
  max_runtime: 5m
  session_mode: auto
  enabled: true
---
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | ✅ | Agent 标识符，用于 CLI 命令 |
| `description` | string | ✅ | Agent 描述 |
| `enabled` | bool | | 默认 `true`，设为 `false` 禁用 |
| `working_directory` | string | ✅ | 工作目录，支持 `${REPO_ROOT}` |
| `launcher` | string | ✅ | `claude` / `codex` / 完整路径 |
| `launcher_args` | string[] | ✅ | 启动器参数 |
| `skills` | string[] | | 注入的技能列表 |
| `heartbeat` | object | | 心跳配置 |
| `schedules` | object[] | | 定时任务配置 |

### Launcher 选项

```yaml
# Claude Code
launcher: claude
launcher_args:
  - --dangerously-skip-permissions

# OpenAI Codex CLI
launcher: codex
launcher_args:
  - --model=gpt-5.3-codex
  - --dangerously-bypass-approvals-and-sandbox
```

## Markdown 正文

Frontmatter 之后是 Agent 的"岗位说明"：

```markdown
# CODER-A

Developer agent.

## Primary responsibilities
- Implement scoped features/fixes.
- Keep changes small, reviewable, and easy to validate.
- Provide evidence (commands run, test results).

## Deliverables
- PR-ready code changes with a short change log.
- Evidence: tests/lint/build run + results.
```

## 常见角色模板

### Supervisor / Main

```yaml
name: main
skills:
  - agent-manager
  - use-fractalbot
heartbeat:
  cron: "*/10 * * * *"
  session_mode: auto
```

职责：读 OKR → 检查进度 → 分配任务 → 汇报

### Developer (Coder)

```yaml
name: coder-a
role: developer
launcher: codex
launcher_args:
  - --model=gpt-5.3-codex
  - --dangerously-bypass-approvals-and-sandbox
```

职责：接收任务 → 写代码 → 提交 PR → 交给 QA

### Researcher

```yaml
name: researcher
role: researcher
```

职责：搜索 → 对比 → 给出结论 + 证据

## 禁用 Agent

```yaml
enabled: false  # Agent 不可启动，但配置保留
```
