
const db = require('../queries/queries');

const createCart = (userid, response) => {
    console.log("this is my user bitch " + userid)
    //SELECT (MAX(CAST(cartid AS DECIMAL(38,0)))  + 1)  FROM cart 
    db.pool.query('SELECT (MAX(CAST(cartid AS DECIMAL(38,0))) )  FROM cart ', (error, results) => {
        if (error) {
            throw error
        }
        console.log("bro")
        console.log(results)
        console.log(results)

        const cartId = results.rows[0].max == null ? 1 : parseInt(results.rows[0].max) + 1
        console.log("cartId " + cartId);
        const values = "('" + cartId + "', '" + userid + "')";
        const columns = "(cartid, userid)"
        const dbQuery = 'INSERT INTO "cart" ' + columns + ' VALUES ' + values;
        console.log("query to save a cart" + dbQuery);
        db.pool.query(dbQuery, (err, res) => {
            if (err) {
                throw err;
            }
            const objResponse = {
                status: 200,
                cartid: cartId,
                userid: userid
            }
            response.json(objResponse);
        })

    });
}

const getCart = (userid, response) => {
    let cartList = [];
    db.pool.query('SELECT * FROM "cart"', (error, results) => {
        if (error) {
            throw error
        }
        const carts = results.rows;
        //carts.forEach(user => {
        //    if (user.email === email) {
        //        cartList.push(user)
        //    }
        //});
        //response.json(cartList);
        response.json(carts);
    });

}

const deleteCart = (userid, response) => {
    const userid_ = userid + '';
    const dbQuery = "DELETE FROM cart WHERE userid= '" + userid_ + "'";
    db.pool.query(dbQuery, (err, res) => {
        if (err) {
            throw err;
        }
        const objResponse = {
            status: 200
        }
        response.json(objResponse);
    })

}
exports.deleteCart = deleteCart;
exports.createCart = createCart;
exports.getCart = getCart;