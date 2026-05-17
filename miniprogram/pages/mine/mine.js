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
    showAbout: false,
    isDarkMode: true,
    themeClass: ''
  },

  onShow() {
    const theme = wx.getStorageSync('learnlab_theme') || 'dark';
    this.setData({
      isDarkMode: theme === 'dark',
      themeClass: theme === 'light' ? 'theme-light' : ''
    });
    wx.setPageStyle({
      style: { '--color-bg': theme === 'light' ? '#f0f4f4' : '#080c0c' }
    });
    this.loadStats();
  },

  onThemeToggle(e) {
    const isDark = e.detail.value;
    const theme = isDark ? 'dark' : 'light';
    wx.setStorageSync('learnlab_theme', theme);
    getApp().globalData.theme = theme;
    this.setData({
      isDarkMode: isDark,
      themeClass: isDark ? '' : 'theme-light'
    });
    wx.setPageStyle({
      style: { '--color-bg': isDark ? '#080c0c' : '#f0f4f4' }
    });
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#0d9488'
    });
    wx.setBackgroundColor({
      backgroundColor: isDark ? '#080c0c' : '#f0f4f4'
    });
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
