# Agent 生命周期

使用 `agent-manager` 管理 AI 员工的完整生命周期。

## CLI 速查

```bash
CLI="python3 .claude/skills/agent-manager/scripts/main.py"

$CLI list                      # 列出所有 Agent
$CLI start dev                 # 启动
$CLI stop dev                  # 停止
$CLI status dev                # 状态
$CLI monitor dev --follow      # 实时监控
$CLI send dev "消息"            # 发送消息
$CLI assign dev <<EOF          # 分配任务
实现用户登录功能
EOF
```

## 启动

```bash
$CLI start dev
```

效果：
1. 解析 `agents/EMP_XXXX.md` 的 frontmatter
2. 创建 tmux 会话 `agent-{name}`
3. 注入 skills 作为系统提示
4. 启动 launcher

::: warning 注意
每个 Agent 只能运行一个实例。重复启动会被拒绝。
:::

## 停止

```bash
$CLI stop dev
```

## 监控

```bash
$CLI monitor dev              # 最近 100 行
$CLI monitor dev -n 500       # 最近 500 行
$CLI monitor dev --follow     # 实时 (Ctrl+C 退出)
```

## 发送消息

```bash
$CLI send dev "请运行测试"
```

## 分配任务

```bash
$CLI assign dev <<EOF
🎯 Task: 修复登录 bug

1. 复现问题
2. 定位根因
3. 实现修复
4. 添加测试
EOF
```

`assign` 会自动启动未运行的 Agent。

## 列出所有 Agent

```bash
$CLI list              # 所有
$CLI list --running    # 只看运行中
```

输出：
```
📋 Agents:
✅ Running dev (session: agent-dev)
⭕ Stopped qa
⛔ Disabled old-dev
```

## 直接操作 tmux

```bash
tmux attach -t agent-dev       # 连接会话 (Ctrl+b, d 退出)
tmux capture-pane -p -t agent-dev -S -100  # 捕获输出
tmux ls | grep ^agent-         # 列出会话
```

## 日常工作流

```bash
# 早上：启动
$CLI start coder-a
$CLI start coder-b

# 分配任务
$CLI assign coder-a <<EOF
实现用户资料页面
EOF

# 监控
$CLI monitor coder-a --follow

# 补充说明
$CLI send coder-a "请加上邮箱格式校验"

# 晚上：停止
$CLI stop coder-a
$CLI stop coder-b
```
