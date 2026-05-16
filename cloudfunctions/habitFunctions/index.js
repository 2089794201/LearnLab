const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { action, habitId, date } = event;
  const openid = cloud.getWXContext().OPENID;

  if (action === 'updateStreak') {
    const habitRes = await db.collection('habits').doc(habitId).get();
    const habit = habitRes.data;
    if (!habit) return { error: 'Habit not found' };

    const yesterday = getYesterday(date);
    const checkinRes = await db.collection('checkins')
      .where({ habit_id: habitId, date })
      .get();

    const hasCheckinToday = checkinRes.data.length > 0;

    if (hasCheckinToday) {
      if (habit.last_checkin_date === yesterday) {
        const newStreak = habit.streak + 1;
        const newBest = Math.max(newStreak, habit.best_streak);
        await db.collection('habits').doc(habitId).update({
          data: {
            streak: newStreak,
            best_streak: newBest,
            last_checkin_date: date
          }
        });
        return { streak: newStreak, best_streak: newBest };
      } else if (habit.last_checkin_date === date) {
        return { streak: habit.streak, best_streak: habit.best_streak };
      } else {
        const newStreak = 1;
        const newBest = Math.max(newStreak, habit.best_streak);
        await db.collection('habits').doc(habitId).update({
          data: {
            streak: newStreak,
            best_streak: newBest,
            last_checkin_date: date
          }
        });
        return { streak: newStreak, best_streak: newBest };
      }
    } else {
      const allCheckins = await db.collection('checkins')
        .where({ habit_id: habitId })
        .orderBy('date', 'desc')
        .get();

      if (allCheckins.data.length === 0) {
        await db.collection('habits').doc(habitId).update({
          data: {
            streak: 0,
            last_checkin_date: ''
          }
        });
        return { streak: 0, best_streak: habit.best_streak };
      }

      let newStreak = 0;
      let expectedDate = date;

      for (const checkin of allCheckins.data) {
        if (checkin.date === expectedDate) {
          newStreak++;
          expectedDate = getYesterday(expectedDate);
        } else {
          break;
        }
      }

      await db.collection('habits').doc(habitId).update({
        data: {
          streak: newStreak,
          last_checkin_date: allCheckins.data[0].date
        }
      });

      return { streak: newStreak, best_streak: habit.best_streak };
    }
  }

  return { error: 'Unknown action' };
};

function getYesterday(dateStr) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
