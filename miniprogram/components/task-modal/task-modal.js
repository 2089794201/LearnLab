const { validateTaskName, validateTimeRange } = require('../../utils/validator');

Component({
  properties: {
    visible: {
      type: Boolean,
      value: false
    },
    task: {
      type: Object,
      value: null
    },
    readonly: {
      type: Boolean,
      value: false
    }
  },

  data: {
    name: '',
    startTime: '',
    endTime: '',
    priority: 'medium',
    notes: '',
    duration: 0,
    errors: {}
  },

  observers: {
    'visible, task': function (visible, task) {
      if (visible) {
        if (task) {
          this.setData({
            name: task.name || '',
            startTime: task.start_time || '',
            endTime: task.end_time || '',
            priority: task.priority || 'medium',
            notes: task.notes || '',
            duration: task.duration || 0,
            errors: {}
          });
        } else {
          this.setData({
            name: '',
            startTime: '',
            endTime: '',
            priority: 'medium',
            notes: '',
            duration: 0,
            errors: {}
          });
        }
      }
    }
  },

  methods: {
    onNameInput(e) {
      this.setData({ name: e.detail.value });
    },

    onStartTimeChange(e) {
      if (this.data.readonly) return;
      const startTime = e.detail.value;
      this.setData({ startTime });
      this.calcDuration(startTime, this.data.endTime);
    },

    onEndTimeChange(e) {
      if (this.data.readonly) return;
      const endTime = e.detail.value;
      this.setData({ endTime });
      this.calcDuration(this.data.startTime, endTime);
    },

    calcDuration(startTime, endTime) {
      if (!startTime || !endTime) return;
      const [sh, sm] = startTime.split(':').map(Number);
      const [eh, em] = endTime.split(':').map(Number);
      const mins = (eh * 60 + em) - (sh * 60 + sm);
      if (mins > 0) {
        this.setData({ duration: mins });
      }
    },

    onPriorityTap(e) {
      if (this.data.readonly) return;
      this.setData({ priority: e.currentTarget.dataset.value });
    },

    onNotesInput(e) {
      this.setData({ notes: e.detail.value });
    },

    onConfirm() {
      if (this.data.readonly) {
        this.triggerEvent('cancel');
        return;
      }
      const errors = {};
      const nameResult = validateTaskName(this.data.name);
      if (!nameResult.valid) {
        errors.name = nameResult.message;
      }
      const timeResult = validateTimeRange(this.data.startTime, this.data.endTime);
      if (!timeResult.valid) {
        errors.time = timeResult.message;
      }
      if (Object.keys(errors).length > 0) {
        this.setData({ errors });
        return;
      }
      this.triggerEvent('confirm', {
        taskData: {
          name: this.data.name.trim(),
          start_time: this.data.startTime,
          end_time: this.data.endTime,
          priority: this.data.priority,
          duration: this.data.duration,
          notes: this.data.notes.trim()
        }
      });
      this.setData({ errors: {} });
    },

    onCancel() {
      this.triggerEvent('cancel');
    },

    onContentTap() {},

    onOverlayTap() {
      this.triggerEvent('cancel');
    }
  }
});
