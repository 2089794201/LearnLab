# 首页模块

> 首页（`pages/index/index`）承载今日视图和日历视图，通过页面内状态切换。

## 子任务

### 1. 页面脚手架

- [ ] 1.1 创建 `pages/index/` 页面文件（index.wxml + index.wxss + index.js + index.json）
- [ ] 1.2 在 index.json 中注册使用的组件：`task-card`、`task-modal`、`calendar`
- [ ] 1.3 初始化页面 data：`currentView: 'today'`、`selectedDate`（默认今天）、`tasks: []`、`markedDates: []`

### 2. 日期选择器

- [ ] 2.1 顶部日期栏 UI（居中显示当前选中日期，左右箭头切换）
- [ ] 2.2 左箭头 → 前一天，更新 `selectedDate`，重新加载任务
- [ ] 2.3 右箭头 → 后一天，同上
- [ ] 2.4 点击日历图标 → 切换到日历视图
- [ ] 2.5 日期格式化显示（如"5月16日 周四"，使用 `utils/date.js`）

### 3. 今日视图

- [ ] 3.1 顶部切换按钮："今日视图"（蓝色高亮）| "日历视图"（灰色）
- [ ] 3.2 使用 `wx:for` 渲染当日任务列表，每个任务使用 `<task-card>` 组件
- [ ] 3.3 页面底部固定 `+` 添加任务按钮（紫色圆形，固定在右下角）
- [ ] 3.4 监听 task-card 的 `circletap` 事件 → 切换任务完成状态（调用 `utils/db.js` 更新 `completed` 字段）
- [ ] 3.5 监听 task-card 的 `tap` 事件 → 打开编辑弹窗（设置 `editingTask` + 显示 task-modal）
- [ ] 3.6 监听 task-card 的 `swipeleft` 事件 → 确认后删除任务（调用 `utils/db.js` 删除文档）
- [ ] 3.7 空态处理：当天无任务时显示"今天还没有任务，点击 + 添加吧"
- [ ] 3.8 页面 `onShow` 时根据 `selectedDate` 从数据库加载任务

### 4. 日历视图

- [ ] 4.1 顶部切换按钮："今日视图"（灰色）| "日历视图"（蓝色高亮）
- [ ] 4.2 嵌入 `<calendar>` 组件，传入 `year`、`month`、`markedDates`
- [ ] 4.3 监听 calendar 的 `monthchange` 事件 → 更新 year/month，重新加载该月有任务的日期
- [ ] 4.4 监听 calendar 的 `datetap` 事件 → 切换回今日视图并设置日期为该天
- [ ] 4.5 点击某天后弹出该日概要（任务数、总时长），下方有"查看详情"按钮跳转到今日视图
- [ ] 4.6 加载标记日期的逻辑：查询 tasks 集合中该月所有有任务的日期（按 `date` 字段聚合），更新 `markedDates`

### 5. 添加任务入口

- [ ] 5.1 点击 `+` 按钮 → 清空 `editingTask`，显示 task-modal（新增模式）
- [ ] 5.2 监听 task-modal 的 `confirm` 事件 → 调用 `utils/db.js` 新增任务文档，刷新列表

### 6. 编辑任务入口

- [ ] 6.1 点击 task-card 卡片 → 设置 `editingTask` 为该任务数据，显示 task-modal（编辑模式）
- [ ] 6.2 监听 task-modal 的 `confirm` 事件 → 调用 `utils/db.js` 更新任务文档，刷新列表
