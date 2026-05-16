/**
 * @jest-environment jsdom
 */
const path = require('path');
const simulate = require('miniprogram-simulate');

describe('stats-cards', () => {
  const componentPath = path.resolve(__dirname, '../../components/stats-cards/stats-cards');
  let id;

  beforeAll(() => {
    id = simulate.load(componentPath);
  });

  it('renders without crashing', () => {
    const comp = simulate.render(id, {
      stats: { totalTasks: 10, completedTasks: 8, completionRate: 80, habitQualified: 2 },
      loading: false
    });
    expect(comp).toBeTruthy();
  });

  it('renders 4 stat cards', () => {
    const comp = simulate.render(id, {
      stats: { totalTasks: 10, completedTasks: 8, completionRate: 80, habitQualified: 2 },
      loading: false
    });
    const cards = comp.querySelectorAll('.stat-card');
    expect(cards.length).toBe(4);
  });

  it('renders loading state', () => {
    const comp = simulate.render(id, {
      stats: { totalTasks: 0, completedTasks: 0, completionRate: 0, habitQualified: 0 },
      loading: true
    });
    const loading = comp.querySelector('.stats-loading');
    expect(loading).toBeTruthy();
  });

  it('renders with zero stats', () => {
    const comp = simulate.render(id, {
      stats: { totalTasks: 0, completedTasks: 0, completionRate: 0, habitQualified: 0 },
      loading: false
    });
    const cards = comp.querySelectorAll('.stat-card');
    expect(cards.length).toBe(4);
  });
});
