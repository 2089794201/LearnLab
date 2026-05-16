/**
 * @jest-environment jsdom
 */
const path = require('path');
const simulate = require('miniprogram-simulate');

describe('task-modal', () => {
  const componentPath = path.resolve(__dirname, '../../components/task-modal/task-modal');
  let id;

  beforeAll(() => {
    id = simulate.load(componentPath);
  });

  it('renders add mode by default', () => {
    const comp = simulate.render(id, { visible: true, task: null });
    expect(comp).toBeTruthy();
    const overlay = comp.querySelector('.modal-overlay');
    expect(overlay).toBeTruthy();
  });

  it('renders edit mode when task provided', () => {
    const comp = simulate.render(id, {
      visible: true,
      task: { _id: '1', name: '完成作业', start_time: '09:00', end_time: '10:30', duration: 90, priority: 'high', notes: '' }
    });
    expect(comp).toBeTruthy();
  });

  it('is hidden when visible is false', () => {
    const comp = simulate.render(id, { visible: false, task: null });
    const overlay = comp.querySelector('.modal-overlay');
    expect(overlay).toBeFalsy();
  });

  it('renders duration when times are set', () => {
    const comp = simulate.render(id, {
      visible: true,
      task: { _id: '1', name: 'Test', start_time: '09:00', end_time: '10:30', duration: 90, priority: 'medium', notes: '' }
    });
    const durationEl = comp.querySelector('.duration-display');
    expect(durationEl).toBeTruthy();
  });

  it('renders priority options', () => {
    const comp = simulate.render(id, { visible: true, task: null });
    const options = comp.querySelectorAll('.priority-option');
    expect(options.length).toBe(3);
  });

  it('renders readonly mode - all inputs disabled', () => {
    const comp = simulate.render(id, {
      visible: true,
      readonly: true,
      task: { _id: '1', name: '已完成任务', start_time: '09:00', end_time: '10:30', duration: 90, priority: 'high', notes: '', completed: true }
    });
    const inputs = comp.querySelectorAll('.form-input');
    const inputWithDisabled = inputs.filter(el => {
      const attrs = el._exparserNode._vt ? el._exparserNode._vt.attrs : [];
      return attrs.some(a => a.name === 'disabled');
    });
    expect(inputWithDisabled.length).toBe(2);
    inputWithDisabled.forEach(el => {
      const disabledAttr = el._exparserNode._vt.attrs.find(a => a.name === 'disabled');
      expect(disabledAttr.value).toBe(true);
    });
  });

  it('renders confirm button text as 关闭 in readonly mode', () => {
    const comp = simulate.render(id, {
      visible: true,
      readonly: true,
      task: { _id: '1', name: '已完成任务', start_time: '09:00', end_time: '10:30', duration: 90, priority: 'high', notes: '', completed: true }
    });
    const title = comp.querySelector('.modal-title');
    expect(title.dom.textContent).toContain('查看');
  });

  it('renders confirm button text as 确认 in normal mode', () => {
    const comp = simulate.render(id, { visible: true, task: null });
    const btn = comp.querySelector('.btn-primary');
    expect(btn.dom.textContent).toContain('确认');
  });
});
