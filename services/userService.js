
const db = require('../queries/queries');

const isUserPresent = (username, email, response) => {
    //todo send a code to differentiate between registered user and new user
    db.pool.query('SELECT * FROM "user" WHERE email=' + "'" + email + "'", (error, result) => {
        if (error) {
            throw error;
        }
        if (result.rows.length != 0) {
            console.log("im already present")
            console.log(result.rows[0].usertype)
            const objResponse = {
                username: username,
                email: email,
                usertype: result.rows[0].usertype,
                userid: result.rows[0].userid,
                warehouseid: result.rows[0].warehouseid,
            }
            response.json(objResponse);
        }
        else {
            //SELECT   (MAX(CAST(userid AS DECIMAL(38,0)))  +1)  FROM "user" to get the max value +1, you can delete '+1' from query
            db.pool.query('SELECT max(userid) FROM "user"', (error, results) => {
                if (error) {
                    throw error
                }
                console.log("bro")
                console.log(results)

                const userId = results.rows[0].max == null ? 1 : parseInt(results.rows[0].max) + 1
                console.log("userId " + userId);
                const warehouseid = 'w-0001';
                const values = "('" + userId + "', 1, '-1', '" + email + "', '" + username + "', '-1', '" + warehouseid + "')";
                const columns = "(userid, usertype, deliveryid, email, username, password, warehouseid)"
                const dbQuery = 'INSERT INTO "user" ' + columns + ' VALUES ' + values;
                console.log("query to save a user " + dbQuery);
                db.pool.query(dbQuery, (err, res) => {
                    if (err) {
                        throw err;
                    }
                    const objResponse = {
                        username: username,
                        email: email,
                        usertype: 1,
                        userid: userId,
                        warehouseid: warehouseid
                    }
                    console.log('res')
                    console.log(JSON.stringify(res));
                    response.json(objResponse);
                })

            });
        }
    })
}

const getUser = (email, response) => {
    let userList = [];
    db.pool.query('SELECT * FROM "user"', (error, results) => {
        if (error) {
            throw error
        }
        const users = results.rows;
        if (email) {

            users.forEach(user => {
                if (user.email === email) {
                    userList.push(user)
                }
            });
        }
        else {
            userList = users;
        }

        response.json(userList);
    });
    //return subcategoryList;
}

const deleteUser = (userid, response) => {
    const userid_ = userid + '';
    const dbQuery = 'DELETE FROM "user" WHERE userid= ' + "'" + userid_ + "'";
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

const updateUser = (useremail, usertype, response) => {
    //UPDATE "user" SET usertype=2 WHERE email='eseller00001@gmail.com'
    const dbQuery = 'UPDATE "user" SET usertype=' + "'" + usertype + "' WHERE email= '" + useremail + "'";
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
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.isUserPresent = isUserPresent;
exports.getUser = getUser;