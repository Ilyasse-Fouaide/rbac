/* eslint-disable no-console */
const mongoose = require('mongoose');
const chalk = require('chalk');
const RoleService = require('../services/roleService');

const initalizeRoleService = async () => {
  await RoleService.initializeSystemRoles();
  console.log('----------------------------');
  await RoleService.initializeSystemPermissions();
  console.log('----------------------------');
  await RoleService.assignPermissionToRole();
};

const dbconnect = async (URI) => {
  // mongoose.set('toJSON', { virtuals: true });
  // mongoose.set('toObject', { virtuals: true });
  await mongoose.connect(URI);
  console.log(
    `APP CONNECTED WITH DB > %c${chalk.bgGreen.bold(URI)}`,
    'color: green;',
  );
  // initalise system variables
  // initalizeRoleService();
};

module.exports = dbconnect;
