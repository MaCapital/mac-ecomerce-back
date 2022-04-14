const res = require("express/lib/response");
const db = require("../queries/queries")


const saveCheckout = (userId, cartId, total, description, response) => {

    db.pool.query('SELECT max(orderid) FROM "order"', (error, results) => {
        if (error) {
            throw error
        }
        console.log(results)
        let today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = today.getFullYear();

        today = dd + '/' + mm + '/' + yyyy;

        const orderid = results.rows[0].max == null ? 1 : parseInt(results.rows[0].max) + 1
        console.log("orderid " + orderid);
        const values = `('${orderid}', '${cartId}', '${userId}', -1, 'complete', ${total}, '${today}', '${description}')`
        const columns = "(orderid, cartid, userid, trackingnumber, status, total, date, description)";

        const dbQuery = 'INSERT INTO "order" ' + columns + ' VALUES ' + values;
        console.log("query to save a order " + dbQuery);
        db.pool.query(dbQuery, (err, res) => {
            if (err) {
                throw err;
            }
            const objResponse = {
                code: 200
            }
            response.json(objResponse);
        })
    });
}

const getCheckout = (userid, res) => {
    db.pool.query('SELECT * FROM "order"', (error, results) => {
        if (error) {
            throw error
        }
        const orders = results.rows;
        let filteredOrders = [];
        orders.forEach(order => {
            if (order.userid == userid) {
                filteredOrders.push(order);
            }
        });
        res.json(filteredOrders);
    });
}


exports.saveCheckout = saveCheckout;
exports.getCheckout = getCheckout;