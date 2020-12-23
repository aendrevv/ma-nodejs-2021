/* eslint-disable camelcase */
/* eslint-disable consistent-return */
const Knex = require('knex');

const name = 'knex';
const { tables } = require('../../config');

let database;

module.exports = config => {
  const knex = new Knex(config);
  database = config.connection.database;

  return {
    testConnection: async () => {
      try {
        console.log(`Hello from ${name} testconnection.`);
        await knex.raw('SELECT NOW()');
      } catch (error) {
        console.error('testConnection >> ', error.message || error);
        throw error;
      }
    },

    close: async () => {
      console.log('INFO: Closing pg DB wrapper');
      // there's no close needed for Knex
    },

    createTables: async () => {
      try {
        await knex.raw(
          `SELECT 'CREATE DATABASE ${database}' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${database}')`,
        );

        await knex.schema.hasTable(tables.colors).then(exists => {
          if (!exists) {
            return knex.schema.createTable(tables.colors, t => {
              t.increments('id');
              t.string('color_name');
              t.unique('color_name');
              t.timestamps();
              t.timestamp('deleted_at').defaultTo(null);
            });
          }
        });

        await knex.schema.hasTable(tables.types).then(exists => {
          if (!exists) {
            return knex.schema.createTable(tables.types, t => {
              t.increments('id');
              t.string('type_name');
              t.unique('type_name');
              t.timestamps();
              t.timestamp('deleted_at').defaultTo(null);
            });
          }
        });

        await knex.schema.hasTable(tables.products).then(exists => {
          if (!exists) {
            return knex.schema.createTable(tables.products, t => {
              t.increments('id');
              t.integer('type_id').references('id').inTable('types').notNullable();
              t.integer('color_id').references('id').inTable('colors').notNullable();
              t.decimal('price').nullable().defaultTo(0.0);
              t.unique(['type_id', 'color_id', 'price']);
              t.integer('quantity').notNullable().defaultTo(1);
              t.timestamps();
              t.timestamp('deleted_at').nullable().defaultTo(null);
            });
          }
        });
      } catch (error) {
        console.error('create tables >> ', error.message || error);
        throw error;
      }
    },

    createProduct: async ({ type, color, price = 0, quantity = 1 }) => {
      try {
        const timestamp = new Date();

        const [type_id] = await knex(tables.types).where({ type_name: type }).select('id');
        if (!type_id) {
          const err = new Error('There is no such type defined in table "types"');
          console.error('>', err.message);
          throw err;
        }

        const [color_id] = await knex(tables.colors).where({ color_name: color }).select('id');
        if (!color_id) {
          const err = new Error('There is no such color defined in table "colors"');
          console.error('>', err.message);
          throw err;
        }

        const [product] = await knex(tables.products)
          .insert({
            type_id: type_id.id,
            color_id: color_id.id,
            price,
            quantity,
            created_at: timestamp,
            updated_at: timestamp,
          })
          .returning('*')
          .onConflict(['type_id', 'color_id', 'price'])
          .merge({ quantity: knex.raw(`products.quantity + ${quantity}`) })
          .returning('*');

        return product;
      } catch (error) {
        console.error('->', error);
        // console.error('->', error.message || error);
        throw error;
      }
    },

    getProduct: async id => {
      try {
        if (!id) {
          throw new Error('ERROR: No product id defined!');
        }

        const [res] = await knex(tables.products)
          .where('id', id)
          .whereNull('deleted_at')
          .join(tables.types, tables.products.type_id, tables.types.id)
          .join(tables.colors, tables.products.color_id, tables.colors.id)
          .select(
            tables.types.type_name,
            tables.colors.color_name,
            tables.products.price,
            tables.products.quantity,
          );

        return res;
      } catch (error) {
        console.error('getProduct >> ', error.message || error);
        throw error;
      }
    },

    getAllProducts: async () => {
      try {
        const res = await knex(tables.products)
          .whereNull('deleted_at')
          .join(tables.types, tables.products.type_id, tables.types.id)
          .join(tables.colors, tables.products.color_id, tables.colors.id)
          .select(
            tables.types.type_name,
            tables.colors.color_name,
            tables.products.price,
            tables.products.quantity,
          );
        return res;
      } catch (error) {
        console.error('getAllProducts >> ', error.message || error);
        throw error;
      }
    },

    updateProduct: async ({ id, ...product }) => {
      try {
        if (!id) {
          throw new Error('ERROR: No product id defined!');
        }

        if (!Object.keys(product).length) {
          throw new Error('ERROR: Nothing to update!');
        }

        const res = await knex(tables.products).update(product).where('id', id).returning('*');

        console.log(`DEBUG: Product was updated: ${JSON.stringify(res[0])}`);
        return res.rows[0];
      } catch (error) {
        console.error('updateProduct >> ', error.message || error);
        throw error;
      }
    },

    hardDeleteProduct: async id => {
      try {
        if (!id) {
          throw new Error('ERROR: No product id defined!');
        }

        await knex(tables.products).where('id', id).del();

        console.log(`DEBUG: Product ${id} has been removed.`);
        return true;
      } catch (error) {
        console.error('hardDeleteProduct >> ', error.message || error);
        throw error;
      }
    },

    softDeleteProduct: async id => {
      try {
        if (!id) {
          throw new Error('ERROR: No product id defined!');
        }

        await knex(tables.products).where('id', id).update('deleted_at', new Date());

        console.log(`DEBUG: Product ${id} was marked as deleted.`);
        return true;
      } catch (error) {
        console.error('softDeleteProduct >> ', error);
        throw error;
      }
    },
  };
};
