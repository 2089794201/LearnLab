Component({
  properties: {
    task: {
      type: Object,
      value: {}
    }
  },

  methods: {
    onCircleTap() {
      this.triggerEvent('circletap', { task: this.data.task });
    },

    onTap() {
      this.triggerEvent('tap', { task: this.data.task });
    },

    onSwipeLeft() {
      this.triggerEvent('swipeleft', { task: this.data.task });
    }
  }
});
