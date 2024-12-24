const fs = require('fs/promises');
const { v4: uuidv4 } = require('uuid');
const Sharp = require('./sharp.utils');
const config = require('../config');

async function saveAvatarsToFile(name) {
  try {
    const sharp = new Sharp();
    const buffers = await sharp.createAvatar(name);
    const promises = buffers.map(async (buffer, index) => {
      const imageName = `${uuidv4()}-${sharp.defaultImageSizes[index]}px.webp`;
      const file = `public/images/avatars/${imageName}`;
      await fs.writeFile(file, buffer);
      return `${config.APP_URL}/images/avatars/${imageName}`;
    });

    const images = await Promise.all(promises);

    const avatars = {
      avatarUrl: images[0],
      smallAvatarUrl: images[1],
      largeAvatarUrl: images[2],
    };

    return avatars;
  } catch (error) {
    /* eslint-disable no-console */
    console.log(error);
  }
}

module.exports = saveAvatarsToFile;
