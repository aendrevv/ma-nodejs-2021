/* eslint-disable no-restricted-syntax */
const client = require('./pg');
// const {
//   tables: { table1: table },
// } = require('../../config');
const table = 'products';

const createTable = async () => {
  try {
    await client.query(
      `CREATE TABLE IF NOT EXISTS ${table}(
          id INT GENERATED ALWAYS AS IDENTITY,
          type VARCHAR(255),
          color VARCHAR(255),
          price NUMERIC(10,2),
          quantity BIGINT NOT NULL,
          created_at TIMESTAMP DEFAULT NULL,
          updated_at TIMESTAMP DEFAULT NULL,
          deleted_at TIMESTAMP DEFAULT NULL,
          PRIMARY KEY (type, color, price)
        )`,
    );
  } catch (error) {
    console.error('createTable >> ', error.message || error);
    throw error;
  }
};

const testConnection = async () => {
  try {
    console.log('Hello from PG!');
    await client.query('SELECT NOW()');
  } catch (error) {
    console.error('testConnection >> ', error.message || error);
    throw error;
  }
};

const close = async () => {
  console.log('INFO: Closing pg DB wrapper');
  client.end();
};

const createProduct = async ({ type, color, price = 0, quantity = 1 }) => {
  try {
    if (!type) {
      throw new Error('ERROR: No product type defined!');
    }
    if (!color) {
      throw new Error('ERROR: No product color defined!');
    }

    const timestamp = new Date();

    const res = await client.query(
      `INSERT INTO ${table}(type, color, price, quantity, created_at, updated_at, deleted_at) VALUES($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (type, color, price) DO UPDATE SET quantity = ${table}.quantity + $4 RETURNING *`,
      [type, color, price, quantity, timestamp, timestamp, null],
    );

    console.log(`DEBUG: Product has been created/updated:\n${JSON.stringify(res.rows[0])}`);
    return res.rows[0];
  } catch (error) {
    console.error('createProduct >> ', error.message || error);
    throw error;
  }
};

const getProduct = async id => {
  try {
    if (!id) {
      throw new Error('ERROR: No product id defined!');
    }
    const res = await client.query(`SELECT * FROM ${table} WHERE id = $1 AND deleted_at IS NULL`, [
      id,
    ]);

    return res.rows[0];
  } catch (error) {
    console.error('getProduct >> ', error.message || error);
    throw error;
  }
};

const getAllProducts = async () => {
  try {
    const res = await client.query(`SELECT * FROM ${table} WHERE deleted_at IS NULL`);
    return res.rows;
  } catch (err) {
    console.error('getAllProducts >> ', err.message || err);
    throw err;
  }
};

const updateProduct = async ({ id, ...product }) => {
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
      `UPDATE ${table} SET ${query.join(',')} WHERE id = $${values.length} RETURNING *`,
      values,
    );

    console.log(`DEBUG: Product was updated: ${JSON.stringify(res.rows[0])}`);
    return res.rows[0];
  } catch (error) {
    console.error('updateProduct >> ', error.message || error);
    throw error;
  }
};

const hardDeleteProduct = async id => {
  try {
    if (!id) {
      throw new Error('ERROR: No product id defined!');
    }

    await client.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
    console.log(`DEBUG: Product ${id} has been removed.`);
    return true;
  } catch (error) {
    console.error('hardDeleteProduct >> ', error.message || error);
    throw error;
  }
};

const softDeleteProduct = async id => {
  try {
    if (!id) {
      throw new Error('ERROR: No product id defined!');
    }

    await client.query(`UPDATE ${table} SET deleted_at = $1 WHERE id = $2`, [new Date(), id]);
    console.log(`DEBUG: Product ${id} was marked as deleted.`);
    return true;
  } catch (error) {
    console.error('softDeleteProduct >> ', error);
    throw error;
  }
};

module.exports = {
  createTable,
  testConnection,
  getProduct,
  getAllProducts,
  createProduct,
  close,
  updateProduct,
  softDeleteProduct,
  hardDeleteProduct,
};
