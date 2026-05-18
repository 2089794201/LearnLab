# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概要

LearnLab — 微信小程序原生（WXML+WXSS+JS）+ 微信云开发。每日任务管理 + 习惯打卡 + 日历视图 + 统计面板。

开发环境：Windows 11，shell 使用 bash（Unix 语法，/dev/null 而非 NUL，正斜杠路径）。

## 常用命令

```bash
npm test                    # 运行全部 124 个测试
npx jest --no-coverage      # 同上
npx jest path/to/test.test.js  # 运行单个测试文件
npx jest -t "test name"     # 运行匹配名称的测试
```

项目本身不构建——微信开发者工具直接编译 `miniprogram/` 目录下的源码。

## 架构

**三层架构**：视图层（页面+组件）→ 逻辑层（utils + 页面内逻辑）→ 数据层（云数据库直连 + 云函数）

**数据流分两条**：
- 任务/习惯 CRUD → 页面直连云数据库（`utils/db.js` 封装），安全规则按 `_openid` 隔离
- 统计/导出 → 页面调用云函数（`wx.cloud.callFunction`），云函数内多集合聚合

**云数据库三个集合**：`tasks`、`habits`、`checkins`。前端通过 `utils/db.js` 操作，不允许页面直接调 `wx.cloud.database()`。

**3 个 Tab 页**（`app.json` 注册）：首页（`pages/index`）、习惯（`pages/habit`）、我的（`pages/mine`）。

**6 个组件**：task-card, task-modal, habit-card, calendar, progress-bar, stats-cards。

**4 个云函数**：taskFunctions（批量查日期）、habitFunctions（streak 更新）、statsFunctions（周统计）、exportFunctions（数据导出 JSON 到云存储）。

## 关键约定

- `app.wxss` 用 CSS 变量定义颜色：`--color-primary: #6366f1`、`--color-modal-bg: #1e1e1e`、`--color-priority-high/medium/low`（红/黄/绿）
- **所有组件 `.json` 必须设 `"styleIsolation": "apply-shared"`**，否则看不到全局样式
- 弹窗内 `cancel` touch 事件必须用 `catchtap="handler"`（非空），空字符串 `catchtap=""` 不阻止冒泡
- `utils/db.js` 使用延迟初始化 `wx.cloud.database()`（每个函数内调用 `getDb()`），不能模块级缓存——避免 `wx.cloud.init()` 未完成就创建数据库连接
- 敏感信息保护：`project.config.json` 使用 `<YOUR-APPID>` 占位符，真实 AppID/云环境 ID 存在 `project.private.config.json`（已在 `.gitignore` 中）。`miniprogram/app.js` 通过 `require('./config')` 读取云环境 ID，`config.js` 已在 `.gitignore` 中，`config.example.js` 为模板。首次 clone 后运行 `LEARNLAB_CLOUD_ENV=cloud1-xxx node scripts/generate-config.js` 生成配置文件

## 测试要点

- 工具函数（`utils/*.js`）测试 —— `testEnvironment: "node"`，全局 mock `wx` 对象在 `__mocks__/wx.js`
- 组件测试 —— 文件顶部加 `/** @jest-environment jsdom */`，使用 `miniprogram-simulate`（`simulate.load(path)` + `simulate.render(id, properties)`）
- 云函数测试 —— `mock('wx-server-sdk')` 由 `moduleNameMapper` 指向 `__mocks__/wx-server-sdk.js`，测试中 `jest.resetAllMocks()` + 配置 mock chain 对象
- 页面逻辑测试 —— 抽取纯函数测试，不强求 WXML 渲染

## 占位符

代码中 `<YOUR-APPID>` 为 GitHub 占位符。本地开发时在 `project.private.config.json` 中填入真实 AppID，通过 `LEARNLAB_CLOUD_ENV` 环境变量或直接编辑 `miniprogram/config.js` 设置云环境 ID。
