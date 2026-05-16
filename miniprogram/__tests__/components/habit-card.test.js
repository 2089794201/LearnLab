/**
 * @jest-environment jsdom
 */
const path = require('path');
const simulate = require('miniprogram-simulate');

describe('habit-card', () => {
  const componentPath = path.resolve(__dirname, '../../components/habit-card/habit-card');
  let id;

  beforeAll(() => {
    id = simulate.load(componentPath);
  });

  it('renders without crashing', () => {
    const comp = simulate.render(id, {
      habit: { _id: '1', name: '每天阅读', streak: 5, best_streak: 10 },
      checked: false
    });
    expect(comp).toBeTruthy();
  });

  it('renders habit card element', () => {
    const comp = simulate.render(id, {
      habit: { _id: '1', name: '每天阅读', streak: 5, best_streak: 10 },
      checked: false
    });
    const card = comp.querySelector('.habit-card');
    expect(card).toBeTruthy();
  });

  it('renders streak when streak > 0', () => {
    const comp = simulate.render(id, {
      habit: { _id: '1', name: '阅读', streak: 5, best_streak: 10 },
      checked: false
    });
    const streak = comp.querySelector('.habit-streak');
    expect(streak).toBeTruthy();
  });

  it('hides streak when zero', () => {
    const comp = simulate.render(id, {
      habit: { _id: '1', name: '阅读', streak: 0, best_streak: 0 },
      checked: false
    });
    const streak = comp.querySelector('.habit-streak');
    expect(streak).toBeFalsy();
  });

  it('shows checked state', () => {
    const comp = simulate.render(id, {
      habit: { _id: '1', name: '阅读', streak: 3, best_streak: 5 },
      checked: true
    });
    const checkBox = comp.querySelector('.checked');
    expect(checkBox).toBeTruthy();
  });

  it('shows unchecked state', () => {
    const comp = simulate.render(id, {
      habit: { _id: '1', name: '阅读', streak: 3, best_streak: 5 },
      checked: false
    });
    const unchecked = comp.querySelector('.unchecked');
    expect(unchecked).toBeTruthy();
  });

  it('shows new record badge when streak >= best_streak', () => {
    const comp = simulate.render(id, {
      habit: { _id: '1', name: '阅读', streak: 10, best_streak: 10 },
      checked: false
    });
    const record = comp.querySelector('.streak-record');
    expect(record).toBeTruthy();
  });
});
