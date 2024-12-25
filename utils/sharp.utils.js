const sharp = require('sharp');
const randomColor = require('randomcolor');

class Sharp {
  constructor(defaultBgColor) {
    this.defaultImageSizes = [32, 64, 128];
    this.defaultSize = 200;
    this.defaultBgColor = defaultBgColor;
  }

  generateAvatarSVG(text, size = this.defaultSize) {
    const fontSize = size / 2;
    const firstLetter = text.charAt(0).toUpperCase();
    const bgColor =
      this.defaultBgColor ||
      randomColor({
        luminosity: 'bright',
      });

    const svg = `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <text
        x="50%"
        y="50%"
        dy=".32em"
        dominant-baseline="middle"
        text-anchor="middle"
        fill="white"
        font-family="Arial, sans-serif"
        font-size="${fontSize}"
        font-weight="bold"
        >${firstLetter}</text>
    </svg>`;

    return svg;
  }

  async convertToImage(svg, size) {
    const buffer = Buffer.from(svg);
    return await sharp(buffer).webp().resize(size, size).toBuffer();
  }

  async createAvatar(name, sizes = this.defaultImageSizes) {
    const svg = this.generateAvatarSVG(name);
    const images = await Promise.all(
      sizes.map((size) => this.convertToImage(svg, size)),
    );
    // array of buffers
    return images;
  }
}

module.exports = Sharp;
