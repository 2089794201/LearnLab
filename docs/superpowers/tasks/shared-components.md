# 公共组件模块

> 本模块被首页、习惯页依赖，建议在页面开发前完成。

## task-card（任务卡片）

- [ ] 1.1 创建 `components/task-card/` 组件（wxml + wxss + js + json）
- [ ] 1.2 定义 `properties: { task: Object }`
- [ ] 1.3 卡片 UI：白色圆角卡片 + 阴影，显示任务名称、开始-结束时间、时长
- [ ] 1.4 优先级标签：高=红色圆点、中=黄色圆点、低=绿色圆点
- [ ] 1.5 左侧完成圆圈：空心/实心切换（实心=已完成，带勾）
- [ ] 1.6 点击圆圈触发 `circletap` 事件
- [ ] 1.7 点击卡片触发 `tap` 事件（编辑）
- [ ] 1.8 左滑卡片出现红色"删除"按钮，确认后触发 `swipeleft` 事件

## task-modal（任务表单弹窗）

- [ ] 2.1 创建 `components/task-modal/` 组件
- [ ] 2.2 定义 `properties: { visible: Boolean, task: Object|null }`
- [ ] 2.3 弹窗 UI：黑色底色（`#1e1e1e`），遮罩层半透明黑色
- [ ] 2.4 白色输入框：任务名称、开始时间（picker）、结束时间（picker）、优先级（三选一）、备注（textarea）
- [ ] 2.5 新增模式（`task=null`）：标题"添加任务"，表单全部为空
- [ ] 2.6 编辑模式（`task` 有值）：标题"编辑任务"，预填已有数据
- [ ] 2.7 开始/结束时间选择后自动计算预计时长（分钟），显示在弹窗内（只读）
- [ ] 2.8 表单校验：名称非空、时间格式正确、结束时间 > 开始时间，校验失败标红提示
- [ ] 2.9 点击"确认"触发 `confirm` 事件，传递表单数据；点击遮罩或"取消"触发 `cancel`

## habit-card（习惯卡片）

- [ ] 3.1 创建 `components/habit-card/` 组件
- [ ] 3.2 定义 `properties: { habit: Object, checked: Boolean }`
- [ ] 3.3 卡片 UI：白色圆角卡片，显示习惯名称
- [ ] 3.4 显示连续天数（🔥图标 + 数字），如 streak > 0 显示，否则隐藏
- [ ] 3.5 右侧打卡勾选框：已打卡=绿色实心、未打卡=灰色空心
- [ ] 3.6 点击勾选框触发 `check` 事件
- [ ] 3.7 长按触发 `longpress` 事件（编辑）
- [ ] 3.8 左滑触发 `swipeleft` 事件（删除）

## calendar（月历组件）

- [ ] 4.1 创建 `components/calendar/` 组件
- [ ] 4.2 定义 `properties: { year: Number, month: Number, markedDates: Array }`
- [ ] 4.3 月历 UI：7 列网格（日一二三四五六），显示当月完整日历
- [ ] 4.4 上月/下月填充灰色日期
- [ ] 4.5 今日日期高亮（蓝色边框或圆）
- [ ] 4.6 有任务的日期（`markedDates` 中的日期）底部标注小圆点
- [ ] 4.7 左右箭头切换月份，触发 `monthchange` 事件，传递 `{year, month}`
- [ ] 4.8 点击某天触发 `datetap` 事件，传递 `{date: "YYYY-MM-DD"}`
- [ ] 4.9 顶部显示"YYYY年M月"

## progress-bar（进度条）

- [ ] 5.1 创建 `components/progress-bar/` 组件
- [ ] 5.2 定义 `properties: { done: Number, total: Number }`
- [ ] 5.3 进度条 UI：灰色底色条 + 绿色填充条，显示 `done/total` 文本
- [ ] 5.4 total 为 0 时进度条为空，显示 "0/0"
