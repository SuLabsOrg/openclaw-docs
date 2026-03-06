# 多 Agent 协作

多个 AI 员工协作完成复杂任务：supervisor 协调，coder 执行，QA 验证。

## 协作模式

```
Supervisor (main)
  ├── 读 OKR → 识别任务
  ├── assign → coder-a (开发)
  ├── assign → coder-b (开发)
  ├── monitor → 检查进度
  ├── assign → qa (验证)
  └── 汇报 → Slack
```

### 角色分工

| 角色 | 职责 | 心跳 |
|------|------|------|
| Supervisor (main) | 读 OKR、分配任务、检查进度、汇报 | ✅ 每 10 min |
| Coder-A | 写代码、提 PR | ❌ 被动接收 |
| Coder-B | 写代码、提 PR | ❌ 被动接收 |
| QA | Review PR、运行测试 | ❌ 被动接收 |
| Researcher | 调研、出报告 | ❌ 被动接收 |

::: tip 核心原则
只有 Supervisor 有心跳。执行者 (coder/qa) 靠 Supervisor 分配任务。
:::

## 任务流转

### Dev → QA 闭环

```
1. Supervisor 分配任务给 coder-a
   $CLI assign coder-a <<EOF
   实现用户登录功能
   EOF

2. Coder-a 完成 → 提交 PR → 输出 handoff note

3. Supervisor 心跳检查 → 发现 PR 待 review
   → 分配给 QA
   $CLI assign qa <<EOF
   Review PR #123: 用户登录功能
   EOF

4. QA review
   → PASS: Supervisor merge PR
   → FAIL: Supervisor 转发失败原因给 coder-a 修复

5. 循环直到 QA PASS + merged
```

### Supervisor 心跳中的多 Agent 管理

```markdown
# HEARTBEAT.md (Supervisor)

## 心跳流程

1. 读 OKR.md
2. 检查每个 Agent 状态:
   - tmux capture-pane -t agent-coder-a
   - tmux capture-pane -t agent-coder-b
3. 推进:
   - Agent idle → assign 下一个任务
   - Agent 完成 → 检查交付物
   - PR 等 QA → 分配 QA
   - QA PASS → merge
```

## 配置多个 Agent

```
agents/
├── EMP_0001.md   ← researcher
├── EMP_0002.md   ← coder-a
├── EMP_0003.md   ← coder-b
├── EMP_0004.md   ← qa (可选)
└── EMP_0005.md   ← sre (可选)
```

### 启动所有 Agent

```bash
CLI="python3 .claude/skills/agent-manager/scripts/main.py"

$CLI start coder-a
$CLI start coder-b
$CLI start researcher

# 验证
$CLI list --running
```

## Supervisor 分配任务示例

```bash
# 给 coder-a 分配功能开发
$CLI assign coder-a <<EOF
🎯 Task: 实现 USDC approve 功能

Issue: #123
Branch: feat/usdc-approve

1. 添加 approve API endpoint
2. 前端调用
3. 写测试
4. 提 PR 到 main

完成后回复 handoff note。
EOF

# 给 researcher 分配调研
$CLI assign researcher <<EOF
🎯 Task: 调研 ERC-4337 paymaster 方案

比较:
1. 自托管 vs NodeReal vs Pimlico
2. 成本、延迟、可靠性

输出: 对比表 + 推荐方案
EOF
```

## 实践建议

1. **Supervisor 不亲自写代码** — 协调 > 执行
2. **任务描述要具体** — 包含 Issue 编号、分支名、具体步骤
3. **检查 Agent 输出** — `monitor` 命令查看 Agent 在做什么
4. **一个 Agent 一个任务** — 不要同时给一个 Agent 多个任务
5. **idle 就分配** — Agent 空闲超过 2 小时就该有新任务
