# 云函数模块

> 4 个云函数：taskFunctions、habitFunctions、statsFunctions、exportFunctions。

## 子任务

### 1. taskFunctions

- [ ] 1.1 创建 `cloudfunctions/taskFunctions/` 目录（index.js + package.json）
- [ ] 1.2 实现 `action: "batchQuery"` — 按日期范围批量查询任务（日历视图圆点标注用）
- [ ] 1.3 返回指定月份内所有有任务的日期列表（去重）
- [ ] 1.4 部署云函数，验证可调用

### 2. habitFunctions（核心：streak 更新逻辑）

- [ ] 2.1 创建 `cloudfunctions/habitFunctions/` 目录
- [ ] 2.2 实现 `action: "updateStreak"` 入口
- [ ] 2.3 打卡完成逻辑：
  - 查询 `habit.last_checkin_date`
  - 若 `last_checkin_date == 昨天` → `streak += 1`
  - 若 `last_checkin_date == 今天` → 不更新（已打过卡）
  - 否则 → `streak = 1`（重新开始计数）
  - 若 `streak > best_streak` → 更新 `best_streak = streak`
  - 更新 `last_checkin_date = 今天`
- [ ] 2.4 取消打卡逻辑：
  - 查询该习惯所有 checkins，按日期倒序排列
  - 从最近的日期向前回溯，计算当前连续天数
  - 更新 `streak`、`last_checkin_date`（向前推一天或清空）
  - `best_streak` 不降低
- [ ] 2.5 部署云函数，验证打卡/取消打卡 streak 正确
- [ ] 2.6 边界情况：首次打卡 streak=1；连续多天打卡不断开；中间断一天 streak 重置

### 3. statsFunctions

- [ ] 3.1 创建 `cloudfunctions/statsFunctions/` 目录
- [ ] 3.2 实现 `action: "weeklyStats"` 入口，接收 `startDate`、`endDate`
- [ ] 3.3 查询本周所有 tasks：`totalTasks`、`completedTasks`、`completionRate`
- [ ] 3.4 查询本周所有 habits + checkins，计算 `habitQualified`（本周每天均打卡的习惯数）
- [ ] 3.5 返回 `{ totalTasks, completedTasks, completionRate, habitQualified }`
- [ ] 3.6 部署云函数，验证返回数据正确

### 4. exportFunctions

- [ ] 4.1 创建 `cloudfunctions/exportFunctions/` 目录
- [ ] 4.2 实现 `action: "exportAll"` 入口
- [ ] 4.3 查询当前用户全部 tasks、habits、checkins
- [ ] 4.4 组装为 JSON 格式（或 CSV）
- [ ] 4.5 写入云存储：`cloud.uploadFile({ cloudPath: 'exports/${OPENID}-${Date.now()}.json', fileContent })`
- [ ] 4.6 返回 `{ fileID, fileName }` 供前端下载
- [ ] 4.7 处理超时（60s 限制）：数据量过大时提示用户
- [ ] 4.8 部署云函数，验证导出文件的完整性和正确性
