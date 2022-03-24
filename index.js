const express = require('express');
const app = express();
const port = 8081;
const getItemList = require('./services/listItemService')
const db = require('./queries/queries')


const cors = require("cors");

app.use(cors({
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));

const getCategoryList = require('./services/listCategorySubCategorySevice.js');
const getSubCategoryList = require('./services/listCategorySubCategorySevice.js');
//items endpoint
app.get('/items', async (req, res) => {
    const category = req.query.category;
    const subcategory = req.query.subcategory;
    const brand = req.query.brand;
    const price = req.query.price;
    const items = await getItemList.getItemList(category, subcategory, brand, price, res);
})
//categories endpoint
app.get('/categories', (req, res) => {
    const category = req.query.category;
    const catSub = getCategoryList.getCategoryList(category);
    res.json(catSub)
})
//subcategories endpoint
app.get('/subcategories', (req, res) => {
    const category = req.query.category;
    const subcategories = getSubCategoryList.getSubCategoryList(category);
    res.json(subcategories)
})

//listan the backend in the port 8081
app.listen(port, () => {
    console.log('server running on ' + port);
})