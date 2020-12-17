const Knex = require('knex');

const name = 'knex';
const table = 'products';

module.exports = config => {
  const knex = new Knex(config);

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

    createProduct: async product => {
      try {
        if (!product.type) {
          throw new Error('ERROR: No product type defined!');
        }
        if (!product.color) {
          throw new Error('ERROR: No product color defined!');
        }
        const p = JSON.parse(JSON.stringify(product));
        const timestamp = new Date();

        delete p.id;
        p.price = p.price || 0;
        p.quantity = p.quantity || 0;
        p.created_at = timestamp;
        p.updated_at = timestamp;

        const res = await knex(table).insert(p).returning('*');

        console.log(`DEBUG: Product has been created/updated:\n${JSON.stringify(res[0])}`);
        return res[0];
      } catch (error) {
        console.error('createProduct >> ', error.message || error);
        throw error;
      }
    },

    getProduct: async id => {
      try {
        if (!id) {
          throw new Error('ERROR: No product id defined!');
        }

        const res = await knex(table).where('id', id).whereNull('deleted_at');

        return res[0];
      } catch (error) {
        console.error('getProduct >> ', error.message || error);
        throw error;
      }
    },

    getAllProducts: async () => {
      try {
        const res = await knex(table).whereNull('deleted_at');

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

        const res = await knex(table).update(product).where('id', id).returning('*');

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

        await knex(table).where('id', id).del();

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

        await knex(table).where('id', id).update('deleted_at', new Date());

        console.log(`DEBUG: Product ${id} was marked as deleted.`);
        return true;
      } catch (error) {
        console.error('softDeleteProduct >> ', error);
        throw error;
      }
    },
  };
};
