const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { action } = event;
  const openid = cloud.getWXContext().OPENID;

  if (action === 'exportAll') {
    const [tasksRes, habitsRes, checkinsRes] = await Promise.all([
      db.collection('tasks').where({ _openid: openid }).get(),
      db.collection('habits').where({ _openid: openid }).get(),
      db.collection('checkins').where({ _openid: openid }).get()
    ]);

    const exportData = {
      exportedAt: new Date().toISOString(),
      tasks: tasksRes.data,
      habits: habitsRes.data,
      checkins: checkinsRes.data
    };

    const fileName = `learnlab-export-${Date.now()}.json`;
    const fileContent = JSON.stringify(exportData, null, 2);

    const uploadRes = await cloud.uploadFile({
      cloudPath: `exports/${openid}/${fileName}`,
      fileContent: Buffer.from(fileContent)
    });

    return {
      fileID: uploadRes.fileID,
      fileName
    };
  }

  return { error: 'Unknown action' };
};
