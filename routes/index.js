const authRouter = require('./users');
const productRouter = require('./product');
const imageRouter = require('./image');
const slideRouter = require('./slide');
const serviceRouter = require('./service');

function directionRoute(app) {
  app.use('/api/auth', authRouter);
  app.use('/api/product', productRouter);
  app.use('/api/slide', slideRouter);
  app.use('/api/image', imageRouter);
  app.use('/api/service', serviceRouter);
}

module.exports = directionRoute;