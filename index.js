/* eslint-disable no-console */
const express = require('express');
const config = require('./config');
const dbconnect = require('./utils/dbconnect');
const notFound = require('./middlewares/notFound');
const erroHander = require('./middlewares/errorHandler');
const chalk = require('chalk');
const cookieParser = require('cookie-parser');
const Logger = require('./logger');
const helmet = require('helmet');
const passport = require('passport');
const googlestrategy = require('./auth/google');
const { rateLimit } = require('express-rate-limit');
const cors = require('cors');

const app = express();

app.use(Logger.requestLogger());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

app.use(
  cors({
    origin: config.CLIENT_URL,
    credentials: true,
  }),
);

app.use(helmet());
app.use(limiter);
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
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/auth/google', require('./routes/google.routes'));
app.use('/api/v1/roles', require('./routes/role.routes'));
app.use('/api/v1/permissions', require('./routes/permissions.routes'));
app.use('/api/v1/user-role', require('./routes/userRole.routes'));
app.use('/api/v1/role-permission', require('./routes/rolePermission.routes'));

app.use(notFound);

app.use(Logger.errorLogger());
app.use(erroHander);

const start = async () => {
  try {
    const URI = `${config.DB_CONNECTION}://${config.DB_HOST}:${config.DB_PORT}/${config.DB_DATABSE}`;
    const port = config.APP_PORT || 8000;
    await dbconnect(URI);
    app.listen(port, () =>
      console.log(`APP RUNNIGN AT ${chalk.bgBlue(`PORT > ${port}`)}`),
    );
  } catch (error) {
    console.log(error);
  }
};

start();
