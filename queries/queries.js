const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ecomerce',
  password: '123456',
  port: 5432,
});

const getItems = () => {
    pool.query('SELECT * FROM item', (error, results) => {
        if (error) {
            throw error
        }
        console.log(results.rows)  
        //response.status(200).json(results.rows)
    })
};

module.exports = {
    getItems,
    pool,
}