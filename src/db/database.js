const knex = require('./src/db/knex');

knex.raw('SELECT 1')
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  });

module.exports = knex;