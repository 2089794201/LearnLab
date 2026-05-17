# LearnLab

每日学习计划 + 习惯养成微信小程序。

## 功能

- **每日任务管理** — 添加、编辑、删除任务，设置开始/结束时间、优先级、备注，自动计算时长
- **今日视图** — 当天任务列表，点击圆圈切换完成状态
- **日历视图** — 月历展示，有任务的日期标注圆点，点击跳转
- **习惯打卡** — 新建习惯，每日打卡，🔥 连续天数追踪，进度条显示
- **个人中心** — 微信头像昵称，本周统计卡片（任务总数、完成率、习惯达标数），数据导出

## 技术栈

| 层 | 技术 |
|----|------|
| 前端框架 | 微信小程序原生（WXML + WXSS + JS） |
| 后端 | 微信云开发（云数据库 + 云函数 + 云存储） |
| 测试 | Jest + miniprogram-simulate |

## 快速开始

```bash
# 安装依赖
npm install

# 运行测试
npm test
```

### 微信开发者工具

1. 下载[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 导入项目，选择 `LearnLab` 目录
3. 将 `project.config.json` 中的 `appid` 替换为你的小程序 AppID
4. 将 `miniprogram/app.js` 中的 `env` 替换为你的云开发环境 ID
5. 在云开发控制台创建三个数据库集合：`tasks`、`habits`、`checkins`
6. 右键各云函数文件夹 →「上传并部署：云端安装依赖」

## 项目结构

```
LearnLab/
├── miniprogram/
│   ├── app.js / app.json / app.wxss    # 小程序入口
│   ├── pages/
│   │   ├── index/                       # 首页（今日视图 + 日历视图）
│   │   ├── habit/                       # 习惯打卡页
│   │   └── mine/                        # 我的页面（统计 + 设置）
│   ├── components/
│   │   ├── task-card/                   # 任务卡片
│   │   ├── task-modal/                  # 任务表单弹窗
│   │   ├── habit-card/                  # 习惯卡片
│   │   ├── calendar/                    # 月历组件
│   │   ├── progress-bar/               # 进度条
│   │   └── stats-cards/                # 统计卡片
│   ├── utils/
│   │   ├── db.js                        # 数据库封装
│   │   ├── date.js                      # 日期工具
│   │   └── validator.js                 # 表单校验
│   └── __tests__/                       # 前端测试（138 个用例）
├── cloudfunctions/
│   ├── taskFunctions/                   # 任务批量查询
│   ├── habitFunctions/                  # 打卡连续天数更新
│   ├── statsFunctions/                  # 周统计聚合
│   └── exportFunctions/                 # 数据导出
└── docs/                                # 需求文档 + 任务清单
```

## 测试

```bash
npm test
```

138 个测试用例，覆盖工具函数、组件渲染、页面逻辑、云函数。

## 版本

- **v1.2.0** — 界面焕新：深色极简风（Dark Minimal）+ 青碧赛博 Teal 配色，支持深色/浅色双主题切换。全局动画、卡片边框层级、间距字号优化。138 个测试
- **v1.1.0** — 任务交互优化：已完成任务只读查看、完成确认弹窗防误触、编辑任务精确更新、习惯打卡可取消。138 个测试
- **v1.0.0** — 首个版本：任务管理、习惯打卡、日历视图、统计面板、数据导出

详见 [CHANGELOG.md](./CHANGELOG.md)
