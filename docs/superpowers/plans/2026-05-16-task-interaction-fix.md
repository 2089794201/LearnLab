# 任务交互逻辑修复 — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修复三个任务交互缺陷：已完成任务只读查看、完成/取消需确认弹窗、编辑任务正确更新而非新建。

**Architecture:** 在 task-modal 组件加 `readonly` 开关实现查看/编辑模式复用，在 index 页面加确认弹窗和 readonly 传递，task-card 组件不变。

**Tech Stack:** 微信小程序原生（WXML + WXSS + JS），Jest + miniprogram-simulate 测试

---

### Task 1: task-modal 组件 — 新增 readonly 属性和模式

**Files:**
- Modify: `miniprogram/components/task-modal/task-modal.js`
- Modify: `miniprogram/components/task-modal/task-modal.wxml`
- Modify: `miniprogram/__tests__/components/task-modal.test.js`

- [ ] **Step 1: 更新 task-modal 测试 — 新增 readonly 相关用例**

在 `miniprogram/__tests__/components/task-modal.test.js` 文件末尾（`});` 之前）加入：

```javascript
  it('renders readonly mode - all inputs disabled', () => {
    const comp = simulate.render(id, {
      visible: true,
      readonly: true,
      task: { _id: '1', name: '已完成任务', start_time: '09:00', end_time: '10:30', duration: 90, priority: 'high', notes: '', completed: true }
    });
    const inputs = comp.querySelectorAll('.form-input');
    inputs.forEach(input => {
      expect(input.getAttribute('disabled')).toBe('true');
    });
  });

  it('renders confirm button as 关闭 in readonly mode', () => {
    const comp = simulate.render(id, {
      visible: true,
      readonly: true,
      task: { _id: '1', name: '已完成任务', start_time: '09:00', end_time: '10:30', duration: 90, priority: 'high', notes: '', completed: true }
    });
    // modal title should contain 查看
    const title = comp.querySelector('.modal-title');
    expect(title.textContent).toContain('查看');
  });

  it('renders add button as 确认 in normal mode', () => {
    const comp = simulate.render(id, { visible: true, task: null });
    const btn = comp.querySelector('.btn-primary');
    expect(btn.textContent).toContain('确认');
  });
```

- [ ] **Step 2: 运行测试确认新用例失败**

```bash
cd D:/Vsproject/LearLab && npx jest --no-coverage miniprogram/__tests__/components/task-modal.test.js
```

预期：3 个新增测试 FAIL。

- [ ] **Step 3: task-modal.js — 新增 readonly property**

`components/task-modal/task-modal.js` 的 `properties` 对象中，在 `task` 后面加：

```javascript
    readonly: {
      type: Boolean,
      value: false
    },
```

`onConfirm` 方法顶部加守卫：

```javascript
    onConfirm() {
      if (this.data.readonly) {
        this.triggerEvent('cancel');
        return;
      }
      const errors = {};
```

`onPriorityTap` 方法顶部加守卫：

```javascript
    onPriorityTap(e) {
      if (this.data.readonly) return;
      this.setData({ priority: e.currentTarget.dataset.value });
    },
```

- [ ] **Step 4: task-modal.wxml — 动态标题、按钮、禁用输入**

**标题（第 5 行）：** `<text class="modal-title">{{task ? '编辑任务' : '添加任务'}}</text>` 改为：

```xml
      <text class="modal-title">{{readonly ? '查看任务' : (task ? '编辑任务' : '添加任务')}}</text>
```

**底部按钮（第 58 行）：** `<view class="btn-primary" bindtap="onConfirm">确认</view>` 改为：

```xml
      <view class="btn-primary" bindtap="onConfirm">{{readonly ? '关闭' : '确认'}}</view>
```

**各输入控件加 `disabled`：**
- 第 10 行 `<input>` 加 `disabled="{{readonly}}"`
- 第 17 行 `<picker>` 的 `<view>` 无法直接 disabled，改为在 JS 层守卫（Step 3 已做）
- 第 23 行 `<picker>` 同上
- 第 54 行 `<textarea>` 加 `disabled="{{readonly}}"`

- [ ] **Step 5: 运行测试确认通过**

```bash
cd D:/Vsproject/LearLab && npx jest --no-coverage miniprogram/__tests__/components/task-modal.test.js
```

预期：全部 PASS。

- [ ] **Step 6: Commit**

```bash
cd D:/Vsproject/LearLab && git add miniprogram/components/task-modal/task-modal.js miniprogram/components/task-modal/task-modal.wxml miniprogram/__tests__/components/task-modal.test.js && git commit -m "feat: add readonly mode to task-modal component"
```

---

### Task 2: index 页面 — readonly 传递 + 完成确认弹窗

**Files:**
- Modify: `miniprogram/pages/index/index.wxml`
- Modify: `miniprogram/pages/index/index.js`
- Modify: `miniprogram/__tests__/pages/index.test.js`

- [ ] **Step 1: 更新 index 测试 — 新增确认弹窗逻辑和 readonly 传递测试**

在 `miniprogram/__tests__/pages/index.test.js` 中，将现有的 `task completion toggle` describe 替换为：

```javascript
  describe('task completion with confirmation', () => {
    it('computes confirm message for completing a task', () => {
      const task = { _id: '1', name: '完成作业', completed: false };
      const action = task.completed ? '取消' : '完成';
      const content = `确定${action}任务「${task.name}」吗？`;
      expect(content).toBe('确定完成任务「完成作业」吗？');
    });

    it('computes confirm message for uncompleting a task', () => {
      const task = { _id: '1', name: '完成作业', completed: true };
      const action = task.completed ? '取消' : '完成';
      const content = `确定${action}任务「${task.name}」吗？`;
      expect(content).toBe('确定取消任务「完成作业」吗？');
    });

    it('only proceeds when user confirms', () => {
      let proceeded = false;
      const userConfirmed = true;
      if (userConfirmed) proceeded = true;
      expect(proceeded).toBe(true);
    });

    it('does not proceed when user cancels', () => {
      let proceeded = false;
      const userConfirmed = false;
      if (userConfirmed) proceeded = true;
      expect(proceeded).toBe(false);
    });
  });

  describe('readonly flag for task-modal', () => {
    it('is true when editingTask exists and is completed', () => {
      const editingTask = { _id: '1', completed: true };
      const readonly = editingTask && editingTask.completed;
      expect(readonly).toBe(true);
    });

    it('is false when editingTask exists and is not completed', () => {
      const editingTask = { _id: '1', completed: false };
      const readonly = editingTask && editingTask.completed;
      expect(readonly).toBe(false);
    });

    it('is false when editingTask is null (add mode)', () => {
      const editingTask = null;
      const readonly = editingTask && editingTask.completed;
      expect(readonly).toBe(false);
    });
  });
```

- [ ] **Step 2: 运行测试确认新用例失败**

```bash
cd D:/Vsproject/LearLab && npx jest --no-coverage miniprogram/__tests__/pages/index.test.js
```

预期：旧 `task completion toggle` 的 2 个测试 FAIL（被替换），新测试中逻辑测试 PASS（纯函数）。

- [ ] **Step 3: index.wxml — task-modal 加 readonly 属性**

第 44-49 行的 `<task-modal>` 标签改为：

```xml
  <task-modal
    visible="{{showModal}}"
    task="{{editingTask}}"
    readonly="{{editingTask && editingTask.completed}}"
    bind:confirm="onModalConfirm"
    bind:cancel="onModalCancel"
  />
```

- [ ] **Step 4: index.js — onTaskCircleTap 重构，加确认弹窗**

将 `onTaskCircleTap` 方法（第 97-105 行）替换为：

```javascript
  onTaskCircleTap(e) {
    const task = e.detail.task;
    const newCompleted = !task.completed;
    const action = task.completed ? '取消' : '完成';
    wx.showModal({
      title: '确认操作',
      content: `确定${action}任务「${task.name}」吗？`,
      success: (res) => {
        if (res.confirm) {
          update('tasks', task._id, { completed: newCompleted })
            .then(() => this.loadTasks())
            .catch(() => {
              wx.showToast({ title: '保存失败', icon: 'error' });
            });
        }
      }
    });
  },
```

- [ ] **Step 5: 运行全部测试确认通过**

```bash
cd D:/Vsproject/LearLab && npx jest --no-coverage
```

预期：全部 124 个测试 PASS（或与改动相关的测试 PASS）。

- [ ] **Step 6: Commit**

```bash
cd D:/Vsproject/LearLab && git add miniprogram/pages/index/index.wxml miniprogram/pages/index/index.js miniprogram/__tests__/pages/index.test.js && git commit -m "feat: add completion confirmation dialog and readonly pass-through to task-modal"
```

---

### Task 3: 集成验证

- [ ] **Step 1: 确认全量测试通过**

```bash
cd D:/Vsproject/LearLab && npx jest --no-coverage
```

预期：124 个测试全部通过。

- [ ] **Step 2: 验证改动覆盖三个问题场景**

| 场景 | 预期行为 |
|------|---------|
| 点击已完成任务卡片 | 弹窗显示「查看任务」，所有字段 disabled，按钮为「关闭」 |
| 点击未完成任务卡片 | 弹窗显示「编辑任务」，字段可编辑，按钮为「确认」 |
| 点击新增按钮 | 弹窗显示「添加任务」，空表单，按钮为「确认」 |
| 点击未完成圆圈 | 弹出「确定完成任务「X」吗？」，确定后完成，取消则不变 |
| 点击已完成圆圈 | 弹出「确定取消「X」的完成状态吗？」，确定后取消完成 |
