const express = require('express');
const config = require('./config')
const dbconnect = require('./utils/dbconnect')
const notFound = require('./middlewares/notFound');
const erroHander = require('./middlewares/errorHandler');
const chalk = require('chalk');
const cookieParser = require('cookie-parser');
const Logger = require('./logger')
const helmet = require('helmet');
const passport = require('passport');
const googlestrategy = require('./auth/google');

const app = express();

app.use(Logger.requestLogger());

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// google auth initialize with passort.js
app.use(passport.initialize());
passport.use(googlestrategy);

// make login button for testing
app.get('/', (req, res) => {
  res.send('<a href="/api/v1/auth/google">google</a>');
});

// -- Routes --
app.use('/api/v1/roles', require('./routes/role.routes'));
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/auth/google', require('./routes/google.routes'));

app.use(notFound);

app.use(Logger.errorLogger());
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