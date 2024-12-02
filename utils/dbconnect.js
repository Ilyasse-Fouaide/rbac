const mongoose = require('mongoose');
const chalk = require('chalk');
const RoleService = require('../services/roleService');

const initalizeRoleService = async () => {
  await RoleService.initializeSystemRoles();
  console.log('----------------------------')
  await RoleService.initializeSystemPermissions();
}

const dbconnect = async (URI) => {
  await mongoose.connect(URI);
  console.log(`APP CONNECTED WITH DB > %c${chalk.bgGreen.bold(URI)}`, 'color: green;');
  // initalise system variables
  // initalizeRoleService()
};

module.exports = dbconnect;