exports.up = async function(knex) {
  if (!(await knex.schema.hasTable('rooms'))) {
      await knex.schema.createTable('rooms', function(table) {
          table.increments('id').primary();
          table.string('name').notNullable();
      });
  }

  const existingRooms = await knex('rooms').select('id');
  const roomsToInsert = [
      { id: 1, name: 'Room 1' },
      { id: 2, name: 'Room 2' }
  ].filter(room => !existingRooms.some(existingRoom => existingRoom.id === room.id));

  if (roomsToInsert.length > 0) {
      await knex('rooms').insert(roomsToInsert);
  }

  if (!(await knex.schema.hasTable('bookings'))) {
      await knex.schema.createTable('bookings', function(table) {
          table.increments('id').primary();
          table.integer('room_id').unsigned().references('id').inTable('rooms');
          table.string('email').notNullable();
          table.date('booking_date').notNullable();;
          table.boolean('is_confirmed').defaultTo(false);
          table.timestamp('created_at').defaultTo(knex.fn.now());
      });
  }

  if (!(await knex.schema.hasTable('invoices'))) {
      await knex.schema.createTable('invoices', function(table) {
          table.increments('id').primary();
          table.integer('booking_id').unsigned().references('id').inTable('bookings').notNullable();;
          table.decimal('amount', 10, 2).notNullable().defaultTo(100.00);
          table.timestamp('created_at').defaultTo(knex.fn.now());
      });
  }
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('invoices');
  await knex.schema.dropTableIfExists('bookings');
  await knex.schema.dropTableIfExists('rooms');
};