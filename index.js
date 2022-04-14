const express = require('express');
const app = express();
const port = 8081;
const getItemList = require('./services/listItemService')
const addItem = require('./services/listItemService')
const getItemsByWarehouse = require('./services/listItemService');
const deleteItem = require('./services/listItemService');

const getCategoryList = require('./services/listCategorySubCategoryService.js');
const getSubCategoryList = require('./services/listCategorySubCategoryService.js');
const db = require('./queries/queries')
const dotenv = require('dotenv');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');
const { createCart, getCart } = require('./services/cartService');
const { saveCheckout, getCheckout } = require('./services/checkoutService');
const { createCartDetail, getCartDetail, deleteCartDetail } = require('./services/cartDetailService.js');


dotenv.config();
console.log(process.env.REACT_APP_GOOGLE_CLIENT_ID)
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);
app.use(express.json());

const users = [];

const cors = require("cors");
const { isUserPresent, getUser } = require('./services/userService');

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
    await isUserPresent(name, email, res)
    //res.json({ name, email});
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

app.get('/warehouseitem', async (req, res) => {
    const wid = req.query.wid;
    const itemsw = await getItemsByWarehouse.getItemsByWarehouse(wid, res);
})

app.post('/additem', async (req, res) => {
    const name = req.query.name;
    const unitprice = req.query.unitprice;
    const subcategoryid = req.query.subcategoryid;
    const image = req.query.image;
    const color = req.query.color;
    const measure = req.query.measure;
    const brand = req.query.brand;
    const about = req.query.about;
    const warehouse = req.query.warehouse;
    await addItem.addItem(name, unitprice, subcategoryid, image, color, measure, brand, about, warehouse, res);
})
app.delete('/deleteitem', async (req, res) => {
    const itemid = req.query.itemid;
    await deleteItem.deleteItem(itemid, res);
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
//user endpoint
app.get('/user', async (req, res) => {
    const email = req.query.email;
    const subcategories = await getUser(email, res);
    //res.json(subcategories)
})


//cart endpoint
app.get('/cart', async (req, res) => {
    const userid = req.query.userid;
    const getcart = await getCart(userid, res);
})
// create a new cart endpoint
app.post('/createcart', async (req, res) => {
    const userid = req.query.userid;
    await createCart(userid, res);
})
app.delete('/deletecart', async (req, res) => {
    const userid = req.query.userid;
    await deleteCart(userid, res);
})


//http://localhost:8081/createcd?cartid=2&itemid=pr-0000002&price=20&quantity=2
app.post('/createcd', async (req, res) => {
    const cartid = req.query.cartid;
    const itemid = req.query.itemid;
    const name = req.query.name;
    const brand = req.query.brand;
    const price = req.query.price;
    const quantity = req.query.quantity;
    await createCartDetail(cartid, itemid, name, brand, price, quantity, res);
})

app.delete('/deletecd', async (req, res) => {
    const cartdetailid = req.query.cartdetailid;
    await deleteCartDetail(cartdetailid, res);
})

app.get('/cartdetail', async (req, res) => {
    const cartid = req.query.cartid;
    const getcartdetail = await getCartDetail(cartid, res);
});

app.post('/checkout', async (req, res) => {
    let userid = req.query.userid;
    let cartid = req.query.cartid;
    let total = req.query.total;
    let description = req.query.description;
    console.log("the checkout request body " + req.body)

    await saveCheckout(userid, cartid, total, description, res)
    //res.json({ name, email});
});

app.get('/checkout', async (req, res) => {
    const userid = req.query.userid;
    await getCheckout(userid, res);
});


//listan the backend in the port 8081
app.listen(port, () => {
    console.log('server running on ' + port);
})



