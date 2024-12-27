const fs = require('fs/promises');
const Sharp = require('./sharp.utils');

async function saveAvatarsToFile(name, userId) {
  try {
    const sharp = new Sharp();
    const buffers = await sharp.createAvatar(name);
    const promises = buffers.map(async (buffer, index) => {
      const imageName = `${userId}.webp`;
      // file name will be public/images/avatars/{32,64,128}/name.webp
      const imageSize = sharp.defaultImageSizes[index];
      const file = `public/images/avatars/${imageSize}/${imageName}`;
      await fs.writeFile(file, buffer);
      return `images/avatars/${imageSize}/${imageName}`;
    });

    const images = await Promise.all(promises);

    const avatars = {
      smallAvatarUrl: images[0],
      mediumAvatarUrl: images[1],
      largeAvatarUrl: images[2],
    };

    return avatars;
  } catch (error) {
    /* eslint-disable no-console */
    console.log(error);
  }
}

module.exports = saveAvatarsToFile;
