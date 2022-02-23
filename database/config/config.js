require('dotenv').config();

module.exports = {
  development: {
    username: process.env.POSTGRES_USER,
    password: null,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    port: process.env.DATABASE_PORT,
    dialect: 'postgres'
  },
  test: {
    username: process.env.POSTGRES_USER,
    password: null,
    database: process.env.DATABASE_TEST,
    port: process.env.DATABASE_PORT,
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  production: {
    username: 'root',
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'postgres'
  }
};
