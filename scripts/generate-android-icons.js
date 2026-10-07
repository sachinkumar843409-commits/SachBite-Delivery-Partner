import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createIconPng(width, height, isRound = false, isForeground = false) {
  const bytesPerPixel = 4;
  const rowBytes = width * bytesPerPixel;
  const rawData = Buffer.alloc((rowBytes + 1) * height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width / 2;

  for (let y = 0; y < height; y++) {
    const rowStart = y * (rowBytes + 1);
    rawData[rowStart] = 0; // Filter type: None

    for (let x = 0; x < width; x++) {
      const pxStart = rowStart + 1 + x * bytesPerPixel;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (isForeground) {
        // Foreground for adaptive icon on transparent background
        if (dist < radius * 0.65) {
          // Inner White / Saffron Core
          if (dist < radius * 0.58) {
            rawData[pxStart] = 255;     // R
            rawData[pxStart + 1] = 255; // G
            rawData[pxStart + 2] = 255; // B
            rawData[pxStart + 3] = 255; // A
          } else {
            // Ring
            rawData[pxStart] = 255;
            rawData[pxStart + 1] = 122;
            rawData[pxStart + 2] = 26;
            rawData[pxStart + 3] = 255;
          }
        } else {
          // Transparent
          rawData[pxStart] = 0;
          rawData[pxStart + 1] = 0;
          rawData[pxStart + 2] = 0;
          rawData[pxStart + 3] = 0;
        }
      } else if (isRound) {
        // Round launcher icon
        if (dist <= radius - 1) {
          if (dist < radius * 0.78) {
            // Inner white badge
            rawData[pxStart] = 255;
            rawData[pxStart + 1] = 255;
            rawData[pxStart + 2] = 255;
            rawData[pxStart + 3] = 255;
          } else if (dist < radius * 0.84) {
            // Inner orange stroke
            rawData[pxStart] = 232;
            rawData[pxStart + 1] = 93;
            rawData[pxStart + 2] = 4;
            rawData[pxStart + 3] = 255;
          } else {
            // Outer bright saffron orange
            rawData[pxStart] = 255;
            rawData[pxStart + 1] = 122;
            rawData[pxStart + 2] = 26;
            rawData[pxStart + 3] = 255;
          }
        } else {
          // Outside circle is transparent
          rawData[pxStart] = 0;
          rawData[pxStart + 1] = 0;
          rawData[pxStart + 2] = 0;
          rawData[pxStart + 3] = 0;
        }
      } else {
        // Squircle / standard launcher icon
        const cornerRadius = width * 0.22;
        const inCorner =
          (x < cornerRadius || x > width - cornerRadius) &&
          (y < cornerRadius || y > height - cornerRadius);

        let isInside = true;
        if (inCorner) {
          const cornerX = x < cornerRadius ? cornerRadius : width - cornerRadius;
          const cornerY = y < cornerRadius ? cornerRadius : height - cornerRadius;
          const cdx = x - cornerX;
          const cdy = y - cornerY;
          if (Math.sqrt(cdx * cdx + cdy * cdy) > cornerRadius) {
            isInside = false;
          }
        }

        if (isInside) {
          if (dist < radius * 0.72) {
            // Inner White Card
            rawData[pxStart] = 255;
            rawData[pxStart + 1] = 255;
            rawData[pxStart + 2] = 255;
            rawData[pxStart + 3] = 255;
          } else if (dist < radius * 0.77) {
            // Inner accent ring
            rawData[pxStart] = 255;
            rawData[pxStart + 1] = 150;
            rawData[pxStart + 2] = 80;
            rawData[pxStart + 3] = 255;
          } else {
            // Saffron Orange Gradient fill
            rawData[pxStart] = 255;
            rawData[pxStart + 1] = 122;
            rawData[pxStart + 2] = 26;
            rawData[pxStart + 3] = 255;
          }
        } else {
          rawData[pxStart] = 0;
          rawData[pxStart + 1] = 0;
          rawData[pxStart + 2] = 0;
          rawData[pxStart + 3] = 0;
        }
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    let byte = buf[i];
    for (let j = 0; j < 8; j++) {
      let bit = (byte ^ crc) & 1;
      crc = (crc >>> 1) ^ (bit ? 0xedb88320 : 0);
      byte = byte >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(8 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + len);
  const crcVal = crc32(typeAndData);
  chunk.writeUInt32BE(crcVal, 8 + len);
  return chunk;
}

const densities = [
  { name: 'mipmap-mdpi', size: 48, fgSize: 108 },
  { name: 'mipmap-hdpi', size: 72, fgSize: 162 },
  { name: 'mipmap-xhdpi', size: 96, fgSize: 216 },
  { name: 'mipmap-xxhdpi', size: 144, fgSize: 324 },
  { name: 'mipmap-xxxhdpi', size: 192, fgSize: 432 },
];

const resDir = path.resolve('android/app/src/main/res');

densities.forEach(({ name, size, fgSize }) => {
  const dir = path.join(resDir, name);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Standard launcher icon
  fs.writeFileSync(path.join(dir, 'ic_launcher.png'), createIconPng(size, size, false, false));
  // Round launcher icon
  fs.writeFileSync(path.join(dir, 'ic_launcher_round.png'), createIconPng(size, size, true, false));
  // Adaptive foreground icon
  fs.writeFileSync(path.join(dir, 'ic_launcher_foreground.png'), createIconPng(fgSize, fgSize, false, true));
});

// Also generate PWA public icons
const publicDir = path.resolve('public');
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createIconPng(192, 192, false, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createIconPng(512, 512, false, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createIconPng(512, 512, true, false));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createIconPng(180, 180, false, false));

console.log('✅ Generated all Android mipmap density icons and PWA assets successfully.');
