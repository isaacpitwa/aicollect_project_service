import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import methodOveride from 'method-override';
import session from 'express-session';
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

app.use(methodOveride());
app.use(express.static(`${__dirname}/public/`));

app.use(routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT);

export default app;
