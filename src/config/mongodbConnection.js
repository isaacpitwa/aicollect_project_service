/* eslint-disable no-useless-catch */
/* eslint-disable no-console */
import mongoose from 'mongoose';

const mongoConfigObject = {
  user: process.env.MONGO_USER,
  pass: process.env.MONGO_PASS,
  keepAlive: true,
  keepAliveInitialDelay: 300000,
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
};

const connections = {};
const MONGO_URI = `mongodb://${process.env.MONGO_URL}:${process.env.MONGO_PORT}/${process.env.MONGO_COLLECTION}?authSource=admin`;

try {
  mongoose.connect(MONGO_URI, mongoConfigObject);
  mongoose.connection.on('connected', () => {
    console.log('mongodb connected');
  });
  mongoose.connection.on('error', (error) => {
    console.log('Oooh, could not connect to mongo: \n', error);
  });
  mongoose.connection.on('disconnect', () => {
    console.log('connection to mongo closed');
  });
} catch (error) {
  throw error;
}

const getDatabaseConnection = (databaseName) => {
  if (connections[databaseName]) {
    return connections[databaseName];
  }
  connections[databaseName] = mongoose.connect(MONGO_URI, mongoConfigObject);
  return connections[databaseName];
};

export default getDatabaseConnection;
