const express = require('express');
const app = express();
const port = 8081;
const getItemList = require('./services/listItemService')
const getCategoryList = require('./services/listCategorySubCategoryService.js');
const getSubCategoryList = require('./services/listCategorySubCategoryService.js');
const db = require('./queries/queries')
const cors = require("cors");

//methods
app.use(cors({
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));

//items endpoint
app.get('/items', async (req, res) => {
    const category = req.query.category;
    const subcategory = req.query.subcategory;
    const brand = req.query.brand;
    const price = req.query.price;
    const items = await getItemList.getItemList(category, subcategory, brand, price, res);
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

