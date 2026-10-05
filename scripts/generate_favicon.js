const sharp = require('sharp');
const fs = require('fs');

async function makeFavicon() {
  const size = 128;
  const logoSize = 104;

  // Resize the logo to fit nicely with padding
  const innerLogo = await sharp('public/logo.png')
    .resize(logoSize, logoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  // Create crisp white square with elegant rounded corners
  const rectSvg = Buffer.from(
    `<svg width="${size}" height="${size}"><rect x="0" y="0" width="${size}" height="${size}" rx="22" fill="#ffffff"/></svg>`
  );

  const whiteBg = await sharp(rectSvg).png().toBuffer();

  const finalPng = await sharp(whiteBg)
    .composite([{ input: innerLogo, gravity: 'center' }])
    .png()
    .toBuffer();

  // Write PNG icons
  fs.writeFileSync('app/icon.png', finalPng);
  fs.writeFileSync('public/icon.png', finalPng);
  fs.writeFileSync('app/apple-icon.png', finalPng);
  fs.writeFileSync('public/apple-icon.png', finalPng);

  // Generate 64x64 for ICO file
  const icoPng = await sharp(finalPng).resize(64, 64).png().toBuffer();
  const icoHeader = Buffer.alloc(22);
  icoHeader.writeUInt16LE(0, 0);   // reserved
  icoHeader.writeUInt16LE(1, 2);   // type ico
  icoHeader.writeUInt16LE(1, 4);   // count 1
  icoHeader.writeUInt8(64, 6);     // width
  icoHeader.writeUInt8(64, 7);     // height
  icoHeader.writeUInt8(0, 8);      // color count
  icoHeader.writeUInt8(0, 9);      // reserved
  icoHeader.writeUInt16LE(1, 10);  // planes
  icoHeader.writeUInt16LE(32, 12); // bpp
  icoHeader.writeUInt32LE(icoPng.length, 14); // bytes
  icoHeader.writeUInt32LE(22, 18); // offset
  const icoBuf = Buffer.concat([icoHeader, icoPng]);

  fs.writeFileSync('app/favicon.ico', icoBuf);
  fs.writeFileSync('public/favicon.ico', icoBuf);

  console.log('Official White Square Favicons Generated successfully! Byte length:', icoBuf.length);
}

makeFavicon().catch(err => {
  console.error(err);
  process.exit(1);
});
