# 我的模块

> 个人中心页面（`pages/mine/mine`），底部 Tab 第三个入口。本模块嵌入 [统计模块](./stats-feature.md) 的统计卡片。

## 子任务

### 1. 页面脚手架

- [ ] 1.1 创建 `pages/mine/` 页面文件（mine.wxml + mine.wxss + mine.js + mine.json）
- [ ] 1.2 初始化页面 data：`userInfo: null`、`stats: { totalTasks: 0, completedTasks: 0, completionRate: 0, habitQualified: 0 }`

### 2. 用户信息展示

- [ ] 2.1 使用 `<open-data type="userAvatarUrl">` 展示微信头像（圆形）
- [ ] 2.2 使用 `<open-data type="userNickName">` 展示微信昵称
- [ ] 2.3 头像 + 昵称布局：头像左侧，昵称垂直居中

### 3. 统计卡片

- [ ] 3.1 嵌入本周统计卡片区域（具体由 [统计模块](./stats-feature.md) 实现）
- [ ] 3.2 卡片布局：网格 2x2（完成任务数、完成率、习惯达标数、本周最佳）
- [ ] 3.3 页面 `onShow` 时调用云函数 `statsFunctions` 获取最新统计数据
- [ ] 3.4 加载中显示 loading 状态；加载失败显示"加载失败" + 重试按钮

### 4. 功能入口列表

- [ ] 4.1 数据导出入口：点击 → 调用云函数 `exportFunctions`，导出完成后 `wx.cloud.downloadFile` 下载
- [ ] 4.2 导出过程中显示 loading："正在导出数据..."
- [ ] 4.3 导出成功后 toast "数据已导出"（文件保存到微信会话）
- [ ] 4.4 设置入口：点击 → 调用 `wx.openSetting({})` 打开小程序设置页
- [ ] 4.5 关于入口：点击 → 弹窗展示 App 名称、版本号 1.0
- [ ] 4.6 退出登录入口：点击 → `wx.showModal` 确认 → 清除 `wx.storage` → `wx.redirectTo({ url: '/pages/login/login' })`（如无登录页，则提示"已退出"）
- [ ] 4.7 入口列表 UI：白色圆角卡片，每个入口一行，右侧箭头

### 5. 页面交互

- [ ] 5.1 各入口点击反馈（hover 态浅灰底色）
- [ ] 5.2 网络异常时导出/设置入口仍可点击，但操作时提示"网络不可用"
