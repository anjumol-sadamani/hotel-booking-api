module.exports = {
    development: {
      client: 'sqlite3',
      connection: {
        filename: './hotel.db'
      },
      useNullAsDefault: true,
      migrations: {
        directory: './migrations'
      },
      seeds: {
        directory: './seeds'
      }
    }, 
    test: {
      client: 'sqlite3',
      connection: {
        filename: ':memory:'
      },
      useNullAsDefault: true,
      migrations: {
        directory: './migrations'
      },
      seeds: {
        directory: './seeds'
      }
    }
  };