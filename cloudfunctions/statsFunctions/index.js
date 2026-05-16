const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { action, startDate, endDate } = event;
  const openid = cloud.getWXContext().OPENID;

  if (action === 'weeklyStats') {
    const tasksRes = await db.collection('tasks')
      .where({
        _openid: openid,
        date: db.command.gte(startDate).and(db.command.lte(endDate))
      })
      .get();

    const totalTasks = tasksRes.data.length;
    const completedTasks = tasksRes.data.filter(t => t.completed).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const habitsRes = await db.collection('habits')
      .where({ _openid: openid })
      .get();

    let habitQualified = 0;
    for (const habit of habitsRes.data) {
      const checkinsRes = await db.collection('checkins')
        .where({
          habit_id: habit._id,
          date: db.command.gte(startDate).and(db.command.lte(endDate))
        })
        .get();

      const uniqueDays = new Set(checkinsRes.data.map(c => c.date));
      if (uniqueDays.size === 7) {
        habitQualified++;
      }
    }

    return {
      totalTasks,
      completedTasks,
      completionRate,
      habitQualified
    };
  }

  return { error: 'Unknown action' };
};
