App({
  onLaunch() {
    wx.cloud.init({
      env: '<YOUR-ENV-ID>',
      traceUser: true
    });
  },
  globalData: {
    loggedIn: false,
    code: null
  }
});
