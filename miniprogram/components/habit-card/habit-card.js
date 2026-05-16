Component({
  properties: {
    habit: {
      type: Object,
      value: {}
    },
    checked: {
      type: Boolean,
      value: false
    }
  },

  methods: {
    onCheck() {
      this.triggerEvent('check', { habitId: this.data.habit._id });
    },

    onLongPress() {
      this.triggerEvent('longpress', { habit: this.data.habit });
    },

    onSwipeLeft() {
      this.triggerEvent('swipeleft', { habit: this.data.habit });
    }
  }
});
