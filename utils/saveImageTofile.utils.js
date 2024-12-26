const fs = require('fs/promises');
const Sharp = require('./sharp.utils');
const config = require('../config');

async function saveImageTofile(image, dirName, userId) {
  try {
    const sharp = new Sharp();
    const buffers = await sharp.createImage(image);

    const images = await Promise.all(
      buffers.map(async (buffer, index) => {
        const imageName = `${userId}.webp`;
        const imageSize = sharp.defaultImageSizes[index];
        const file = `public/images/${dirName}/${imageSize}/${imageName}`;

        await fs.writeFile(file, buffer);
        return `images/${dirName}/${imageSize}/${imageName}`;
      }),
    );

    const baseDir = config.APP_URL;

    const resizedImage = {
      smallImage: {
        url: `${baseDir}/${images[0]}`,
        path: images[0],
      },
      mediumImage: {
        url: `${baseDir}/${images[1]}`,
        path: images[1],
      },
      largeImage: {
        url: `${baseDir}/${images[2]}`,
        path: images[2],
      },
    };

    return resizedImage;
  } catch (error) {
    /* eslint-disable no-console */
    console.log(error);
  }
}

module.exports = saveImageTofile;
