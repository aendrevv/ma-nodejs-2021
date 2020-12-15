/* eslint-disable no-restricted-syntax */
const { Pool } = require('pg');

module.exports = config => {
  const client = new Pool(config);

  return {
    testConnection: async () => {
      try {
        console.log('Hello from PG!');
        await client.query('SELECT NOW()');
      } catch (error) {
        console.error('\ntestConnection', error);
        throw error;
      }
    },

    close: async () => {
      console.log('INFO: Closing pg DB wrapper');
      client.end();
    },

    createProduct: async ({ type, color, price = 0, quantity = 1 }) => {
      try {
        if (!type) {
          throw new Error('ERROR: No product type defined!');
        }
        if (!color) {
          throw new Error('ERROR: No product color defined!');
        }

        const timestamp = new Date();

        const res = await client.query(
          'INSERT INTO products(type, color, price, quantity, created_at, updated_at, deleted_at) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
          [type, color, price, quantity, timestamp, null, null],
        );

        console.log(`DEBUG: New product created:\n${JSON.stringify(res.rows[0])}`);
        return res.rows[0];
      } catch (error) {
        console.error(error.message || error);
        throw error;
      }
    },

    getProduct: async id => {
      try {
        if (!id) {
          throw new Error('ERROR: No product id defined!');
        }
        const res = await client.query(
          'SELECT * FROM products WHERE id = $1 AND deleted_at IS NULL',
          [id],
        );

        return res.rows[0];
      } catch (error) {
        console.error(error.message || error);
        throw error;
      }
    },

    updateProduct: async ({ id, ...product }) => {
      try {
        if (!id) {
          throw new Error('ERROR: No product id defined!');
        }

        const query = [];
        const values = [];

        for (const [i, [key, val]] of Object.entries(product).entries()) {
          query.push(`${key} = $${i + 1}`);
          values.push(val);
        }

        if (!values.length) {
          throw new Error('ERROR: Nothing to update!');
        }

        values.push(id);

        const res = await client.query(
          `UPDATE products SET ${query.join(',')} WHERE id = $${values.length} RETURNING *`,
          values,
        );

        console.log(`DEBUG: Product was updated: ${JSON.stringify(res.rows[0])}`);
        return res.rows[0];
      } catch (error) {
        console.error(error.message || error);
        throw error;
      }
    },

    deleteProduct: async id => {
      try {
        if (!id) {
          throw new Error('ERROR: No product id defined!');
        }

        // await client.query('DELETE FROM products WHERE id = $1', [id]);
        await client.query('UPDATE products SET deleted_at = $1 WHERE id = $2', [new Date(), id]);
        console.log(`DEBUG: Product ${id} was marked as deleted.`);
        return true;
      } catch (error) {
        console.error(error.message || 'error');
        throw error;
      }
    },
  };
};
