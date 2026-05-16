const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const SIZE = 40;
const GRAY = '#999999';
const INDIGO = '#6366f1';
const WHITE = '#ffffff';
const TRANSPARENT = '#00000000';

function hexToRgba(hex) {
  if (hex === TRANSPARENT) return { r: 0, g: 0, b: 0, a: 0 };
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b, a: 255 };
}

function setPixel(data, x, y, color) {
  const rgba = hexToRgba(color);
  const idx = (y * SIZE + x) * 4;
  data[idx] = rgba.r;
  data[idx + 1] = rgba.g;
  data[idx + 2] = rgba.b;
  data[idx + 3] = rgba.a;
}

function createPng() {
  const png = new PNG({ width: SIZE, height: SIZE });
  for (let i = 0; i < png.data.length; i++) {
    png.data[i] = 0;
  }
  return png;
}

function fillCircle(png, cx, cy, r, color) {
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const dx = x - cx, dy = y - cy;
      if (dx * dx + dy * dy <= r * r) {
        setPixel(png.data, x, y, color);
      }
    }
  }
}

function fillRect(png, x0, y0, x1, y1, color) {
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (x >= 0 && x < SIZE && y >= 0 && y < SIZE) {
        setPixel(png.data, x, y, color);
      }
    }
  }
}

function drawLine(png, x0, y0, x1, y1, width, color) {
  const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;
  while (true) {
    for (let wy = -Math.floor(width / 2); wy <= Math.floor(width / 2); wy++) {
      for (let wx = -Math.floor(width / 2); wx <= Math.floor(width / 2); wx++) {
        const px = x0 + wx, py = y0 + wy;
        if (px >= 0 && px < SIZE && py >= 0 && py < SIZE) {
          setPixel(png.data, px, py, color);
        }
      }
    }
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x0 += sx; }
    if (e2 < dx) { err += dx; y0 += sy; }
  }
}

// === Home icon: house shape ===
function drawHomeIcon(png, color) {
  fillRect(png, 12, 22, 28, 35, color);
  fillRect(png, 8, 28, 31, 35, color);
  // roof triangle
  for (let y = 10; y <= 22; y++) {
    const progress = (y - 10) / 12;
    const halfW = 8 + progress * 12;
    const left = Math.round(20 - halfW);
    const right = Math.round(20 + halfW);
    for (let x = left; x <= right; x++) {
      setPixel(png.data, x, y, color);
    }
  }
  // door
  fillRect(png, 17, 26, 23, 35, WHITE);
  fillRect(png, 18, 27, 22, 35, color);
}

// === Checkmark icon: circle + check ===
function drawCheckmarkIcon(png, color) {
  fillCircle(png, 20, 20, 16, color);
  fillCircle(png, 20, 20, 12, WHITE);
  // checkmark
  drawLine(png, 13, 20, 17, 25, 3, color);
  drawLine(png, 17, 25, 27, 14, 3, color);
}

// === Person icon: head + body ===
function drawPersonIcon(png, color) {
  fillCircle(png, 20, 12, 8, color);
  fillCircle(png, 20, 12, 5, WHITE);
  // body
  fillRect(png, 10, 22, 30, 36, color);
  fillRect(png, 14, 24, 26, 36, WHITE);
}

// === Grid/calendar icon ===
function drawCalendarIcon(png, color) {
  // header bar
  fillRect(png, 8, 6, 32, 13, color);
  // body
  fillRect(png, 8, 15, 32, 35, WHITE);
  // border
  for (let x = 8; x <= 32; x++) { setPixel(png.data, x, 14, color); }
  for (let x = 8; x <= 32; x++) { setPixel(png.data, x, 35, color); }
  for (let y = 6; y <= 35; y++) { setPixel(png.data, 8, y, color); }
  for (let y = 6; y <= 35; y++) { setPixel(png.data, 32, y, color); }
  // dots
  fillCircle(png, 14, 21, 2, color);
  fillCircle(png, 20, 21, 2, color);
  fillCircle(png, 26, 21, 2, color);
  fillCircle(png, 14, 28, 2, color);
  fillCircle(png, 20, 28, 2, color);
  fillCircle(png, 26, 28, 2, color);
}

const icons = [
  { name: 'tab-index', draw: drawCalendarIcon },
  { name: 'tab-habit', draw: drawCheckmarkIcon },
  { name: 'tab-mine', draw: drawPersonIcon },
];

const outDir = path.resolve(__dirname, '..', 'miniprogram', 'images');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

for (const icon of icons) {
  // inactive (gray)
  const pngInactive = createPng();
  icon.draw(pngInactive, GRAY);
  fs.writeFileSync(path.join(outDir, `${icon.name}.png`), PNG.sync.write(pngInactive));
  console.log(`Created ${icon.name}.png`);

  // active (indigo)
  const pngActive = createPng();
  icon.draw(pngActive, INDIGO);
  fs.writeFileSync(path.join(outDir, `${icon.name}-active.png`), PNG.sync.write(pngActive));
  console.log(`Created ${icon.name}-active.png`);
}

console.log('Done. 6 icons generated in miniprogram/images/');
