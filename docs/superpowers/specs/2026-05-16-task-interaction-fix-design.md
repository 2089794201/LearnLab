# 任务交互逻辑修复 — 设计文档

> 版本 1.0 · 2026-05-16 · 基于需求文档 [2026-05-16-learnlab-design.md](./2026-05-16-learnlab-design.md) · 基于概要设计 [learn-lab-design.md](./learn-lab-design.md)

## 一、背景

用户在使用中发现三个任务交互逻辑问题：

| # | 问题 | 根因 |
|---|------|------|
| 1 | 已完成任务点击后可编辑，保存后可能覆盖或产生异常 | `onTaskTap` 未判断 `completed` 状态 |
| 2 | 点击完成圆圈时易误触，直接写库无确认 | `onTaskCircleTap` 无确认弹窗 |
| 3 | 无法区分查看和编辑已生成任务 | 弹窗只有编辑模式，缺少查看模式 |

## 二、设计方案

### 方案选择：最小改动（方案 A）

不新增文件，不改页面结构，仅改动 4 个文件。

### 2.1 task-modal 组件：新增 `readonly` 模式

**文件：** `components/task-modal/task-modal.js`
- 新增 property: `readonly: { type: Boolean, value: false }`
- `onConfirm`: `readonly` 为 true 时触发 `cancel` 并 return
- `onPriorityTap`: `readonly` 为 true 时 return

**文件：** `components/task-modal/task-modal.wxml`
- 标题：`{{readonly ? '查看任务' : (task ? '编辑任务' : '添加任务')}}`
- 所有输入控件加 `disabled="{{readonly}}"`
- 底部按钮文字：`{{readonly ? '关闭' : '确认'}}`

**不改：** `task-modal.wxss`、`task-modal.json`

### 2.2 首页页面：完成确认 + 只读传递

**文件：** `pages/index/index.wxml`
- `task-modal` 标签加属性：`readonly="{{editingTask && editingTask.completed}}"`

**文件：** `pages/index/index.js`

`onTaskCircleTap` 重构流程：
```
1. 取 task = e.detail.task, newCompleted = !task.completed
2. 完成时: wx.showModal({ title:"确认操作", content:"确定完成任务「{name}」吗？" })
   取消时: wx.showModal({ title:"确认操作", content:"确定取消「{name}」的完成状态吗？" })
3. 确认 → update('tasks', _id, { completed: newCompleted }) → loadTasks()
4. 取消 → 无操作
```

`onTaskTap`、`onAddTap`、`onModalConfirm`、`onModalCancel` **不改**。

### 2.3 不改动的部分

- `task-card` 组件：零改动
- `utils/db.js`：零改动
- 习惯模块、统计模块、我的模块：零改动

## 三、改动汇总

| 文件 | 改动 | 行数估算 |
|------|------|---------|
| `components/task-modal/task-modal.js` | 加 `readonly` property + 2 个守卫 | ~5 行 |
| `components/task-modal/task-modal.wxml` | 标题/按钮动态文字，控件加 `disabled` | ~6 处 |
| `pages/index/index.wxml` | `task-modal` 加 `readonly` 属性 | 1 行 |
| `pages/index/index.js` | `onTaskCircleTap` 重构 | ~12 行 |

## 四、交互流程对比

### 修复前
```
未完成任务点击卡片 → 编辑弹窗 → 修改 → 确认 → update ✓
已完成任务点击卡片 → 编辑弹窗 → 修改 → 确认 → update（不应允许编辑）
点击圆圈 → 直接切换完成状态（易误触）
```

### 修复后
```
未完成任务点击卡片 → 编辑弹窗 → 修改 → 确认 → update ✓
已完成任务点击卡片 → 只读弹窗 → 查看 → 关闭（不触发 update）
点击圆圈 → 确认弹窗 → 确定/取消 → 确定才写库
```

## 五、测试要点

- 未完成任务点击卡片 → 弹出编辑弹窗，可修改，确认后更新
- 已完成任务点击卡片 → 弹出只读弹窗，所有字段不可编辑，按钮为「关闭」
- 新增任务 → 弹窗无 `readonly`，正常填写提交
- 点击未完成圆圈 → 弹确认「确定完成任务…？」→ 确定后完成
- 点击已完成圆圈 → 弹确认「确定取消…？」→ 确定后取消完成
- 确认弹窗点取消 → 状态不变
