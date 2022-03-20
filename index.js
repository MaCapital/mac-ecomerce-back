const express = require('express');
const app = express();
const port = 8081;


//items endpoint
app.get('/items', (req, res) => {
    let itemsList = [];
    const category = req.query.category;
    if(category) {
        res.json({
            productName: "product",
            price: 23    
        })
    }
    for (let index = 0; index < 10; index++) {
        itemsList.push({
            productName: "product",
            price: 23    
        })
    }
    res.json(itemsList)
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