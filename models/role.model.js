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
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

roleSchema.virtual('permissions', {
  ref: 'role_permissions',
  localField: '_id',
  foreignField: 'role'
});

const Role = model('roles', roleSchema);
module.exports = Role;
