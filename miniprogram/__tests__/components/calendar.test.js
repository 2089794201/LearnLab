/**
 * @jest-environment jsdom
 */
const path = require('path');
const simulate = require('miniprogram-simulate');

describe('calendar', () => {
  const componentPath = path.resolve(__dirname, '../../components/calendar/calendar');
  let id;

  beforeAll(() => {
    id = simulate.load(componentPath);
  });

  it('renders without crashing', () => {
    const comp = simulate.render(id, {
      year: 2026, month: 5, markedDates: []
    });
    expect(comp).toBeTruthy();
  });

  it('renders 42 day cells', () => {
    const comp = simulate.render(id, {
      year: 2026, month: 5, markedDates: []
    });
    const cells = comp.querySelectorAll('.day-cell');
    expect(cells.length).toBe(42);
  });

  it('highlights marked dates with task dots', () => {
    const comp = simulate.render(id, {
      year: 2026, month: 5, markedDates: ['2026-05-16']
    });
    const dots = comp.querySelectorAll('.task-dot');
    expect(dots.length).toBeGreaterThan(0);
  });

  it('renders no task dots for unmarked month', () => {
    const comp = simulate.render(id, {
      year: 2026, month: 5, markedDates: []
    });
    const dots = comp.querySelectorAll('.task-dot');
    expect(dots.length).toBe(0);
  });

  it('renders today highlight', () => {
    const comp = simulate.render(id, {
      year: 2026, month: 5, markedDates: []
    });
    const today = comp.querySelector('.today');
    expect(today).toBeTruthy();
  });

  it('renders other-month days', () => {
    const comp = simulate.render(id, {
      year: 2026, month: 5, markedDates: []
    });
    const others = comp.querySelectorAll('.other-month');
    expect(others.length).toBeGreaterThan(0);
  });
});
