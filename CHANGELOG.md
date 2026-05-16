# LearnLab 更新日志

## v1.1.0 (2026-05-16)

### 新增

- 已完成任务点击后进入**只读查看模式**：弹窗标题显示「查看任务」，所有字段置灰不可编辑，按钮为「关闭」
- 任务完成/取消完成增加**确认弹窗**：点击圆圈后弹出「确定完成任务…？」或「确定取消…？」确认框，防止误触

### 修复

- 编辑任务保存后**不再创建重复任务**：使用独立 `editingTaskId` 字段精确判断更新/新建路径，避免对象引用丢失导致误走 `add()` 分支
- 习惯打卡**支持取消打卡**：已打卡的习惯再次点击可取消打卡记录，streak 自动重算
- task-modal 时间选择器在只读模式下**已禁止交互**（JS 层守卫）

### 改动文件

| 文件 | 改动 |
|------|------|
| `components/task-modal/task-modal.js` | 新增 `readonly` 属性，4 个方法加只读守卫 |
| `components/task-modal/task-modal.wxml` | 动态标题/按钮，输入框 `disabled` 绑定 |
| `pages/index/index.js` | 新增 `editingTaskId` 字段，`onTaskCircleTap` 加确认弹窗 |
| `pages/index/index.wxml` | `task-modal` 传递 `readonly` 属性 |
| `pages/habit/habit.js` | `onHabitCheck` 改为 toggle 模式（打卡/取消打卡） |
| `__tests__/components/task-modal.test.js` | +3 只读模式测试 |
| `__tests__/pages/index.test.js` | +7 确认弹窗 + editingTaskId 测试 |
| `__tests__/pages/habit.test.js` | +3 打卡 toggle 测试 |

### 测试

138 个测试用例全部通过（16 套件）。

---

## v1.0.0 (2026-05-15)

首个版本发布：每日任务管理、习惯打卡、日历视图、统计面板、数据导出。
