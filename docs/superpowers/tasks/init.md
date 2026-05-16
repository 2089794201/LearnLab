# 项目初始化

> 本模块是所有其他模块的前置依赖，必须先完成。

## 子任务

### 1. 小程序项目脚手架

- [ ] 1.1 使用微信开发者工具创建小程序项目（AppID + 云开发模板）
- [ ] 1.2 配置 `project.config.json`（appid、云开发根目录 `cloudfunctions/`）
- [ ] 1.3 创建目录结构：`pages/`、`components/`、`utils/`、`cloudfunctions/`

### 2. app.json 全局配置

- [ ] 2.1 配置底部 Tab 栏（3 个 tab：首页 / 习惯 / 我的）
- [ ] 2.2 配置 `window` 全局样式（导航栏背景色 `#6366f1`、标题文字白色、页面背景 `#f5f5f5`）
- [ ] 2.3 注册所有页面路由：`pages/index/index`、`pages/habit/habit`、`pages/mine/mine`

### 3. 云开发初始化

- [ ] 3.1 在 `app.js` 中调用 `wx.cloud.init({ env: 'learnlab-xxx' })`
- [ ] 3.2 创建云开发环境，获取环境 ID
- [ ] 3.3 验证云开发 SDK 可用（调用一次测试查询）

### 4. 数据库集合创建

- [ ] 4.1 在云开发控制台创建 `tasks` 集合
- [ ] 4.2 在云开发控制台创建 `habits` 集合
- [ ] 4.3 在云开发控制台创建 `checkins` 集合
- [ ] 4.4 配置 `tasks` 集合安全规则（读/写：`doc._openid == auth.openid`）
- [ ] 4.5 配置 `habits` 集合安全规则（同上）
- [ ] 4.6 配置 `checkins` 集合安全规则（同上）
- [ ] 4.7 创建 `tasks` 集合索引：`date` + `_openid` 复合索引
- [ ] 4.8 创建 `habits` 集合索引：`_openid`
- [ ] 4.9 创建 `checkins` 集合索引：`habit_id` + `date` + `_openid` 复合索引

### 5. 全局工具函数

- [ ] 5.1 创建 `utils/db.js` — 封装云数据库直连操作（获取 collection、基本 CRUD、按日期查询）
- [ ] 5.2 创建 `utils/date.js` — 日期工具（格式化 YYYY-MM-DD、获取今天、获取本周起止日期、月份天数、前后月切换）
- [ ] 5.3 创建 `utils/validator.js` — 表单校验（任务名称非空、时间格式 HH:mm、结束时间 > 开始时间）

### 6. 全局样式

- [ ] 6.1 编写 `app.wxss` 全局样式（CSS 变量定义主色调、字体、间距、卡片阴影、弹窗遮罩）
- [ ] 6.2 CSS 变量：`--color-primary: #6366f1`、`--color-bg: #f5f5f5`、`--color-modal-bg: #1e1e1e`、优先级颜色（红/黄/绿）

### 7. 用户登录

- [ ] 7.1 在 `app.js` `onLaunch` 中实现微信静默登录（`wx.login` → 云开发自动获取 OPENID）
- [ ] 7.2 将登录状态存储到 `app.globalData`
