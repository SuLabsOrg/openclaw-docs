# Heartbeat 机制

Heartbeat（心跳）是 AI 员工自主运行的核心驱动。通过 cron 定期触发，AI 员工主动检查任务、推进工作、汇报进度。

## 工作原理

```
cron 触发 (每 N 分钟)
  ↓
agent-manager heartbeat run EMP_XXXX
  ↓
发送标准心跳消息到 Agent
  ↓
Agent 读 HEARTBEAT.md → 执行任务 → 回复结果
  ↓
无事可做 → 回复 HEARTBEAT_OK
```

## 配置

在 Agent frontmatter 中：

```yaml
heartbeat:
  cron: "*/30 * * * *"      # 每 30 分钟
  max_runtime: 5m            # 最长运行 5 分钟
  session_mode: auto         # 会话模式
  enabled: true
```

### session_mode

| 模式 | 行为 |
|------|------|
| `restore` | 恢复已有会话 (默认) |
| `auto` | 上下文不足 25% 时自动滚动 |
| `fresh` | 每次新建会话 |

## 编写 HEARTBEAT.md

```markdown
# HEARTBEAT.md

## 心跳流程

1. 读 OKR.md — 确认每个 OKR 当前卡在哪个 KR
2. 检查进度:
   - gh issue list / gh pr list 查状态
   - tmux capture-pane 查 Agent 在做什么
3. 推进一步:
   - PR 等 QA → 分配 QA Agent
   - QA PASS → 通知 merge
   - Agent idle → assign 下一个任务
4. 更新 OKR.md
5. 发通知摘要

## 自主权原则
- 不动钱、不上线、不公开 → 自己干
- PR 合并 + 测试环境 → 自主决策
- 生产环境 → 找老板审批
```

## 同步 cron

```bash
CLI="python3 .claude/skills/agent-manager/scripts/main.py"

# 预览
$CLI heartbeat sync --dry-run

# 应用
$CLI heartbeat sync
```

## 手动触发

```bash
$CLI heartbeat run EMP_0001
$CLI heartbeat run EMP_0001 --timeout 1m
```

## 状态追踪

`memory/heartbeat-state.json`：

```json
{
  "lastChecks": {
    "email": null,
    "calendar": null
  },
  "lastPostmortem": 1772757660,
  "openPRs": [
    {"repo": "SuLabsOrg/CloudBank", "number": 123}
  ]
}
```

## 审计日志

```bash
$CLI heartbeat trace --agent EMP_0001
$CLI heartbeat slo --window daily
```

## 实践建议

1. **主 Agent 10-30 分钟心跳**，足够及时又不浪费 tokens
2. **执行 Agent 通常不需要心跳**，靠主 Agent 分配任务
3. **HEARTBEAT_OK 很重要** — 没事做时回复这个，避免无意义操作
4. **每日复盘** — 每天第一次心跳检查异常
5. **别在心跳里做重活** — 心跳是"检查+推一步"，不是"完成整个任务"
