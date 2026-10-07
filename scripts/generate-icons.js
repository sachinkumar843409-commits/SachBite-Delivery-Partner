import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Minimal pure-Node PNG generator
function createSolidPng(width, height, r, g, b, a = 255) {
  const bytesPerPixel = 4;
  const rowBytes = width * bytesPerPixel;
  const rawData = Buffer.alloc((rowBytes + 1) * height);

  for (let y = 0; y < height; y++) {
    const rowStart = y * (rowBytes + 1);
    rawData[rowStart] = 0; // Filter type: None

    for (let x = 0; x < width; x++) {
      const pxStart = rowStart + 1 + x * bytesPerPixel;
      // Draw rounded corner or circle badge for icon
      const cx = width / 2;
      const cy = height / 2;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Saffron brand gradient / circle
      if (dist < width * 0.44) {
        // Inner badge: bright saffron orange
        rawData[pxStart] = 255; // R
        rawData[pxStart + 1] = 122; // G
        rawData[pxStart + 2] = 26; // B
        rawData[pxStart + 3] = 255; // A
      } else if (dist < width * 0.48) {
        // Border ring
        rawData[pxStart] = 232; // R
        rawData[pxStart + 1] = 93; // G
        rawData[pxStart + 2] = 4; // B
        rawData[pxStart + 3] = 255;
      } else {
        // Outer background
        rawData[pxStart] = 250;
        rawData[pxStart + 1] = 250;
        rawData[pxStart + 2] = 250;
        rawData[pxStart + 3] = 255;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression method
  ihdr[11] = 0; // filter method
  ihdr[12] = 0; // interlace method

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

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate icon files
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createSolidPng(192, 192, 255, 122, 26));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createSolidPng(512, 512, 255, 122, 26));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createSolidPng(512, 512, 255, 122, 26));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createSolidPng(180, 180, 255, 122, 26));

console.log('Successfully generated PWA and Apple Touch PNG icons in /public');
