# 习惯模块

> 习惯打卡独立页面（`pages/habit/habit`），底部 Tab 第二个入口。

## 子任务

### 1. 页面脚手架

- [ ] 1.1 创建 `pages/habit/` 页面文件（habit.wxml + habit.wxss + habit.js + habit.json）
- [ ] 1.2 在 habit.json 中注册使用的组件：`habit-card`、`progress-bar`
- [ ] 1.3 初始化页面 data：`habits: []`、`todayCheckins: {}`（key=habit_id, value=boolean）、`today: string`

### 2. 习惯列表

- [ ] 2.1 页面 `onShow` 时加载所有习惯（`habits.where().get()`）
- [ ] 2.2 同时查询今日所有打卡记录（`checkins.where({ date: today }).get()`），构建 `todayCheckins` map
- [ ] 2.3 使用 `wx:for` 渲染习惯列表，每个习惯使用 `<habit-card>` 组件
- [ ] 2.4 空态处理：无习惯时显示"还没有习惯，点击 + 添加第一个吧"

### 3. 新建习惯

- [ ] 3.1 底部/右下角 `+` 按钮
- [ ] 3.2 点击后弹出新建弹窗（黑色底色，白色输入框，只有一个"习惯名称"字段）
- [ ] 3.3 名称非空校验
- [ ] 3.4 确认后调用 `habits.add({ data: { name, streak: 0, best_streak: 0 } })`
- [ ] 3.5 成功后 toast "已添加"，刷新列表

### 4. 编辑习惯

- [ ] 4.1 监听 habit-card 的 `longpress` 事件
- [ ] 4.2 弹出编辑弹窗（预填习惯名称）
- [ ] 4.3 确认后调用 `habits.doc(id).update({ data: { name } })`
- [ ] 4.4 成功后 toast "已更新"，刷新列表

### 5. 删除习惯

- [ ] 5.1 监听 habit-card 的 `swipeleft` 事件
- [ ] 5.2 `wx.showModal` 确认："确定删除习惯「习惯名称」？"
- [ ] 5.3 确认后调用 `habits.doc(id).remove()`
- [ ] 5.4 同时删除该习惯相关的所有 checkins 记录（`checkins.where({ habit_id: id }).remove()`）
- [ ] 5.5 成功后 toast "已删除"，刷新列表

### 6. 今日打卡

- [ ] 6.1 监听 habit-card 的 `check` 事件
- [ ] 6.2 **打卡**（今日未打卡→已打卡）：在 `checkins` 中新增一条记录 `{ habit_id, date: today }`
- [ ] 6.3 调用云函数 `habitFunctions` 的 `updateStreak` 更新 streak 和 best_streak
- [ ] 6.4 **取消打卡**（今日已打卡→未打卡）：删除对应的 checkins 记录
- [ ] 6.5 调用云函数 `habitFunctions` 的 `updateStreak` 重新计算 streak
- [ ] 6.6 操作后 UI 即时更新（勾选状态、连续天数），无需等待云函数返回

### 7. 进度条

- [ ] 7.1 顶部嵌入 `<progress-bar>` 组件
- [ ] 7.2 计算 `done` = 今日已打卡习惯数（`todayCheckins` 中 value=true 的数量）
- [ ] 7.3 计算 `total` = 所有习惯总数
- [ ] 7.4 每日刷新时自动更新

### 8. 连续天数显示

- [ ] 8.1 habit-card 中显示 `streak`（当前连续天数）+ 🔥 图标
- [ ] 8.2 如果 `streak == 0`，不显示火焰和数字
- [ ] 8.3 如果 `streak >= best_streak && streak > 0`，显示"新纪录！"标记
