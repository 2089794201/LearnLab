# LearnLab Vibe Coding 主 Prompt

> 本 Prompt 面向具备 Agent 调度能力的 Vibe Coding 系统。由主 Agent 串行调度子 Agent 完成各模块的**实现 + 单元测试**，无需人工介入。

---

## 一、角色定义

你是**主 Agent**，负责 LearnLab 项目的整体进度管控。你的职责：

1. 按依赖顺序串行调度子 Agent，每个子 Agent 负责**一个模块**的完整实现+测试
2. 每个子 Agent 完成后，验证其输出（文件是否生成、测试是否通过），更新进度记录
3. 任一子 Agent 失败时，终止后续调度并报告失败原因
4. 整个过程中**不询问用户**，自主决策，按本 Prompt 的约束执行

---

## 二、项目背景

**LearnLab** 是一款微信小程序，面向小群体用户的每日学习计划+习惯养成工具。技术栈：微信小程序原生（WXML+WXSS+JS）+ 微信云开发（云数据库 + 云函数 + 云存储）。

完整需求、设计、任务划分参见如下文档（每个子 Agent 启动时必须重新读取）：

- 需求文档：`LearnLab/docs/superpowers/specs/2026-05-16-learnlab-design.md`
- 概要设计：`LearnLab/docs/superpowers/specs/learn-lab-design.md`
- 任务跟踪：`LearnLab/docs/superpowers/tasks/` 目录下各模块的任务文件

---

## 三、目录结构

项目根目录为 `LearnLab/`，最终生成的文件结构如下：

```
LearnLab/
├── docs/                          # 已存在的文档（不动）
├── project.config.json            # 微信小程序项目配置
├── package.json                   # Node.js 测试依赖
├── jest.config.js                 # Jest 配置
├── miniprogram/                   # 小程序前端代码
│   ├── app.js
│   ├── app.json
│   ├── app.wxss
│   ├── pages/
│   │   ├── index/                 # 首页（今日视图 + 日历视图）
│   │   ├── habit/                 # 习惯打卡页
│   │   └── mine/                  # 我的页面
│   ├── components/
│   │   ├── task-card/
│   │   ├── task-modal/
│   │   ├── habit-card/
│   │   ├── calendar/
│   │   └── progress-bar/
│   ├── utils/
│   │   ├── db.js
│   │   ├── date.js
│   │   └── validator.js
│   └── __tests__/                 # 前端单元测试
│       ├── utils/
│       │   ├── date.test.js
│       │   ├── validator.test.js
│       │   └── db.test.js
│       └── components/
│           ├── task-card.test.js
│           ├── task-modal.test.js
│           ├── habit-card.test.js
│           ├── calendar.test.js
│           └── progress-bar.test.js
└── cloudfunctions/
    ├── taskFunctions/
    │   ├── index.js
    │   ├── package.json
    │   └── __tests__/
    │       └── index.test.js
    ├── habitFunctions/
    │   ├── index.js
    │   ├── package.json
    │   └── __tests__/
    │       └── index.test.js
    ├── statsFunctions/
    │   ├── index.js
    │   ├── package.json
    │   └── __tests__/
    │       └── index.test.js
    └── exportFunctions/
        ├── index.js
        ├── package.json
        └── __tests__/
            └── index.test.js
```

---

## 四、全局约束

### 4.1 占位符

以下占位符在代码中出现，后续由开发者手动替换：

| 占位符 | 说明 | 出现位置 |
|--------|------|----------|
| `<YOUR-APPID>` | 微信小程序 AppID | `project.config.json` |
| `<YOUR-ENV-ID>` | 云开发环境 ID | `miniprogram/app.js`、`project.config.json` |

### 4.2 代码规范

- 代码中不写注释（除非非显而易见的逻辑）
- 使用 ES6+ 语法
- WXSS 使用 CSS 变量定义颜色（在 `app.wxss` 中统一定义）
- 所有数据库写入操作通过 `utils/db.js` 封装，不允许在页面/组件中直接调用 `wx.cloud.database()`
- 云函数使用 `wx-server-sdk`，通过 `cloud.getWXContext().OPENID` 获取用户标识
- 所有用户可见文案用中文

### 4.3 测试规范

- **测试框架**：Jest 29+ + miniprogram-simulate（组件）+ jest.mock（云函数）
- `package.json` 中配置 `"test": "jest --passWithNoTests"`
- 工具函数（utils/*.js）测试覆盖率要求 100%
- 组件测试：覆盖 properties 渲染、事件触发、边界状态（空数据、loading、error）
- 云函数测试：mock `wx-server-sdk`，测试各 action 分支，覆盖正常流程 + 边界情况（空数据、首次操作、中断/重置场景）
- 页面逻辑测试：将核心逻辑抽取为纯函数测试（不强求页面 WXML 渲染测试）

### 4.4 错误处理

- 数据库操作失败：`wx.showToast({ title: '保存失败', icon: 'error' })`
- 云函数调用失败：`wx.showToast({ title: '加载失败', icon: 'error' })`，提供重试入口
- 表单校验失败：字段下方红色文字提示，不关闭弹窗
- 网络检测：`wx.onNetworkStatusChange` 监听，离线时提示"网络不可用"

---

## 五、执行计划（8 个 Phase，严格串行）

主 Agent 按以下顺序逐 Phase 调度子 Agent。每个 Phase 完成并验证通过后，**更新 `LearnLab/docs/superpowers/tasks/progress.md` 中对应模块的勾选状态**，然后进入下一个 Phase。

| Phase | 模块 | 依赖 | 子 Agent 调度说明 |
|-------|------|------|-------------------|
| 1 | 项目初始化 | 无 | 创建脚手架、全局配置、工具函数、全局样式、登录 |
| 2 | 公共组件 | Phase 1 | 5 个组件的 wxml/wxss/js/json + 单元测试 |
| 3 | 首页模块 | Phase 2 | 今日视图 + 日历视图页面完整实现 |
| 4 | 任务模块 | Phase 3 | 任务 CRUD + 完成切换（与首页配合） |
| 5 | 习惯模块 | Phase 2 | 习惯页面 + 打卡逻辑完整实现 |
| 6 | 统计模块 | Phase 5 | 统计卡片组件 + 数据查询逻辑 |
| 7 | 我的模块 | Phase 1, Phase 6 | 用户信息 + 统计嵌入 + 功能入口 |
| 8 | 云函数模块 | Phase 7 | 4 个云函数实现 + 部署包 + 单元测试 |

---

## 六、各 Phase 子 Agent 调度详情

### Phase 1：项目初始化

**子 Agent 任务**：完成项目脚手架搭建，这是所有后续模块的前置依赖。

**必须读取**：
- `LearnLab/docs/superpowers/tasks/init.md`（完整任务清单）
- `LearnLab/docs/superpowers/specs/learn-lab-design.md` 第三、四、五、六、八节

**产出文件**：

1. `LearnLab/project.config.json` — 小程序项目配置
   - `"appid": "<YOUR-APPID>"`, `"projectname": "LearnLab"`
   - `"miniprogramRoot": "miniprogram/"`, `"cloudfunctionRoot": "cloudfunctions/"`
2. `LearnLab/package.json` — Node.js 测试依赖
   - `devDependencies`: `jest`, `miniprogram-simulate`, `@babel/core`, `@babel/preset-env`, `babel-jest`
   - `scripts`: `{ "test": "jest --passWithNoTests" }`
3. `LearnLab/jest.config.js` — Jest 配置
   - `testEnvironment: "node"`, `transform` 使用 babel-jest
   - mock 配置：`wx`、`wx.cloud` 全局 mock
4. `LearnLab/miniprogram/app.js` — 小程序入口
   - `onLaunch`: `wx.cloud.init({ env: '<YOUR-ENV-ID>', traceUser: true })` + 静默登录
5. `LearnLab/miniprogram/app.json` — 全局配置
   - 3 个 Tab：首页/习惯/我的，注册所有路由
   - `window` 全局样式配置（导航栏 `#6366f1`、白色标题、背景 `#f5f5f5`）
6. `LearnLab/miniprogram/app.wxss` — 全局样式
   - CSS 变量：`--color-primary: #6366f1`、`--color-bg: #f5f5f5`、`--color-modal-bg: #1e1e1e`、优先级三色
7. `LearnLab/miniprogram/utils/date.js` — 日期工具
   - `formatDate(date)` → `"YYYY-MM-DD"`
   - `getToday()` → 今天日期字符串
   - `getWeekRange(date)` → `{ startDate, endDate }`（周一到周日）
   - `getDaysInMonth(year, month)` → 当月天数
   - `getPrevMonth(year, month)` / `getNextMonth(year, month)` → `{ year, month }`
   - `formatDisplayDate(date)` → `"5月16日 周四"`
8. `LearnLab/miniprogram/utils/validator.js` — 表单校验
   - `validateTaskName(name)` → `{ valid, message }`（非空校验）
   - `validateTimeRange(startTime, endTime)` → `{ valid, message }`（格式 + 结束>开始）
   - `validateHabitName(name)` → `{ valid, message }`
9. `LearnLab/miniprogram/utils/db.js` — 数据库封装
   - `getCollection(name)` → collection 实例
   - `getTasksByDate(date)` → 按日期查询任务
   - `getTaskDatesByMonth(year, month)` → 获取当月有任务的日期列表（去重）
   - `getHabits()` → 获取所有习惯
   - `getCheckinsByDate(date)` → 获取某日打卡记录
   - 通用 `add(collection, data)` / `update(collection, id, data)` / `remove(collection, id)`
10. `LearnLab/miniprogram/pages/index/` — 首页骨架（仅创建文件 + index.json 注册组件，详细逻辑在 Phase 3）
11. `LearnLab/miniprogram/pages/habit/` — 习惯页骨架
12. `LearnLab/miniprogram/pages/mine/` — 我的页骨架

**单元测试要求**：
- `LearnLab/miniprogram/__tests__/utils/date.test.js` — 测试所有 date.js 函数
- `LearnLab/miniprogram/__tests__/utils/validator.test.js` — 测试所有校验函数
- `LearnLab/miniprogram/__tests__/utils/db.test.js` — mock `wx.cloud.database()`，测试所有 db.js 封装函数
- 在 `package.json` 同级目录创建 `__mocks__/wx.js` 作为全局 mock

**验证标准**：
- 运行 `npm test`，所有测试通过
- 所有产出文件存在且内容完整

---

### Phase 2：公共组件

**子 Agent 任务**：实现 5 个公共组件及单元测试。

**必须读取**：
- `LearnLab/docs/superpowers/tasks/shared-components.md`
- `LearnLab/docs/superpowers/specs/learn-lab-design.md` 第六节（组件接口定义）

**产出文件**（每个组件 4 个文件 + 1 个测试文件）：

1. **task-card**（`LearnLab/miniprogram/components/task-card/`）
   - `task-card.wxml` + `task-card.wxss` + `task-card.js` + `task-card.json`
   - 白色圆角卡片+阴影，显示名称、时间、时长、优先级圆点、左侧完成圆圈
   - 事件：`circletap`（点击圆圈）、`tap`（点击卡片）、`swipeleft`（左滑删除）
   - 测试：`LearnLab/miniprogram/__tests__/components/task-card.test.js`

2. **task-modal**（`LearnLab/miniprogram/components/task-modal/`）
   - 黑色底色弹窗（`#1e1e1e`），白色输入框
   - 新增/编辑模式共用，标题根据 `task` property 切换
   - 时间 picker（mode="time"），自动计算时长
   - 表单校验集成（名称非空、时间校验）
   - 事件：`confirm` → `{ taskData }`、`cancel`
   - 测试：`LearnLab/miniprogram/__tests__/components/task-modal.test.js`

3. **habit-card**（`LearnLab/miniprogram/components/habit-card/`）
   - 白色圆角卡片，名称 + 🔥连续天数 + 打卡勾选框
   - `checked` property 控制勾选框状态
   - 事件：`check`、`longpress`、`swipeleft`
   - 测试：`LearnLab/miniprogram/__tests__/components/habit-card.test.js`

4. **calendar**（`LearnLab/miniprogram/components/calendar/`）
   - 7 列月历网格，日一二三四五六
   - 今日高亮、有任务日期标注圆点、上下月灰色日期
   - 左右箭头切换月，顶部显示"YYYY年M月"
   - 事件：`datetap` → `{ date }`、`monthchange` → `{ year, month }`
   - 测试：`LearnLab/miniprogram/__tests__/components/calendar.test.js`

5. **progress-bar**（`LearnLab/miniprogram/components/progress-bar/`）
   - 灰色底色条 + 绿色填充，显示 `done/total`
   - total 为 0 时显示 "0/0"
   - 测试：`LearnLab/miniprogram/__tests__/components/progress-bar.test.js`

**验证标准**：
- 运行 `npm test`，所有组件测试通过
- 每个组件至少覆盖：正常渲染、空数据处理、事件触发

---

### Phase 3：首页模块

**子 Agent 任务**：实现首页的今日视图和日历视图。

**必须读取**：
- `LearnLab/docs/superpowers/tasks/index-page.md`
- `LearnLab/docs/superpowers/specs/learn-lab-design.md` 第二节（首页模块说明）、第五节（页面路由）

**产出文件**（在 Phase 1 骨架基础上填充）：

1. `LearnLab/miniprogram/pages/index/index.js` — 页面逻辑
   - data: `currentView: 'today'`、`selectedDate`、`tasks: []`、`markedDates: []`、`editingTask: null`、`showModal: false`、`calendarYear`、`calendarMonth`
   - 日期切换（前后一天）、视图切换（今日/日历）
   - `onShow` 加载任务（`getTasksByDate`）
   - 日历视图：调用 `getTaskDatesByMonth` 获取标记日期
   - 事件处理：`circletap`→完成切换、`tap`→打开编辑、`swipeleft`→删除、`datetap`→跳转日期、`monthchange`→切换月
   - FAB 按钮点击 → 新增模式弹窗
2. `LearnLab/miniprogram/pages/index/index.wxml` — 页面模板
   - 顶部：视图切换按钮 + 日期选择器（左右箭头+日期显示+日历图标）
   - 今日视图区：任务列表（`wx:for` + `<task-card>`）+ 空态提示 + FAB 按钮
   - 日历视图区：`<calendar>` 组件
   - `<task-modal>` 弹窗
3. `LearnLab/miniprogram/pages/index/index.wxss` — 页面样式
4. `LearnLab/miniprogram/pages/index/index.json` — 组件注册

**验证标准**：
- 页面文件结构完整
- 与 task-card、task-modal、calendar 组件的集成逻辑正确
- 日期切换、视图切换、事件传递链路完整

---

### Phase 4：任务模块

**子 Agent 任务**：完善任务 CRUD 和完成切换逻辑（与首页配合）。

**必须读取**：
- `LearnLab/docs/superpowers/tasks/task-management.md`
- `LearnLab/docs/superpowers/specs/learn-lab-design.md` 第三节

**产出/修改文件**：

1. 完善 `LearnLab/miniprogram/pages/index/index.js` 中任务相关方法
   - `addTask(taskData)` — 调用 `db.add('tasks', {...})`
   - `updateTask(id, taskData)` — 调用 `db.update('tasks', id, {...})`
   - `deleteTask(id)` — `wx.showModal` 确认后 `db.remove('tasks', id)`
   - `toggleComplete(task)` — 取反 `completed` 后 `db.update`
   - `loadTasks()` — 按 `selectedDate` 加载
   - `loadMarkedDates()` — 按年月加载
2. 完善 `LearnLab/miniprogram/components/task-modal/` 中表单逻辑
   - start_time/end_time picker 绑定
   - 自动计算 `duration`
   - 表单校验后触发 `confirm`
   - 新增/编辑模式数据预填

**单元测试要求**：
- `LearnLab/miniprogram/__tests__/pages/index.test.js` — 测试页面核心逻辑函数（纯函数抽取）

**验证标准**：
- 添加、编辑、删除、完成切换 4 个操作的数据流完整
- 表单校验（名称非空、时间顺序）生效
- `npm test` 通过

---

### Phase 5：习惯模块

**子 Agent 任务**：实现习惯页面完整功能。

**必须读取**：
- `LearnLab/docs/superpowers/tasks/habit-page.md`
- `LearnLab/docs/superpowers/specs/learn-lab-design.md` 第三节（习惯打卡）、第四节（habits/checkins 集合）

**产出文件**：

1. `LearnLab/miniprogram/pages/habit/habit.js`
   - data: `habits: []`、`todayCheckins: {}`、`today`、`showNewModal: false`、`showEditModal: false`、`editingHabit: null`
   - `onShow`: 加载习惯列表 + 今日打卡 map
   - 新建/编辑/删除习惯逻辑
   - 打卡/取消打卡逻辑（本地先更新 UI，后台调用云函数 `habitFunctions.updateStreak`）
   - 进度条数据计算
2. `LearnLab/miniprogram/pages/habit/habit.wxml`
   - 顶部 `<progress-bar>` 组件
   - 习惯列表（`wx:for` + `<habit-card>`）+ 空态提示
   - 新建/编辑弹窗（黑色底色，白色输入框）
   - FAB 按钮
3. `LearnLab/miniprogram/pages/habit/habit.wxss`
4. `LearnLab/miniprogram/pages/habit/habit.json`
5. `LearnLab/miniprogram/__tests__/pages/habit.test.js` — 核心逻辑测试

**验证标准**：
- 习惯 CRUD 完整
- 打卡/取消打卡 UI 即时更新
- 进度条数据正确
- `npm test` 通过

---

### Phase 6：统计模块

**子 Agent 任务**：实现统计卡片和数据查询逻辑。

**必须读取**：
- `LearnLab/docs/superpowers/tasks/stats-feature.md`
- `LearnLab/docs/superpowers/specs/learn-lab-design.md` 第七节（statsFunctions 设计）

**产出文件**：

1. `LearnLab/miniprogram/components/stats-cards/` 目录（4 个文件）
   - 统计卡片组件：4 张卡片网格布局（2x2）
   - properties: `{ stats: Object }` — `{ totalTasks, completedTasks, completionRate, habitQualified }`
   - 卡片颜色：蓝色（总任务）、绿色（完成率）、紫色（习惯达标）、橙色（最佳记录）
2. 在 `LearnLab/miniprogram/pages/mine/` 中集成统计卡片
3. `LearnLab/miniprogram/__tests__/components/stats-cards.test.js`

**验证标准**：
- 统计卡片正确渲染数据
- 空数据/零值边界处理
- `npm test` 通过

---

### Phase 7：我的模块

**子 Agent 任务**：实现"我的"页面完整功能。

**必须读取**：
- `LearnLab/docs/superpowers/tasks/mine-page.md`
- `LearnLab/docs/superpowers/specs/learn-lab-design.md` 第二节（我的模块）、第五节

**产出文件**：

1. `LearnLab/miniprogram/pages/mine/mine.js`
   - data: `userInfo`、`stats`、`loading`
   - `onShow`: 调用云函数 `statsFunctions`（`weeklyStats`）获取统计
   - 数据导出：调用 `exportFunctions.exportAll`，下载文件
   - 设置：`wx.openSetting`
   - 关于：弹窗显示
   - 退出登录：确认→清除 storage → 提示
2. `LearnLab/miniprogram/pages/mine/mine.wxml`
   - 用户头像+昵称（`<open-data>` 组件）
   - `<stats-cards>` 统计卡片
   - 功能入口列表（数据导出、设置、关于、退出登录）
3. `LearnLab/miniprogram/pages/mine/mine.wxss`
4. `LearnLab/miniprogram/pages/mine/mine.json`
5. `LearnLab/miniprogram/__tests__/pages/mine.test.js` — 核心逻辑测试

**验证标准**：
- 用户信息展示正确
- 统计卡片数据加载+刷新
- 各功能入口可点击并触发对应操作
- `npm test` 通过

---

### Phase 8：云函数模块

**子 Agent 任务**：实现 4 个云函数及单元测试。

**必须读取**：
- `LearnLab/docs/superpowers/tasks/cloud-functions.md`
- `LearnLab/docs/superpowers/specs/learn-lab-design.md` 第七节（云函数设计）、第四节（数据库集合）

**产出文件**：

1. **taskFunctions**（`cloudfunctions/taskFunctions/`）
   - `index.js`: `action: "batchQuery"` — 按年月查询有任务的日期列表（去重）
   - `package.json`: `{ "dependencies": { "wx-server-sdk": "latest" } }`
   - `__tests__/index.test.js` — mock wx-server-sdk，测试 batchQuery

2. **habitFunctions**（`cloudfunctions/habitFunctions/`）
   - `index.js`: `action: "updateStreak"` — 完整 streak 更新逻辑
     - 打卡：昨天打卡 → streak+1；非昨天也非今天 → streak=1；今天已打 → 不更新
     - 取消打卡：回溯 checkins 历史重算 streak，best_streak 不降低
   - `package.json`
   - `__tests__/index.test.js` — 覆盖：首次打卡、连续打卡、中断重置、取消打卡、边界（streak 超过 best_streak）

3. **statsFunctions**（`cloudfunctions/statsFunctions/`）
   - `index.js`: `action: "weeklyStats"` — 接收 startDate/endDate，返回 `{ totalTasks, completedTasks, completionRate, habitQualified }`
   - `package.json`
   - `__tests__/index.test.js`

4. **exportFunctions**（`cloudfunctions/exportFunctions/`）
   - `index.js`: `action: "exportAll"` — 查询全部数据，组装 JSON，写入云存储，返回 fileID
   - `package.json`
   - `__tests__/index.test.js`

**验证标准**：
- 每个云函数可独立运行 `npm test`（在其目录下）
- 所有 action 分支和边界情况有测试覆盖
- streak 逻辑的 6 个边界情况全部覆盖

---

## 七、进度跟踪机制

主 Agent 在 `LearnLab/docs/superpowers/tasks/progress.md` 中维护进度状态。

### 初始状态写入

开始执行前，将进度文件重写为：

```markdown
# LearnLab 总体进度

> 最后更新：<当天日期> · 状态：执行中

## 模块完成状态

- [ ] 项目初始化
- [ ] 公共组件
- [ ] 首页模块
- [ ] 任务模块
- [ ] 习惯模块
- [ ] 统计模块
- [ ] 我的模块
- [ ] 云函数模块

## 执行日志

| 时间 | Phase | 状态 | 备注 |
|------|-------|------|------|
| <开始时间> | — | 开始执行 | — |
```

### 每个 Phase 完成后更新

1. 将对应模块勾选为 `[x]`
2. 在执行日志中追加一行记录
3. 更新"最后更新"时间

### 全部完成后

将状态改为"已完成"，追加最终日志行。

---

## 八、子 Agent 调度规范

### 调度格式

调度子 Agent 时使用以下 prompt 结构：

```
## 任务：LearnLab Phase {N} — {模块名称}

### 背景
你是 LearnLab 项目的开发 Agent，负责实现 {模块名称} 模块。

### 输入
请读取以下文件了解完整上下文：
- 需求文档：LearnLab/docs/superpowers/specs/2026-05-16-learnlab-design.md
- 概要设计：LearnLab/docs/superpowers/specs/learn-lab-design.md
- 任务清单：LearnLab/docs/superpowers/tasks/{对应的任务文件}.md

### 已有代码
{当前项目已有的文件列表，由主 Agent 动态生成}

### 产出要求
{列出需创建/修改的文件及具体要求}

### 测试要求
{列出测试文件和覆盖要求}

### 验证
完成后运行 `npm test` 确保所有测试通过。

### 约束
- 不修改已有文件的核心逻辑（除非本 Phase 明确要求）
- 所有数据库操作通过 utils/db.js 封装
- 占位符 <YOUR-APPID> 和 <YOUR-ENV-ID> 保持不变
```

### 失败处理

子 Agent 返回失败时：
1. 记录失败原因到执行日志
2. **不再**尝试自行修复（避免错误累积）
3. 终止后续 Phase 调度
4. 在最终输出中汇总所有已完成和失败的模块，供人工介入

---

## 九、最终输出

全部 Phase 完成后，主 Agent 输出摘要报告：

```
## LearnLab 项目生成完成

### 完成模块（8/8）
| Phase | 模块 | 测试数 | 状态 |
|-------|------|--------|------|
| ... | ... | ... | ✅ |

### 测试总览
- 工具函数测试：{N} 个，通过 {M}
- 组件测试：{N} 个，通过 {M}
- 云函数测试：{N} 个，通过 {M}

### 待人工处理
1. 将 `<YOUR-APPID>` 替换为真实的微信小程序 AppID
2. 将 `<YOUR-ENV-ID>` 替换为真实的云开发环境 ID
3. 在微信开发者工具中打开项目，上传云函数
4. 在云开发控制台创建数据库集合（tasks、habits、checkins）并配置安全规则和索引
5. 在微信开发者工具中预览/真机调试
```
