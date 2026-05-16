# LearnLab 概要设计文档

> 版本 1.0 · 2026-05-16 · 基于需求文档 [2026-05-16-learnlab-design.md](./2026-05-16-learnlab-design.md)

## 一、总体架构

LearnLab 采用**微信小程序原生 + 云开发混合模式**的三层架构：

```
┌─────────────────────────────────────────────┐
│              视图层（页面 + 组件）              │
│  首页(index)  ·  习惯(habit)  ·  我的(mine)    │
├─────────────────────────────────────────────┤
│              逻辑层（utils + 页面内逻辑）        │
│  数据库直连封装  ·  日期工具  ·  表单校验        │
├─────────────────────────────────────────────┤
│              数据层（云开发）                   │
│  云数据库(3个集合)  ·  云函数(4个)  ·  云存储    │
└─────────────────────────────────────────────┘
```

- **视图层**负责 UI 渲染和用户交互
- **逻辑层**封装可复用工具和页面内核心逻辑
- **数据层**中，简单 CRUD 由前端直连数据库，统计计算和数据导出走云函数

## 二、模块划分

### 2.1 前端模块

| 模块 | 职责 | 包含内容 |
|------|------|---------|
| **首页模块** | 今日视图 + 日历视图 | `pages/index/`，内含日期切换、任务列表展示、日历组件 |
| **任务模块** | 任务 CRUD + 完成切换 | 散布在首页中的任务表单弹窗、任务卡片、编辑/删除逻辑 |
| **习惯模块** | 习惯 CRUD + 每日打卡 | `pages/habit/`，内含习惯列表、进度条、打卡操作 |
| **统计模块** | 统计计算与展示 | 嵌入"我的"页面，读取任务和打卡数据 |
| **我的模块** | 用户信息 + 入口聚合 | `pages/mine/`，微信头像昵称、数据导出入口、设置/关于（弹窗） |
| **公共组件** | 跨页面复用 | `components/`，含任务卡片、任务弹窗、习惯卡片、日历、进度条 |

### 2.2 后端模块（云函数）

| 模块 | 职责 | 关键操作 |
|------|------|---------|
| **taskFunctions** | 任务复杂操作 | 批量查询跨日任务、任务统计分析 |
| **habitFunctions** | 习惯复杂操作 | 打卡校验、连续天数计算、streak 更新 |
| **statsFunctions** | 统计聚合 | 周统计（完成任务数、完成率、习惯达标数）|
| **exportFunctions** | 数据导出 | 将任务/习惯/打卡数据导出为文件 |

### 2.3 模块关系图

```
pages/index ──── 直连DB ────→ tasks 集合
    │
    ├── 使用 → components/task-card
    ├── 使用 → components/task-modal
    └── 使用 → components/calendar

pages/habit ──── 直连DB ────→ habits 集合
    │                        checkins 集合
    ├── 使用 → components/habit-card
    └── 使用 → components/progress-bar

pages/mine ──── 调用云函数 ──→ statsFunctions
    │                        exportFunctions
    └── 嵌入 → 统计模块（本周统计卡片）
```

## 三、数据流设计

### 3.1 直连模式（任务 CRUD、习惯 CRUD、打卡）

```
用户操作 → 页面逻辑 → utils/db.js → 云数据库
                                    │
                         _openid 自动过滤（云开发安全规则）
```

适用操作：任务的增删改查、习惯的增删改查、打卡的勾选/取消。这些操作仅涉及当前用户单条/少量数据，无需跨集合聚合。

### 3.2 云函数模式（统计、导出）

```
用户操作 → 页面逻辑 → wx.cloud.callFunction() → 云函数 → 云数据库（多集合查询/聚合）
                         │
                         返回聚合结果
```

适用操作：

- **统计**：本周完成任务数、完成率、习惯达标数 — 需跨 `tasks` + `checkins` 集合聚合
- **导出**：将用户全部数据打包导出 — 涉及 `tasks`/`habits`/`checkins` 三个集合

### 3.3 数据流图

```
┌──────────┐   直连读写    ┌──────────┐
│  首页     │───→ tasks ───│          │
│  (index) │              │          │
└──────────┘              │  云数据库 │
                          │          │
┌──────────┐   直连读写    │  tasks   │
│  习惯     │───→ habits ──│  habits  │
│  (habit) │───→ checkins │  checkins│
└──────────┘              │          │
                          └──────────┘
┌──────────┐   callFunction  ┌──────────────┐
│  我的     │───→ stats ────→│ statsFunctions│──→ tasks + checkins
│  (mine)  │───→ export ───→│exportFunctions│──→ tasks + habits + checkins
└──────────┘                └──────────────┘
```

## 四、数据库集合设计

### 4.1 tasks（任务集合）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| _id | string | 自动 | 云数据库自动生成 |
| name | string | 是 | 任务名称 |
| date | string | 是 | 所属日期，格式 YYYY-MM-DD |
| start_time | string | 是 | 开始时间，格式 HH:mm |
| end_time | string | 是 | 结束时间，格式 HH:mm |
| duration | number | 是 | 预计时长（分钟），由起止时间自动计算 |
| priority | string | 是 | "high" / "medium" / "low" |
| completed | boolean | 是 | 默认 false |
| notes | string | 否 | 备注 |
| _openid | string | 自动 | 用户标识，云开发自动注入 |

**索引**：`date` + `_openid` 复合索引（按日期查询是最高频操作）

### 4.2 habits（习惯集合）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| _id | string | 自动 | 自动生成 |
| name | string | 是 | 习惯名称 |
| streak | number | 是 | 当前连续天数，默认 0 |
| best_streak | number | 是 | 历史最长连续天数，默认 0 |
| last_checkin_date | string | 否 | 上次打卡日期 YYYY-MM-DD |
| _openid | string | 自动 | 用户标识 |

**索引**：`_openid`（按用户获取全部习惯）

### 4.3 checkins（打卡记录集合）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| _id | string | 自动 | 自动生成 |
| habit_id | string | 是 | 关联习惯 _id |
| date | string | 是 | 打卡日期 YYYY-MM-DD |
| _openid | string | 自动 | 用户标识 |

**索引**：`habit_id` + `date` + `_openid` 复合索引（查询某习惯某天的打卡记录）

## 五、页面路由与导航

### 5.1 Tab 页面（app.json 配置）

| Tab | 路径 | 说明 |
|-----|------|------|
| 首页 | `pages/index/index` | 今日计划 |
| 习惯 | `pages/habit/habit` | 打卡 |
| 我的 | `pages/mine/mine` | 个人 |

### 5.2 页面内部导航

```
pages/index/index
  ├─ 默认显示：今日视图
  ├─ 顶部切换按钮 → 日历视图（页面内状态切换，不跳转）
  ├─ 日历视图内点击某天 → 跳转回当日今日视图
  └─ 日期选择器（左右箭头 / 日历图标）→ 切换日期（页面内状态切换）

pages/habit/habit
  └─ 无子页面跳转（所有操作通过弹窗/卡片内完成）

pages/mine/mine
  ├─ 数据导出 → 调用云函数，导出完成提示
  ├─ 设置 → 微信小程序设置页（wx.openSetting）
  ├─ 关于 → 弹窗展示
  └─ 退出登录 → 清除本地缓存，返回登录页
```

### 5.3 导航约束

- 底部 Tab 始终可见
- 首页和日历视图共用 `pages/index/index`，通过内部状态切换（`currentView: 'today' | 'calendar'`）
- 日历切换月份和切换日期均在页面内完成，不产生页面跳转

## 六、公共组件清单

| 组件 | 路径 | 功能 | 使用页面 |
|------|------|------|---------|
| **task-card** | `components/task-card/` | 任务卡片：名称、时间、时长、优先级标签、完成圆圈 | 首页 |
| **task-modal** | `components/task-modal/` | 任务表单弹窗：新增/编辑共用，黑色底色白色输入框 | 首页 |
| **habit-card** | `components/habit-card/` | 习惯卡片：名称、连续天数🔥、打卡勾选 | 习惯页 |
| **calendar** | `components/calendar/` | 月历组件：当月日历网格、任务日期圆点标注、左右切换月 | 首页 |
| **progress-bar** | `components/progress-bar/` | 进度条：X/N 完成进度 | 习惯页 |

### 组件接口

**task-card**
```
properties: { task: Object }
events:     [ tap → 打开编辑弹窗, swipeleft → 删除确认, circletap → 切换完成状态 ]
```

**task-modal**
```
properties: { visible: Boolean, task: Object|null }  // task为null时为新增模式
events:     [ confirm → {taskData}, cancel ]
```

**habit-card**
```
properties: { habit: Object, checked: Boolean }
events:     [ check → {habitId}, swipeleft → 删除, longpress → 编辑 ]
```

**calendar**
```
properties: { year: Number, month: Number, markedDates: Array }
events:     [ datetap → {date}, monthchange → {year, month} ]
```

**progress-bar**
```
properties: { done: Number, total: Number }
```

## 七、云函数设计

### 7.1 statsFunctions

```
入参: { action: "weeklyStats", startDate, endDate }
出参: { totalTasks, completedTasks, completionRate, habitQualified }
逻辑:
  1. 查询 tasks 集合: date 在 [startDate, endDate] 范围内
  2. 统计: 总任务数、已完成数、完成率(completed/总数)
  3. 查询 checkins + habits: 本周每天打卡的习惯数
  4. 统计: 习惯达标数（本周每天都打卡的习惯数）
  5. 返回聚合结果
```

### 7.2 exportFunctions

```
入参: { action: "exportAll" }
出参: { fileID, fileName }
逻辑:
  1. 查询 tasks、habits、checkins 三个集合的全部用户数据
  2. 组装为 JSON 或 CSV 格式
  3. 写入云存储（wx.cloud.uploadFile）
  4. 返回 fileID 供前端下载
```

### 7.3 taskFunctions

```
入参: { action: "batchQuery" | "dateRangeQuery", ...params }
逻辑:
  - batchQuery: 按日期范围批量查询任务（日历视图圆点标注用）
  - 预留扩展
```

### 7.4 habitFunctions

```
入参: { action: "updateStreak", habitId, date }
逻辑:
  1. 打卡完成时: 计算当前连续天数
  2. last_checkin_date 为昨天 → streak+1
  3. last_checkin_date 非昨天也非今天 → streak 重置为 1
  4. 更新 best_streak（如 streak > best_streak）
  5. 取消打卡时: 重新计算 streak（需回溯连续历史）
  6. 更新 habit 记录
```

## 八、安全与数据隔离

### 8.1 用户鉴权

- 微信授权登录（`wx.login` → 云开发自动获取 `OPENID`）
- 用户信息（头像、昵称）通过 `<open-data>` 组件展示，不需要自行存储
- 登录态由微信云开发 SDK 自动维护，无需自行管理 token

### 8.2 数据库安全规则

**tasks 集合**：
```json
{
  "read": "doc._openid == auth.openid",
  "write": "doc._openid == auth.openid"
}
```

**habits 集合**：
```json
{
  "read": "doc._openid == auth.openid",
  "write": "doc._openid == auth.openid"
}
```

**checkins 集合**：
```json
{
  "read": "doc._openid == auth.openid",
  "write": "doc._openid == auth.openid"
}
```

前端 `create` 时通过 `wx.cloud.database().collection()` 写入，云开发自动注入当前用户的 `_openid`。

### 8.3 无服务端鉴权需求

- 所有数据库操作通过安全规则即可完成用户隔离
- 云函数仅做数据聚合计算，入参无需携带用户标识，云函数内通过 `wx-server-sdk` 的 `cloud.getWXContext().OPENID` 获取

## 九、错误处理策略

| 场景 | 处理方式 |
|------|---------|
| 网络异常 | `wx.onNetworkStatusChange` 监听，离线时提示"网络不可用" |
| 数据库写入失败 | `fail` 回调内 `wx.showToast` 提示"保存失败"，不自动重试 |
| 云函数调用失败 | 同上，提示"加载失败"，提供手动刷新入口 |
| 表单校验失败 | 弹窗内直接标红提示，不关闭弹窗 |
| 数据导出超时 | 云函数 60s 超时，超时后提示"数据量较大，请稍后重试" |

## 十、模块依赖总览

```
                    ┌─────────────┐
                    │   app.json   │  Tab 配置、路由注册
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        pages/index   pages/habit   pages/mine
             │             │             │
    ┌────────┼───┐        │             │
    ▼        ▼   ▼        ▼             ▼
task-card  task  calendar  habit-card  progress
          -modal             -bar
             │             │             │
             └──────┬──────┘             │
                    ▼                    ▼
              utils/db.js        云函数调用
                    │                    │
                    ▼                    ▼
              云数据库(直连)       cloudFunctions
              tasks/habits/        statsFunctions
              checkins             exportFunctions
                                   taskFunctions
                                   habitFunctions
```
