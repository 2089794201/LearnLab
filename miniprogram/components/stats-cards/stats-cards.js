Component({
  properties: {
    stats: {
      type: Object,
      value: {
        totalTasks: 0,
        completedTasks: 0,
        completionRate: 0,
        habitQualified: 0
      }
    },
    loading: {
      type: Boolean,
      value: false
    }
  }
});
