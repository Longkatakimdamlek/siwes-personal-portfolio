/**
 * scripts/generate-pwa-icons.js
 * Programmatically generates valid PNG and SVG icons for PWA compliance
 * without requiring heavy external canvas dependencies.
 * Uses Node.js built-in 'zlib' and standard PNG binary encoding.
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 table for PNG chunk checksums
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c >>> 0;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const toCrc = Buffer.concat([typeBuf, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(toCrc), 0);

  return Buffer.concat([lenBuf, toCrc, crcBuf]);
}

/**
 * Generates an RGBA image buffer with a dark slate background, purple gradient,
 * glowing circular border, and a stylized code bracket monogram < / >.
 */
function renderIconRgba(size, isMaskable = false) {
  const width = size;
  const height = size;
  const buffer = Buffer.alloc(width * height * 4);

  const cx = width / 2;
  const cy = height / 2;
  const outerRadius = isMaskable ? width * 0.38 : width * 0.45;
  const innerRadius = outerRadius * 0.90;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Base background: Dark violet-slate (#0b0b12)
      let r = 11;
      let g = 11;
      let b = 18;
      let a = 255;

      // Radial purple ambient glow in center
      const centerFactor = Math.max(0, 1 - dist / (width * 0.5));
      r += Math.round(centerFactor * 70); // purple boost
      g += Math.round(centerFactor * 25);
      b += Math.round(centerFactor * 130);

      // Gradient accent circle / rounded container
      if (dist <= outerRadius) {
        // Linear top-left to bottom-right gradient (124, 58, 237 -> 168, 85, 247)
        const gradT = (x + y) / (width + height);
        const cardR = Math.round(124 + gradT * (168 - 124));
        const cardG = Math.round(58 + gradT * (85 - 58));
        const cardB = Math.round(237 + gradT * (247 - 237));

        if (dist > innerRadius) {
          // Border ring
          const ringT = (dist - innerRadius) / (outerRadius - innerRadius);
          r = cardR;
          g = cardG;
          b = cardB;
        } else {
          // Card interior: rich dark purple (#141426)
          r = Math.round(20 + centerFactor * 40);
          g = Math.round(20 + centerFactor * 20);
          b = Math.round(38 + centerFactor * 80);
        }
      }

      // Draw stylized bracket glyphs: < / >
      // Normalize coordinate inside inner circle: [-1, 1]
      const nx = (x - cx) / (innerRadius * 0.85);
      const ny = (y - cy) / (innerRadius * 0.85);

      let isGlyph = false;
      const stroke = 0.12;

      // Left bracket '<'
      if (nx >= -0.65 && nx <= -0.15 && Math.abs(ny) <= 0.5) {
        const expectedX = -0.15 - (1 - Math.abs(ny) / 0.5) * 0.45;
        if (Math.abs(nx - expectedX) < stroke) {
          isGlyph = true;
        }
      }

      // Slash '/'
      if (Math.abs(ny) <= 0.55) {
        const expectedSlashX = -ny * 0.45;
        if (Math.abs(nx - expectedSlashX) < stroke * 0.9) {
          isGlyph = true;
        }
      }

      // Right bracket '>'
      if (nx >= 0.15 && nx <= 0.65 && Math.abs(ny) <= 0.5) {
        const expectedX = 0.15 + (1 - Math.abs(ny) / 0.5) * 0.45;
        if (Math.abs(nx - expectedX) < stroke) {
          isGlyph = true;
        }
      }

      if (isGlyph) {
        r = 255;
        g = 255;
        b = 255;
      }

      buffer[idx] = Math.min(255, Math.max(0, r));
      buffer[idx + 1] = Math.min(255, Math.max(0, g));
      buffer[idx + 2] = Math.min(255, Math.max(0, b));
      buffer[idx + 3] = a;
    }
  }

  return buffer;
}

function generatePng(size, isMaskable = false) {
  const width = size;
  const height = size;
  const rgba = renderIconRgba(size, isMaskable);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth: 8
  ihdrData[9] = 6; // Color type: 6 (RGBA)
  ihdrData[10] = 0; // Compression: 0 (deflate)
  ihdrData[11] = 0; // Filter: 0
  ihdrData[12] = 0; // Interlace: 0
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // IDAT Chunk: raw scanlines with filter byte 0 (None) at start of each line
  const scanlineLength = 1 + width * 4;
  const rawData = Buffer.alloc(height * scanlineLength);

  for (let y = 0; y < height; y++) {
    const rawOffset = y * scanlineLength;
    rawData[rawOffset] = 0; // Filter type None
    rgba.copy(rawData, rawOffset + 1, y * width * 4, (y + 1) * width * 4);
  }

  const compressed = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressed);

  // IEND Chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function generateSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <radialGradient id="ambient" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#0b0b12" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a855f7" />
      <stop offset="50%" stop-color="#7c3aed" />
      <stop offset="100%" stop-color="#4f46e5" />
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect width="512" height="512" rx="128" fill="#0b0b12" />
  <circle cx="256" cy="256" r="240" fill="url(#ambient)" />
  
  <!-- Outer Ring -->
  <circle cx="256" cy="256" r="190" fill="#141424" stroke="url(#ringGrad)" stroke-width="12" />
  
  <!-- Code Monogram: < / > -->
  <path d="M 180 180 L 120 256 L 180 332" fill="none" stroke="#f9fafb" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M 285 160 L 225 352" fill="none" stroke="#a855f7" stroke-width="24" stroke-linecap="round" />
  <path d="M 332 180 L 392 256 L 332 332" fill="none" stroke="#f9fafb" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" />
</svg>`;
}

const publicDir = path.join(__dirname, '..', 'public');

console.log('Generating PWA icons in', publicDir);

// 1. SVG
fs.writeFileSync(path.join(publicDir, 'icon.svg'), generateSvg(), 'utf8');
console.log('✓ icon.svg created');

// 2. PNG 192x192
fs.writeFileSync(path.join(publicDir, 'icon-192.png'), generatePng(192, false));
console.log('✓ icon-192.png created');

// 3. PNG 512x512
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), generatePng(512, false));
console.log('✓ icon-512.png created');

// 4. PNG maskable 512x512
fs.writeFileSync(path.join(publicDir, 'icon-maskable-512.png'), generatePng(512, true));
console.log('✓ icon-maskable-512.png created');

// 5. Apple touch icon 180x180
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generatePng(180, false));
console.log('✓ apple-touch-icon.png created');

// 6. Favicon 48x48 PNG (or copy)
fs.writeFileSync(path.join(publicDir, 'favicon.png'), generatePng(48, false));
console.log('✓ favicon.png created');

console.log('All PWA icons generated successfully!');
