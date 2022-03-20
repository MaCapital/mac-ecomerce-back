const express = require('express');
const app = express();
const port = 8081;

const getItemList = require('./services/listItemService')


//items endpoint
app.get('/items', (req, res) => {
    const category = req.query.category;
    const subcategory = req.query.subcategory; 
    const items = getItemList.getItemList(category, subcategory);
    res.json(items)
})

app.get('/search', (req, res) => {
    
    res.json({
        productName: "product",
        price: 23
    })
})

//listan the backend in the port 8081
app.listen(port, () => {
    console.log('server running on ' + port);
})