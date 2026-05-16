/**
 * @jest-environment jsdom
 */
const path = require('path');
const simulate = require('miniprogram-simulate');

describe('progress-bar', () => {
  const componentPath = path.resolve(__dirname, '../../components/progress-bar/progress-bar');
  let id;

  beforeAll(() => {
    id = simulate.load(componentPath);
  });

  it('renders without crashing', () => {
    const comp = simulate.render(id, { done: 3, total: 5 });
    expect(comp).toBeTruthy();
  });

  it('renders progress bar element', () => {
    const comp = simulate.render(id, { done: 3, total: 5 });
    const bar = comp.querySelector('.progress-bar');
    expect(bar).toBeTruthy();
  });

  it('renders fill element', () => {
    const comp = simulate.render(id, { done: 3, total: 5 });
    const fill = comp.querySelector('.progress-fill');
    expect(fill).toBeTruthy();
  });

  it('renders with zero values', () => {
    const comp = simulate.render(id, { done: 0, total: 0 });
    expect(comp).toBeTruthy();
  });

  it('renders with full progress', () => {
    const comp = simulate.render(id, { done: 5, total: 5 });
    const fill = comp.querySelector('.progress-fill');
    expect(fill).toBeTruthy();
  });

  it('renders with partial progress', () => {
    const comp = simulate.render(id, { done: 1, total: 3 });
    const fill = comp.querySelector('.progress-fill');
    expect(fill).toBeTruthy();
  });
});
