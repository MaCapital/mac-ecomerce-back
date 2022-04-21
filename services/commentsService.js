const db = require('../queries/queries');

const createComment = (itemid, userid, username, description, response) => {
    console.log("this is my commet bitch ", itemid, userid, username, description)
    //SELECT (MAX(CAST(cartid AS DECIMAL(38,0)))  + 1)  FROM cart 
    db.pool.query('SELECT (MAX(CAST(commentid AS DECIMAL(38,0))) )  FROM comments ', (error, results) => {
        if (error) {
            throw error
        }
        console.log("bro")
        console.log(results)

        const commentid = results.rows[0].max == null ? 1 : parseInt(results.rows[0].max) + 1
        console.log("commentId " + commentid);
        const values = "('" + commentid + "', '" + itemid + "', '" + userid + "', '" + username + "', '" + description + "')";
        const columns = "(commentid ,itemid ,userid ,username ,description)"
        const dbQuery = 'INSERT INTO "comments" ' + columns + ' VALUES ' + values;
        console.log("query to save a comment" + dbQuery);
        db.pool.query(dbQuery, (err, res) => {
            if (err) {
                throw err;
            }
            const objResponse = {
                status: 200,
                commentid: commentid,
                description: description
            }
            response.json(objResponse);
        })

    });
}
const getComments = (itemid, response) => {
    let commentList = [];
    db.pool.query('SELECT * FROM "comments"', (error, results) => {
        if (error) {
            throw error
        }
        const comments = results.rows;
        comments.forEach(commentary => {
            if (commentary.itemid === itemid) {
                commentList.push(commentary)
            }
        });
        response.json(commentList);
    });

}
exports.getComments = getComments;
exports.createComment = createComment;