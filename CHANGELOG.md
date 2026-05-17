# LearnLab 更新日志

## v1.2.0 (2026-05-17)

### 新增

- **深色极简风主题**：全局 Dark Minimal 风格，Teal/Cyan 科技感配色（`#14b8a6`），深绿黑底色（`#080c0c`）
- **双主题切换**：「我的」页面新增深色模式开关，支持深色/浅色一键切换，主题偏好持久化存储
- **全局动画体系**：卡片入场淡入、弹窗底部滑入、按钮按压反馈、进度条渐变填充、主题切换 300ms 过渡
- **设计 Token 体系**：56 个语义化 CSS 变量，覆盖颜色/阴影/间距/圆角/字号，双主题映射

### 优化

- 卡片层级：深色下用边框（`1px solid`）替代阴影区分层级，浅色下柔和阴影
- 间距体系：页面左右内边距 16→20rpx，列表项间距 12→14rpx，页面底部留白 120→140rpx
- 字号扩展：新增 `--font-xs`（20rpx）、`--font-xl` 36→38rpx、`--font-xxl`（48rpx）
- 圆角微调：`--radius-md` 12→14rpx，`--radius-lg` 16→18rpx
- 任务完成态：左侧 3rpx teal 细线 + 降低透明度 + 文字划线
- 进度条：高度 16→20rpx，teal 渐变填充（`#0d9488` → `#2dd4bf`）
- 习惯打卡框、统计数字统一 teal 色系

### 改动文件

| 文件 | 改动 |
|------|------|
| `miniprogram/app.wxss` | 重写 token 体系（深色默认 + `.theme-light` 覆盖），新增动画 |
| `miniprogram/app.js` | `onLaunch` 读取主题偏好到 globalData |
| `miniprogram/app.json` | 导航栏、Tab 栏、背景色更新为 teal 色系 |
| `components/task-card/task-card.wxss` | 色值替换 + 边框 + 完成态优化 + 按压反馈 |
| `components/task-modal/task-modal.wxss` | 硬编码色值 → token + 弹窗动画 |
| `components/habit-card/habit-card.wxss` | 色值替换 + 打卡框 teal 色 + streak 统一 |
| `components/calendar/calendar.wxss` | 色值替换 + 选中日期边框 |
| `components/progress-bar/progress-bar.wxss` | 高度 + teal 渐变 |
| `components/stats-cards/stats-cards.wxss` | 硬编码色值 → token + 统计数字统一 |
| `pages/index/index.wxss` | 色值替换 + 边框 + 间距 |
| `pages/habit/habit.wxss` | 硬编码 `#666` → token + 间距 |
| `pages/mine/mine.wxss` | 硬编码 `#f5f5f5` → token + 菜单文字色 |
| `pages/index/index.js` | `onShow` 读取主题，设置 page 级 CSS 变量 |
| `pages/habit/habit.js` | `onShow` 读取主题，设置 page 级 CSS 变量 |
| `pages/mine/mine.js` | 新增 `onThemeToggle` + `onShow` 主题逻辑 |
| `pages/mine/mine.wxml` | 新增深色模式开关行 |
| `pages/index/index.wxml` | 根视图绑定 `themeClass` |
| `pages/habit/habit.wxml` | 根视图绑定 `themeClass` |

### 测试

138 个测试用例全部通过（16 套件）。

---

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
