const { getDaysInMonth, getPrevMonth, getNextMonth, formatDate } = require('../../utils/date');

Component({
  properties: {
    year: {
      type: Number,
      value: new Date().getFullYear()
    },
    month: {
      type: Number,
      value: new Date().getMonth() + 1
    },
    markedDates: {
      type: Array,
      value: []
    }
  },

  data: {
    days: [],
    monthLabel: '',
    today: formatDate(new Date())
  },

  lifetimes: {
    attached() {
      this.renderCalendar();
    }
  },

  observers: {
    'year, month, markedDates': function () {
      this.renderCalendar();
    }
  },

  methods: {
    renderCalendar() {
      const { year, month } = this.data;
      const daysInMonth = getDaysInMonth(year, month);
      const firstDay = new Date(year, month - 1, 1).getDay();

      const days = [];
      const prevMonth = getPrevMonth(year, month);
      const prevDays = getDaysInMonth(prevMonth.year, prevMonth.month);

      for (let i = firstDay - 1; i >= 0; i--) {
        days.push({
          date: `${prevMonth.year}-${String(prevMonth.month).padStart(2, '0')}-${String(prevDays - i).padStart(2, '0')}`,
          day: prevDays - i,
          isCurrentMonth: false,
          isToday: false,
          hasTask: false
        });
      }

      for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        days.push({
          date: dateStr,
          day: d,
          isCurrentMonth: true,
          isToday: dateStr === this.data.today,
          hasTask: this.data.markedDates.includes(dateStr)
        });
      }

      const remaining = 42 - days.length;
      const nextMonth = getNextMonth(year, month);
      for (let d = 1; d <= remaining; d++) {
        days.push({
          date: `${nextMonth.year}-${String(nextMonth.month).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
          day: d,
          isCurrentMonth: false,
          isToday: false,
          hasTask: false
        });
      }

      this.setData({
        days,
        monthLabel: `${year}年${month}月`
      });
    },

    onPrevMonth() {
      const { year, month } = getPrevMonth(this.data.year, this.data.month);
      this.setData({ year, month });
      this.triggerEvent('monthchange', { year, month });
    },

    onNextMonth() {
      const { year, month } = getNextMonth(this.data.year, this.data.month);
      this.setData({ year, month });
      this.triggerEvent('monthchange', { year, month });
    },

    onDateTap(e) {
      const { date } = e.currentTarget.dataset;
      this.triggerEvent('datetap', { date });
    }
  }
});
