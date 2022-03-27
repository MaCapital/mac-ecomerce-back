const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ECDB02',
    password: '1234567890',
    port: 5432,
});

//no use
const getItems = () => {
    pool.query('SELECT * FROM item', (error, results) => {
        if (error) {
            throw error
        }
        console.log(results.rows)
        //response.status(200).json(results.rows)
    })
};

const getCategories = (req, res) => {
    pool.query('SELECT * FROM category', (error, results) => {
        if (error) {
            throw error
        }
        console.log(results.rows)
        res.status(200).json(results.rows)
    })
};


module.exports = {
    getItems,
    pool,
    getCategories
}
