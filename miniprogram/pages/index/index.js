const { getToday, formatDisplayDate } = require('../../utils/date');
const { getTasksByDate, getTaskDatesByMonth, add, update, remove } = require('../../utils/db');

Page({
  data: {
    currentView: 'today',
    selectedDate: getToday(),
    displayDate: '',
    tasks: [],
    markedDates: [],
    editingTask: null,
    showModal: false,
    calendarYear: new Date().getFullYear(),
    calendarMonth: new Date().getMonth() + 1
  },

  onLoad() {
    this.setData({ displayDate: formatDisplayDate(this.data.selectedDate) });
  },

  onShow() {
    this.loadTasks();
    this.loadMarkedDates();
  },

  loadTasks() {
    getTasksByDate(this.data.selectedDate)
      .then(tasks => this.setData({ tasks }))
      .catch((err) => {
        console.error('loadTasks failed:', err);
        wx.showToast({ title: '加载失败', icon: 'error' });
      });
  },

  loadMarkedDates() {
    const { calendarYear, calendarMonth } = this.data;
    getTaskDatesByMonth(calendarYear, calendarMonth)
      .then(markedDates => this.setData({ markedDates }))
      .catch((err) => {
        console.error('loadMarkedDates failed:', err);
      });
  },

  goPrevDay() {
    const d = new Date(this.data.selectedDate);
    d.setDate(d.getDate() - 1);
    this.setSelectedDate(d);
  },

  goNextDay() {
    const d = new Date(this.data.selectedDate);
    d.setDate(d.getDate() + 1);
    this.setSelectedDate(d);
  },

  setSelectedDate(date) {
    const { formatDate, formatDisplayDate } = require('../../utils/date');
    const dateStr = formatDate(date);
    this.setData({
      selectedDate: dateStr,
      displayDate: formatDisplayDate(dateStr)
    });
    this.loadTasks();
  },

  switchToToday() {
    this.setData({ currentView: 'today' });
    this.setSelectedDate(new Date());
  },

  switchToCalendar() {
    this.setData({ currentView: 'calendar' });
  },

  switchView(e) {
    const view = e.currentTarget.dataset.view;
    if (view === 'today') {
      this.switchToToday();
    } else {
      this.switchToCalendar();
    }
  },

  onCalendarDateTap(e) {
    const { date } = e.detail;
    this.setData({ currentView: 'today' });
    this.setSelectedDate(new Date(date));
  },

  onMonthChange(e) {
    const { year, month } = e.detail;
    this.setData({ calendarYear: year, calendarMonth: month }, () => {
      this.loadMarkedDates();
    });
  },

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

  onTaskTap(e) {
    const task = e.detail.task;
    this.setData({ editingTask: task, showModal: true });
  },

  onTaskSwipeLeft(e) {
    const task = e.detail.task;
    wx.showModal({
      title: '确定删除任务「' + task.name + '」？',
      success: (res) => {
        if (res.confirm) {
          remove('tasks', task._id)
            .then(() => {
              wx.showToast({ title: '已删除' });
              this.loadTasks();
              this.loadMarkedDates();
            })
            .catch(() => {
              wx.showToast({ title: '保存失败', icon: 'error' });
            });
        }
      }
    });
  },

  onAddTap() {
    this.setData({ editingTask: null, showModal: true });
  },

  onModalConfirm(e) {
    const taskData = e.detail.taskData;
    if (this.data.editingTask) {
      update('tasks', this.data.editingTask._id, taskData)
        .then(() => {
          wx.showToast({ title: '已保存' });
          this.setData({ showModal: false, editingTask: null });
          this.loadTasks();
          this.loadMarkedDates();
        })
        .catch(() => {
          wx.showToast({ title: '保存失败', icon: 'error' });
        });
    } else {
      add('tasks', { ...taskData, date: this.data.selectedDate, completed: false })
        .then(() => {
          wx.showToast({ title: '已添加' });
          this.setData({ showModal: false });
          this.loadTasks();
          this.loadMarkedDates();
        })
        .catch(() => {
          wx.showToast({ title: '保存失败', icon: 'error' });
        });
    }
  },

  onModalCancel() {
    this.setData({ showModal: false, editingTask: null });
  }
});
