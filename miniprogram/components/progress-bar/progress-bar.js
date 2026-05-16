Component({
  properties: {
    done: {
      type: Number,
      value: 0
    },
    total: {
      type: Number,
      value: 0
    }
  },

  data: {
    percent: 0
  },

  observers: {
    'done, total': function (done, total) {
      const percent = total > 0 ? Math.round((done / total) * 100) : 0;
      this.setData({ percent });
    }
  }
});
