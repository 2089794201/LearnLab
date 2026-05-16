function validateTaskName(name) {
  if (!name || name.trim().length === 0) {
    return { valid: false, message: '任务名称不能为空' };
  }
  if (name.trim().length > 50) {
    return { valid: false, message: '任务名称不能超过50个字符' };
  }
  return { valid: true, message: '' };
}

function validateTimeRange(startTime, endTime) {
  const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timePattern.test(startTime) || !timePattern.test(endTime)) {
    return { valid: false, message: '时间格式不正确' };
  }
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  if (endHour < startHour || (endHour === startHour && endMin <= startMin)) {
    return { valid: false, message: '结束时间必须大于开始时间' };
  }
  return { valid: true, message: '' };
}

function validateHabitName(name) {
  if (!name || name.trim().length === 0) {
    return { valid: false, message: '习惯名称不能为空' };
  }
  if (name.trim().length > 30) {
    return { valid: false, message: '习惯名称不能超过30个字符' };
  }
  return { valid: true, message: '' };
}

module.exports = {
  validateTaskName,
  validateTimeRange,
  validateHabitName
};
