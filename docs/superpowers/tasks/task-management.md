# 任务模块

> 任务 CRUD 与完成切换逻辑。本模块逻辑散布在首页中，无独立页面。与 [首页模块](./index-page.md) 配合开发。

## 子任务

### 1. 添加任务

- [ ] 1.1 实现 task-modal 表单数据收集：name、start_time、end_time、priority、notes
- [ ] 1.2 实现开始/结束时间 picker 绑定（微信 `picker` 组件，mode="time"）
- [ ] 1.3 时间选择后自动计算 `duration`（分钟）：`(end - start) / 60000`
- [ ] 1.4 调通 `utils/db.js` 完成 `tasks` 集合 `add()` 写入（含自动注入 `_openid`）
- [ ] 1.5 新任务写入成功后 `wx.showToast({ title: '已添加' })`，关弹窗，刷新列表
- [ ] 1.6 写入失败时 `wx.showToast({ title: '保存失败', icon: 'error' })`

### 2. 编辑任务

- [ ] 2.1 task-modal 编辑模式：从 `task` property 预填所有字段
- [ ] 2.2 调通 `utils/db.js` 完成 `tasks.doc(id).update()` 更新
- [ ] 2.3 更新成功后 toast "已保存"，关弹窗，刷新列表

### 3. 删除任务

- [ ] 3.1 左滑 task-card 后点击"删除"按钮
- [ ] 3.2 `wx.showModal` 确认："确定删除任务「任务名称」？"
- [ ] 3.3 确认后调用 `utils/db.js` 的 `tasks.doc(id).remove()`
- [ ] 3.4 删除成功后 toast "已删除"，刷新列表

### 4. 完成切换

- [ ] 4.1 点击 task-card 左侧圆圈 → 取反 `task.completed`
- [ ] 4.2 调用 `utils/db.js` 的 `tasks.doc(id).update({ data: { completed: !completed } })`
- [ ] 4.3 成功后刷新任务列表，卡片 UI 同步更新（圆圈变实心/空心）

### 5. 按日期查询

- [ ] 5.1 在 `utils/db.js` 中封装 `getTasksByDate(date)` → `tasks.where({ date }).get()`
- [ ] 5.2 首页、日历视图均复用此方法

### 6. 日历圆点数据

- [ ] 6.1 在 `utils/db.js` 中封装 `getTaskDatesByMonth(year, month)` → 查询 `tasks` 中 date 在当月范围内的记录，去重返回日期列表
- [ ] 6.2 首页日历视图 `onShow` 时调用此方法获取 `markedDates`
