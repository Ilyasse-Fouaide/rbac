const { Schema, model } = require('mongoose');

const imageSchema = new Schema({
  imageType: String,
  smallImage: {
    url: String,
    path: String,
  },
  mediumImage: {
    url: String,
    path: String,
  },
  largeImage: {
    url: String,
    path: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Image = model('images', imageSchema);
module.exports = Image;
