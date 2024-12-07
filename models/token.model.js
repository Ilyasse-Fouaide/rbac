const { Schema, model } = require('mongoose');

const tokenSchema = new Schema({
  refreshToken: { type: String, required: true },
  ip: { type: String, required: true }, 
  userAgent: { type: String, required: true },
  isValid: { type: Boolean, default: true },
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'users',
    required: true 
  },
}, { timestamps: true });

const Token = model('tokens', tokenSchema);
module.exports = Token;
