const { Schema, model } = require('mongoose');

const roleSchema = new Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  description: String,
  created_at: { 
    type: Date, 
    default: Date.now 
  }
});

const Role = model('roles', roleSchema);
module.exports = Role;
