const config = require('./config');

App({
  onLaunch() {
    wx.cloud.init({
      env: config.cloudEnv,
      traceUser: true
    });
    const theme = wx.getStorageSync('learnlab_theme') || 'dark';
    this.globalData.theme = theme;
  },
  globalData: {
    loggedIn: false,
    code: null,
    theme: 'dark'
  }
});
