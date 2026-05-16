Page({
  data: {
    userInfo: null,
    stats: {
      totalTasks: 0,
      completedTasks: 0,
      completionRate: 0,
      habitQualified: 0
    },
    loading: true,
    showAbout: false
  },

  onShow() {
    this.loadStats();
  },

  loadStats() {
    this.setData({ loading: true });
    wx.showNavigationBarLoading();
    const { getWeekRange } = require('../../utils/date');
    const { startDate, endDate } = getWeekRange();
    wx.cloud.callFunction({
      name: 'statsFunctions',
      data: {
        action: 'weeklyStats',
        startDate,
        endDate
      }
    }).then(res => {
      this.setData({ stats: res.result, loading: false });
      wx.hideNavigationBarLoading();
    }).catch(() => {
      wx.hideNavigationBarLoading();
      this.setData({ loading: false });
      wx.showToast({ title: '加载失败', icon: 'error' });
    });
  },

  onExport() {
    wx.showLoading({ title: '正在导出数据...' });
    wx.cloud.callFunction({
      name: 'exportFunctions',
      data: { action: 'exportAll' }
    }).then(res => {
      wx.hideLoading();
      const { fileID } = res.result;
      wx.cloud.downloadFile({
        fileID
      }).then(downloadRes => {
        wx.showToast({ title: '数据已导出' });
      }).catch(() => {
        wx.showToast({ title: '下载失败', icon: 'error' });
      });
    }).catch(() => {
      wx.hideLoading();
      wx.showToast({ title: '加载失败', icon: 'error' });
    });
  },

  onSettings() {
    wx.openSetting({});
  },

  onAbout() {
    this.setData({ showAbout: true });
  },

  onAboutClose() {
    this.setData({ showAbout: false });
  },

  onModalStop() {},

  onLogout() {
    wx.showModal({
      title: '确定退出登录？',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync();
          wx.showToast({ title: '已退出' });
        }
      }
    });
  }
});
