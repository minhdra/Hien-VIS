const authRouter = require('./users');

function directionRoute(app) {
  app.use('/api/auth', authRouter);
}

module.exports = directionRoute;