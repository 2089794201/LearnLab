const { getToday } = require('../../utils/date');
const { getHabits, getCheckinsByDate, getCheckinsByHabit, add, update, remove, removeWhere } = require('../../utils/db');
const { validateHabitName } = require('../../utils/validator');

Page({
  data: {
    habits: [],
    todayCheckins: {},
    doneCount: 0,
    today: getToday(),
    showNewModal: false,
    showEditModal: false,
    editingHabit: null,
    newHabitName: '',
    editHabitName: '',
    newNameError: '',
    editNameError: ''
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    Promise.all([
      getHabits(),
      getCheckinsByDate(this.data.today)
    ]).then(([habits, checkins]) => {
      const todayCheckins = {};
      checkins.forEach(c => { todayCheckins[c.habit_id] = true; });
      const doneCount = Object.keys(todayCheckins).length;
      this.setData({ habits, todayCheckins, doneCount });
    }).catch(() => {
      wx.showToast({ title: '加载失败', icon: 'error' });
    });
  },

  onNewInput(e) {
    this.setData({ newHabitName: e.detail.value, newNameError: '' });
  },

  onEditInput(e) {
    this.setData({ editHabitName: e.detail.value, editNameError: '' });
  },

  onAddTap() {
    this.setData({ showNewModal: true, newHabitName: '', newNameError: '' });
  },

  onNewCancel() {
    this.setData({ showNewModal: false, newHabitName: '', newNameError: '' });
  },

  onNewConfirm() {
    const result = validateHabitName(this.data.newHabitName);
    if (!result.valid) {
      this.setData({ newNameError: result.message });
      return;
    }
    add('habits', {
      name: this.data.newHabitName.trim(),
      streak: 0,
      best_streak: 0,
      last_checkin_date: ''
    }).then(() => {
      wx.showToast({ title: '已添加' });
      this.setData({ showNewModal: false, newHabitName: '' });
      this.loadData();
    }).catch(() => {
      wx.showToast({ title: '保存失败', icon: 'error' });
    });
  },

  onHabitCheck(e) {
    const { habitId } = e.detail;
    if (this.data.todayCheckins[habitId]) {
      wx.showToast({ title: '今日已打卡', icon: 'none' });
      return;
    }
    add('checkins', {
      habit_id: habitId,
      date: this.data.today
    }).then(() => {
      const todayCheckins = { ...this.data.todayCheckins };
      todayCheckins[habitId] = true;
      const doneCount = Object.keys(todayCheckins).length;
      this.setData({ todayCheckins, doneCount });
      this.callUpdateStreak(habitId, this.data.today);
    }).catch(() => {
      wx.showToast({ title: '打卡失败', icon: 'error' });
    });
  },

  callUpdateStreak(habitId, date) {
    wx.cloud.callFunction({
      name: 'habitFunctions',
      data: { action: 'updateStreak', habitId, date }
    }).then(() => this.loadData())
      .catch(() => {});
  },

  onHabitLongPress(e) {
    const habit = e.detail.habit;
    this.setData({
      showEditModal: true,
      editingHabit: habit,
      editHabitName: habit.name,
      editNameError: ''
    });
  },

  onEditCancel() {
    this.setData({ showEditModal: false, editingHabit: null, editHabitName: '', editNameError: '' });
  },

  onEditConfirm() {
    const result = validateHabitName(this.data.editHabitName);
    if (!result.valid) {
      this.setData({ editNameError: result.message });
      return;
    }
    update('habits', this.data.editingHabit._id, { name: this.data.editHabitName.trim() })
      .then(() => {
        wx.showToast({ title: '已更新' });
        this.setData({ showEditModal: false, editingHabit: null, editHabitName: '' });
        this.loadData();
      })
      .catch(() => {
        wx.showToast({ title: '保存失败', icon: 'error' });
      });
  },

  onModalStop() {},

  onHabitSwipeLeft(e) {
    const habit = e.detail.habit;
    wx.showModal({
      title: '确定删除习惯「' + habit.name + '」？',
      success: (res) => {
        if (res.confirm) {
          Promise.all([
            remove('habits', habit._id),
            removeWhere('checkins', { habit_id: habit._id })
          ]).then(() => {
            wx.showToast({ title: '已删除' });
            this.loadData();
          }).catch(() => {
            wx.showToast({ title: '保存失败', icon: 'error' });
          });
        }
      }
    });
  }
});
