const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { action, year, month } = event;
  const openid = cloud.getWXContext().OPENID;

  if (action === 'batchQuery') {
    const daysInMonth = new Date(year, month, 0).getDate();
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;

    const res = await db.collection('tasks')
      .where({
        _openid: openid,
        date: db.command.gte(startDate).and(db.command.lte(endDate))
      })
      .field({ date: true })
      .get();

    const dates = new Set();
    res.data.forEach(item => dates.add(item.date));
    return { dates: [...dates] };
  }

  return { error: 'Unknown action' };
};
