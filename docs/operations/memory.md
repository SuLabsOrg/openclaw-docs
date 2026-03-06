# 记忆系统

AI 员工每次会话重新开始，没有内置的跨会话记忆。记忆系统通过文件弥补这个缺陷。

## 两层记忆架构

```
memory/
├── 2026-03-05.md          ← Daily Notes (原始日志)
├── 2026-03-06.md
├── heartbeat-state.json   ← 心跳状态
└── ...

MEMORY.md                  ← Long-term Memory (精炼记忆)
```

| | Daily Notes | MEMORY.md |
|---|---|---|
| 路径 | `memory/YYYY-MM-DD.md` | `MEMORY.md` (根目录) |
| 内容 | 每天的原始记录 | 精炼的长期记忆 |
| 类比 | 日记本 | 大脑长期记忆 |
| 加载时机 | 每次会话 (今天+昨天) | 仅主会话 |
| 安全性 | 所有会话可读 | 不暴露给群聊 |

## Daily Notes

每天自动创建，记录当天发生的事：

```markdown
# 2026-03-06

## 每日复盘

**CloudBank 开发类:**
- QA FAIL 未修复超过 24h: 无
- CI 连续失败 >3 次: 无

**通用:**
- OKR-3 KR5 ✅ COMPLETE — 链上确认

## 事件记录

### OKR-3 KR5 完成: E2E Gasless 交易链上确认

**时间**: 2026-03-06 00:27:46 UTC
**链上证据**: tx 0x1ed42be4...
**修复的 3 个 bug**: ...
```

### 写入规则

- 重要决策 → 记录
- 教训/经验 → 记录
- 完成的里程碑 → 记录
- 临时状态/正在进行的事 → 不记录

## MEMORY.md

精炼的长期记忆，像人的"大脑记忆"：

```markdown
# MEMORY.md - Long-Term Memory

## People
- Elliot (SulabsOrg founder): 偏好高信号、务实的更新

## Workflows / Tools
- Slack: 与 Elliot 沟通用简体中文
- GitHub: 用 gh CLI，不直接 push main

## Lessons / Reminders
- OKR 进度发送必须用 scripts/send-okr.sh
- 任务完成后必须立即通知 Slack
```

### 维护规则

- 定期 review daily notes → 提炼到 MEMORY.md
- 过时的信息 → 删除
- 不重复 AGENTS.md 里已有的规则
- 不存机密信息（除非明确要求）

## heartbeat-state.json

心跳状态追踪文件：

```json
{
  "lastChecks": {
    "email": null,
    "calendar": null,
    "weather": null
  },
  "lastPostmortem": 1772757660,
  "openPRs": [
    {"repo": "SuLabsOrg/CloudBank", "number": 123}
  ]
}
```

| 字段 | 用途 |
|------|------|
| `lastChecks` | 避免重复检查 |
| `lastPostmortem` | 每日复盘计时 |
| `openPRs` | PR 闭环追踪 |

## 实践建议

1. **"心里想的"必须写下来** — AI 没有持久记忆，"mental notes"不会留存
2. **Daily notes 要及时** — 事件发生时就记，不要等到最后
3. **MEMORY.md 要精炼** — 不是什么都放，只放跨会话有价值的信息
4. **定期清理** — 过时的 MEMORY.md 条目会误导未来的会话
