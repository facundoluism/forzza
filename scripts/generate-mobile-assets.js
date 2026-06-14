// scripts/generate-mobile-assets.js
// Genera PNGs mínimos válidos para splash y adaptive-icon
// (fondo #0A0A0A, dimensiones correctas)
// Solo necesita Node.js nativo — sin dependencias externas

const fs = require('fs');
const path = require('path');

// PNG mínimo válido: 1×1 px con color #0A0A0A (R=10, G=10, B=10)
// Este placeholder es suficiente para Expo Go y builds de desarrollo
function createMinimalPng() {
  // Header PNG
  const header = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  // IHDR chunk: 1×1 px, 8bit RGB
  const ihdrData = Buffer.from([
    0x00, 0x00, 0x00, 0x01, // width: 1
    0x00, 0x00, 0x00, 0x01, // height: 1
    0x08, 0x02,             // bit depth: 8, color type: RGB
    0x00, 0x00, 0x00        // compression, filter, interlace
  ]);
  const ihdrCrc = crc32(Buffer.concat([Buffer.from('IHDR'), ihdrData]));
  const ihdrChunk = Buffer.concat([
    Buffer.from([0x00, 0x00, 0x00, 0x0D]), // length: 13
    Buffer.from('IHDR'),
    ihdrData,
    ihdrCrc
  ]);

  // IDAT chunk: pixel data (filter=0, R=10, G=10, B=10)
  const zlib = require('zlib');
  const pixelData = Buffer.from([0x00, 0x0A, 0x0A, 0x0A]); // filter=0, RGB
  const compressed = zlib.deflateSync(pixelData);
  const idatCrc = crc32(Buffer.concat([Buffer.from('IDAT'), compressed]));
  const idatChunk = Buffer.concat([
    Buffer.alloc(4), // length (fill below)
    Buffer.from('IDAT'),
    compressed,
    idatCrc
  ]);
  idatChunk.writeUInt32BE(compressed.length, 0);

  // IEND chunk
  const iendCrc = crc32(Buffer.from('IEND'));
  const iendChunk = Buffer.concat([
    Buffer.from([0x00, 0x00, 0x00, 0x00]),
    Buffer.from('IEND'),
    iendCrc
  ]);

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

// CRC32 simple
function crc32(buf) {
  let crc = 0xFFFFFFFF;
  const table = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }
  for (const byte of buf) crc = table[(crc ^ byte) & 0xFF] ^ (crc >>> 8);
  const result = (crc ^ 0xFFFFFFFF) >>> 0;
  const out = Buffer.alloc(4);
  out.writeUInt32BE(result);
  return out;
}

const assetsDir = path.join(__dirname, '../apps/mobile/assets');
const png = createMinimalPng();

['splash.png', 'adaptive-icon.png'].forEach(name => {
  const filepath = path.join(assetsDir, name);
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, png);
    console.log('Created ' + name);
  } else {
    console.log('Skipped ' + name + ' (already exists)');
  }
});
