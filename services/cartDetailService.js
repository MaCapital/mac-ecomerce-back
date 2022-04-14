const db = require('../queries/queries');

const createCartDetail = (cartid, itemid, itemname, itembrand, itemprice, quantity, response) => {
    console.log("this is my cart bitch " + cartid)
    console.log("this is my cart bitch " + itemid)
    console.log("this is my cart bitch " + itemname)
    console.log("this is my cart bitch " + itembrand)
    console.log("this is my cart bitch " + itemprice)
    console.log("this is my cart bitch " + quantity)
    db.pool.query('SELECT max(cartdetailid) FROM "cart_detail"', (error, results) => {
        if (error) {
            throw error
        }
        console.log("bro cart detail")
        console.log(results)

        const cartdetailid = results.rows[0].max == null ? 1 : parseInt(results.rows[0].max) + 1
        console.log("cartDetailId " + cartdetailid);
        const values = "('" + cartdetailid + "', '" + cartid + "', '" + itemid + "', '" + itemname + "','" + itembrand + "'," + itemprice + "," + quantity + ")";
        const columns = "(cartdetailid, cartid, itemid,name,brand ,itemprice ,quantity)"
        const dbQuery = 'INSERT INTO "cart_detail" ' + columns + ' VALUES ' + values;
        console.log("query to save a cartdetail" + dbQuery);
        db.pool.query(dbQuery, (err, res) => {
            if (err) {
                throw err;
            }
            const objResponse = {
                status: 200,
                cartdetailid: cartdetailid,
                cartid: cartid,
                itemid: itemid,
                name: itemname,
                itemprice: itemprice,
                quantity: quantity
            }
            response.json(objResponse);
        })

    });
}
//"cartid" varchar,
//"itemid" varchar,
//"itemprice" float8,
//"quantity" int

const getCartDetail = (cartid, response) => {
    let cartDList = [];
    db.pool.query('SELECT * FROM "cart_detail"', (error, results) => {
        if (error) {
            throw error
        }
        const cartdetails = results.rows;
        if (cartid) {
            cartdetails.forEach(cd => {
                if (cd.cartid === cartid) {
                    cartDList.push(cd)
                }
            });
        }
        else {
            cartDList = cartdetails;
        }

        response.json(cartDList);
    });
}


const deleteCartDetail = (cartdetailid, response) => {
    const cartdetailid_ = cartdetailid + '';
    const dbQuery = "DELETE FROM cart_detail WHERE cartdetailid= '" + cartdetailid_ + "'";
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

exports.deleteCartDetail = deleteCartDetail;
exports.createCartDetail = createCartDetail;
exports.getCartDetail = getCartDetail;