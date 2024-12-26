const sharp = require('sharp');
// const randomColor = require('randomcolor');

class Sharp {
  constructor(defaultBgColor) {
    this.defaultImageSizes = [32, 64, 128];
    this.defaultSvgSize = 200;
    this.defaultBgColor = defaultBgColor;
  }

  randomColor(text) {
    const colors = [
      '#F44336', // Red 500
      '#E91E63', // Pink 500
      '#9C27B0', // Purple 500
      '#673AB7', // Deep Purple 500
      '#3F51B5', // Indigo 500
      '#2196F3', // Blue 500
      '#03A9F4', // Light Blue 500
      '#00BCD4', // Cyan 500
      '#009688', // Teal 500
      '#4CAF50', // Green 500
      '#8BC34A', // Light Green 500
      '#CDDC39', // Lime 500
      '#FFEB3B', // Yellow 500
      '#FFC107', // Amber 500
      '#FF9800', // Orange 500
      '#FF5722', // Deep Orange 500
      '#795548', // Brown 500
      '#9E9E9E', // Grey 500
      '#607D8B', // Blue Grey 500
    ];

    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % colors.length);
    const bgColor = colors[index];

    return bgColor;
  }

  generateAvatarSVG(text, size = this.defaultSvgSize) {
    const fontSize = size / 2;
    const firstLetter = text.charAt(0).toUpperCase();
    const bgColor = this.defaultBgColor || this.randomColor(text);

    const svg = `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <text
        x="50%"
        y="50%"
        dy=".35em"
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

  async resizeImage(imageBuffer, size) {
    return await sharp(imageBuffer).webp().resize(size, size).toBuffer();
  }

  async convertSvgToImage(svg, size) {
    const buffer = Buffer.from(svg);
    return await sharp(buffer).webp().resize(size, size).toBuffer();
  }

  async createAvatar(name, sizes = this.defaultImageSizes) {
    const svg = this.generateAvatarSVG(name);
    const images = await Promise.all(
      sizes.map((size) => this.convertSvgToImage(svg, size)),
    );
    // array of buffers
    return images;
  }

  async createImage(image, sizes = this.defaultImageSizes) {
    const images = await Promise.all(
      sizes.map((size) => this.resizeImage(image, size)),
    );
    return images;
  }
}

module.exports = Sharp;
