const express = require('express');
const app = express();
const port = 8081;
const getItemList = require('./services/listItemService')
const getCategoryList = require('./services/listCategorySubCategoryService.js');
const getSubCategoryList = require('./services/listCategorySubCategoryService.js');
const db = require('./queries/queries')

const dotenv = require('dotenv');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');


dotenv.config();
console.log(process.env.REACT_APP_GOOGLE_CLIENT_ID)
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);
app.use(express.json());

const users = [];

const cors = require("cors");

//methods
app.use(cors({
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));

app.use(express.static(path.join(__dirname, '/build')));
//##googleLogin##
function upsert(array, item) {
    const i = array.findIndex((_item) => _item.email === item.email);
    if (i > -1) array[i] = item;
    else array.push(item);
}

app.post('/api/google-login', async (req, res) => {
    let token = req.body.token;
    console.log(token)


    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    const { name, email, picture } = ticket.getPayload();
    upsert(users, { name, email, picture });
    res.status(201);
    console.log(name)
    res.json({ name, email, picture });
});


//##googleLogin##


//items endpoint
app.get('/items', async (req, res) => {
    const category = req.query.category;
    const subcategory = req.query.subcategory;
    const brand = req.query.brand;
    const price = req.query.price;
    const ids = req.query.ids;
    if (ids) {
        const items = await getItemList.getItemListSearch(ids, res);
    } else {
        const items = await getItemList.getItemList(category, subcategory, brand, price, res);
    }
})

//categories endpoint +async
app.get('/categories', async (req, res) => {
    const category = req.query.category;
    const catSub = await getCategoryList.getCategoryList(res);
    //res.json(catSub)
})
//subcategories endpoint +async
app.get('/subcategories', async (req, res) => {
    const category = req.query.category;
    const subcategories = await getSubCategoryList.getSubCategoryList(category, res);
    //res.json(subcategories)
})

//app.get('/testcategory', db.getCategories)

//listan the backend in the port 8081
app.listen(port, () => {
    console.log('server running on ' + port);
})

