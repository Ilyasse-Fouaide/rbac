const express = require('express');
const config = require('./config')
const dbconnect = require('./utils/dbconnect')
const notFound = require('./middlewares/notFound');
const erroHander = require('./middlewares/errorHandler');
const chalk = require('chalk');

const app = express();

app.use('/api', (req, res, next) => {
  res.send('hello rbac here');
});

app.use(notFound);
app.use(erroHander);

const start = async () => {
  try {
    const URI = `${config.DB_CONNECTION}://${config.DB_HOST}:${config.DB_PORT}/${config.DB_DATABSE}`;
    const port = config.APP_PORT || 8000;
    await dbconnect(URI);
    app.listen(port, () => console.log(`APP RUNNIGN AT ${chalk.bgBlue(`PORT > ${port}`)}`));
  } catch (error) {
    console.log(error);
  }
}

start();