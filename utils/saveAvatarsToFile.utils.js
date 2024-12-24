const fs = require('fs/promises');
const { v4: uuidv4 } = require('uuid');
const Sharp = require('./sharp.utils');

async function saveAvatarsToFile() {
  try {
    const sharp = new Sharp();
    const buffers = await sharp.createAvatar('ilyasse');
    const promises = buffers.map(async (buffer, index) => {
      const file = `./public/images/avatar/${uuidv4()}-${sharp.defaultImageSizes[index]}px.webp`;
      await fs.writeFile(file, buffer);
      return file;
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
