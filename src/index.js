import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import methodOveride from 'method-override';
import session from 'express-session';
import mongoose from 'mongoose';
import passport from 'passport';

import './config/passport';
// import redis from 'redis';

import routes from './routes';

dotenv.config();

const app = express();

app.enable('trust proxy');
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  store: '',
  secret: 'secret',
  saveUninitialized: true,
  resave: true,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

let MONGO_URI;
let mongoConfigObject;

if (process.env.NODE_ENV === 'production') {
  MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@aicollect.1flh1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  mongoConfigObject = {
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS,
    keepAlive: true,
    keepAliveInitialDelay: 300000,
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
  };
} else {
  MONGO_URI = 'mongodb://localhost:27017/aicollect';
  mongoConfigObject = {
    keepAlive: true,
    keepAliveInitialDelay: 300000,
    useNewUrlParser: true,
    useUnifiedTopology: true
  };
}

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

app.use(session({
  store: '',
  secret: 'secret',
  saveUninitialized: true,
  resave: true,
  cookie: { secure: false }
}));

app.use(methodOveride());
app.use(express.static(`${__dirname}/public/`));

app.use(routes);

const PORT = process.env.PORT || 4000;

app.listen(PORT);

export default app;
