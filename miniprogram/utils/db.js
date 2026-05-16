function getDb() {
  return wx.cloud.database();
}

function getCollection(name) {
  return getDb().collection(name);
}

function getTasksByDate(date) {
  return getCollection('tasks')
    .where({ date })
    .orderBy('start_time', 'asc')
    .get()
    .then(res => res.data);
}

function getTaskDatesByMonth(year, month) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;
  const db = getDb();

  return getCollection('tasks')
    .where({
      date: db.command.gte(startDate).and(db.command.lte(endDate))
    })
    .field({ date: true })
    .get()
    .then(res => {
      const dates = new Set();
      res.data.forEach(item => dates.add(item.date));
      return [...dates];
    });
}

function getHabits() {
  return getCollection('habits')
    .orderBy('_id', 'asc')
    .get()
    .then(res => res.data);
}

function getCheckinsByDate(date) {
  return getCollection('checkins')
    .where({ date })
    .get()
    .then(res => res.data);
}

function getCheckinsByHabitAndDate(habitId, date) {
  return getCollection('checkins')
    .where({ habit_id: habitId, date })
    .get()
    .then(res => res.data);
}

function getCheckinsByHabit(habitId) {
  return getCollection('checkins')
    .where({ habit_id: habitId })
    .orderBy('date', 'desc')
    .get()
    .then(res => res.data);
}

function add(collection, data) {
  return getCollection(collection).add({ data });
}

function update(collection, id, data) {
  return getCollection(collection).doc(id).update({ data });
}

function remove(collection, id) {
  return getCollection(collection).doc(id).remove();
}

function removeWhere(collection, condition) {
  return getCollection(collection).where(condition).remove();
}

module.exports = {
  getCollection,
  getTasksByDate,
  getTaskDatesByMonth,
  getHabits,
  getCheckinsByDate,
  getCheckinsByHabitAndDate,
  getCheckinsByHabit,
  add,
  update,
  remove,
  removeWhere
};
