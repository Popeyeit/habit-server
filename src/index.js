const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config({
  path: path.join(__dirname, '../.env'),
});
const userRouter = require('./user/routers');
const habitsRoute = require('./habits/routers');
class CRUDServer {
  constructor() {
    this.server = null;
  }
  async start() {
    this.initServer();
    this.initMiddlewares();
    await this.initDbConnection();
    this.initRoutes();
    this.initErrorHandling();
    this.startListening();
  }
  initServer() {
    this.server = express();
  }
  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(cors());
    this.server.use(express.static('public'));
  }
  async initDbConnection() {
    try {
      mongoose.set('useCreateIndex', true);
      await mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      });
      console.log('Database connection successful');
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
  initErrorHandling() {
    this.server.use((err, req, res, next) => {
      const message = 'Oooops something went wrong. Try again later.';
      err.message = message;
      res.status(500).send(err);
    });
  }
  initRoutes() {
    this.server.use('/api/users', userRouter);
    this.server.use('/api/habits', habitsRoute);
  }
  startListening() {
    this.server.listen(process.env.PORT || 5000, () => {
      console.log('start server on port -', process.env.PORT || 5000);
    });
  }
}
const startCrudServer = new CRUDServer();
startCrudServer.start();
