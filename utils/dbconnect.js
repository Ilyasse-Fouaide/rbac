const mongoose = require('mongoose');
const chalk = require('chalk');

const dbconnect = async (URI) => {
  await mongoose.connect(URI);
  console.log(`APP CONNECTED WITH DB > %c${chalk.bgGreen.bold(URI)}`, 'color: green;');
};

module.exports = dbconnect;