const mongoose = require('mongoose');
const chalk = require('chalk');
const RoleService = require('../services/roleService');

const dbconnect = async (URI) => {
  await mongoose.connect(URI);
  console.log(`APP CONNECTED WITH DB > %c${chalk.bgGreen.bold(URI)}`, 'color: green;');
  // initalise system constants
  // await RoleService.initializeSystemRoles();
};

module.exports = dbconnect;