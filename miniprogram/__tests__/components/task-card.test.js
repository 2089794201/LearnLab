/**
 * @jest-environment jsdom
 */
const path = require('path');
const simulate = require('miniprogram-simulate');

describe('task-card', () => {
  const componentPath = path.resolve(__dirname, '../../components/task-card/task-card');
  let id;

  beforeAll(() => {
    id = simulate.load(componentPath);
  });

  it('renders without crashing with task data', () => {
    const comp = simulate.render(id, {
      task: {
        _id: '1', name: '完成作业', start_time: '09:00', end_time: '10:30', duration: 90, priority: 'high', completed: false
      }
    });
    expect(comp).toBeTruthy();
  });

  it('renders task card element', () => {
    const comp = simulate.render(id, {
      task: {
        _id: '1', name: '完成作业', start_time: '09:00', end_time: '10:30', duration: 90, priority: 'high', completed: false
      }
    });
    const card = comp.querySelector('.task-card');
    expect(card).toBeTruthy();
  });

  it('renders completed state', () => {
    const comp = simulate.render(id, {
      task: { _id: '1', name: 'Test', start_time: '09:00', end_time: '10:00', duration: 60, priority: 'medium', completed: true }
    });
    const done = comp.querySelector('.circle-done');
    expect(done).toBeTruthy();
  });

  it('renders priority dot', () => {
    const comp = simulate.render(id, {
      task: { _id: '1', name: 'Test', start_time: '09:00', end_time: '10:00', duration: 60, priority: 'high', completed: false }
    });
    const dot = comp.querySelector('.priority-high');
    expect(dot).toBeTruthy();
  });

  it('renders empty circle for incomplete task', () => {
    const comp = simulate.render(id, {
      task: { _id: '1', name: 'Test', start_time: '09:00', end_time: '10:00', duration: 60, priority: 'medium', completed: false }
    });
    const empty = comp.querySelector('.circle-empty');
    expect(empty).toBeTruthy();
  });
});
