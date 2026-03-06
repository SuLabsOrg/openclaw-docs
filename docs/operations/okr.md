# OKR 驱动工作流

OKR (Objectives and Key Results) 是 AI 员工的目标管理系统。每次心跳读取 OKR.md，按优先级推进当前 KR。

## OKR.md 结构

```markdown
### OKR-3: Deliver Gasless Transactions (2026-03) — ACTIVE 🔴 P0

**Owner**: main

#### Objective
Deploy self-hosted AA Provider and complete E2E gasless transaction.

#### Success Criteria
**Complete 1 gasless UserOperation on BSC Testnet**

#### Key Results

> **Dependency order**: KR1 → KR2 → KR3

**KR1: 部署 Bundler** — ✅ COMPLETE
- Deliverable: Bundler health check passed
- Verification: eth_supportedEntryPoints 返回地址

**KR2: 部署 Paymaster** — IN PROGRESS
- Deliverable: Paymaster 合约部署
- Verification: 合约地址可查

**KR3: E2E 验证** — PENDING
- Deliverable: 1 笔 gasless tx confirmed
- Verification: BSCScan 可查
```

## OKR 必须包含

每个 OKR 必须有以下要素：

| 要素 | 说明 | 示例 |
|------|------|------|
| Objective | 动词开头，描述结果 | "Complete orderbook development" |
| Success Criteria | 量化、可验证 | "1 gasless tx on TestNet" |
| Key Results | 有依赖顺序 | KR1 → KR2 → KR3 |
| Priority | P0/P1/P2 | 🔴 P0 |
| Owner | 谁负责 | main |

每个 KR 必须有：
- **Status**: PENDING / IN PROGRESS / ✅ COMPLETE
- **Deliverable**: 具体产出
- **Verification**: 如何证明完成

## 优先级

| 级别 | 标记 | 含义 |
|------|------|------|
| P0 | 🔴 | 必须做，阻塞一切 |
| P1 | 🟡 | 重要，本周完成 |
| P2 | 🟢 | 有空再做 |

## 心跳中的 OKR 推进

每次心跳：

1. 读 OKR.md
2. 找到当前 ACTIVE OKR 中最高优先级的 IN PROGRESS KR
3. 执行一步推进动作
4. 更新 KR 状态

```
心跳 → 读 OKR → 找到 P0 KR2 IN PROGRESS
  → 检查 CI 状态 → CI green
  → 分配 QA review → 更新 KR2 状态
```

## 状态流转

```
PENDING → IN PROGRESS → ✅ COMPLETE
                ↓
            BLOCKED (标注原因)
```

## 完成后归档

OKR 全部 KR 完成后：

1. 标记为 `✅ ACHIEVED`
2. 移到 `## ARCHIVED OKRs` 段
3. 或迁移到 `okr/archived/` 目录

## 常见反模式

- **模糊的完成标准**: "优化性能" → 应量化 "延迟 < 500ms"
- **没有验证方式**: KR 完成了但不知道怎么证明
- **KR 太大**: 单个 KR 包含多个独立工作 → 拆分
- **被动语态**: "等待部署" → 改为 "触发部署"
