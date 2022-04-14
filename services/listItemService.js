const dataGenerator = require('../utils/dataGenerator');
//get the item list
const db = require('../queries/queries');
const { response } = require('express');

//search 
const getItemListSearch = (ids, response) => {
    let filteredItemsIds = [];
    let arrayIds = ids.split(",");
    let srt = ""
    arrayIds.forEach(element => {
        srt = srt + "'" + element + "'" + ','
    });
    db.pool.query("Select * from item where itemid in(" + srt + "' ')", (error, results) => {
        if (error) {
            throw error
        }
        filteredItemsIds = results.rows;
        response.json(filteredItemsIds);
    });
}

const getItemList = (categoryId, subcategoryId, brand, price, response) => {
    let filteredItems = [];
    //ask for all items
    //const items = dataGenerator.fakeItem;
    db.pool.query('SELECT * FROM item', (error, results) => {
        if (error) {
            throw error
        }
        //const items = db.getItems();
        //console.log(items)
        const items = results.rows;
        filteredItems = items;
        //ask for subcategories of a specific category
        if (categoryId && !subcategoryId) {
            filteredItems = [];
            let subcategories = [];
            db.pool.query('SELECT * FROM sub_category', (error2, results2) => {
                if (error2) {
                    throw error2
                }
                const subcategoriesdb = results2.rows;
                subcategories = subcategoriesdb;
                subcategoriesCat = filterSubcategoryByCategory(categoryId, subcategories);
                subcategoriesCat.forEach(subcatObj => {
                    const filteredItemsBySubCat = filterItemBySubcategory(items, subcatObj.subcategoryid);
                    filteredItemsBySubCat.forEach(item => {
                        filteredItems.push(item);
                    });
                });
                //filter items by a specific brand
                if (brand) {
                    filteredItems = filterItemsByBrand(filteredItems, brand)
                }
                // price
                if (price) {
                    filteredItems = filterItemsByPrice(filteredItems, price)
                }
                response.json(filteredItems);
            })
        }
        else {
            //filter items by a specific subcategory
            if (subcategoryId) {
                filteredItems = filterItemBySubcategory(filteredItems, subcategoryId)
            }
            //filter items by a specific brand
            if (brand) {
                filteredItems = filterItemsByBrand(filteredItems, brand)
            }
            if (price) {
                filteredItems = filterItemsByPrice(filteredItems, price)
            }
            response.json(filteredItems);
        }
    })
}


function filterSubcategoryByCategory(category, subCategoryList) {
    let subCategoryFiltered = [];
    subCategoryList.forEach(scObj => {
        if (scObj.categoryid === category) {
            subCategoryFiltered.push(scObj);
        }
    });
    return subCategoryFiltered;
}

function filterItemBySubcategory(items, subcategory) {
    let filteredItems = [];
    items.forEach(item => {
        if (item.subcategoryid === subcategory) {
            filteredItems.push(item);
        }
    });
    //console.log("item filter s cat : " + JSON.stringify(filteredItems));
    return filteredItems;
}

function filterItemsByBrand(subCategoryItemList, brand) {
    let filterItemsBrand = [];
    subCategoryItemList.forEach(item => {
        if (item.brand == brand) {
            filterItemsBrand.push(item);
        }
    });
    return filterItemsBrand;
}

function filterItemsByPrice(subCategoryItemList, price) {
    let filterItemsPrice = [];
    subCategoryItemList.forEach(item => {
        if (item.unitprice == price) {
            filterItemsPrice.push(item);
        }
    });
    return filterItemsPrice;
}


const addItem = (name, unitprice, subcategoryid, image, color, measure, brand, about, warehouse, response) => {
    console.log("this is my item bitch " + name)
    //console.log("this is my item bitch " + itemid)
    console.log("this is my item bitch " + unitprice)
    console.log("this is my item bitch " + subcategoryid)
    //console.log("this is my item bitch " + date)
    console.log("this is my item bitch " + image)
    console.log("this is my item bitch " + color)
    console.log("this is my item bitch " + measure)
    console.log("this is my item bitch " + about)
    const warehouseid = warehouse;
    console.log("this is my item bitch " + warehouseid)

    db.pool.query('SELECT max(itemid) FROM "item"', (error, results) => {
        if (error) {
            throw error
        }
        console.log("bro")
        console.log(results)
        const itemid = results.rows[0].max == null ? 1 : (results.rows[0].max) + '1'
        console.log("itemid " + itemid);
        //http://localhost:8081/addItem?name=Name01&unitprice=15&subcategoryid=s-cat-0001&date=1/1/1&image=null&color=negro&measure=s&brand=brand15&about=this%20is...
        let today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0! 
        const yyyy = today.getFullYear();
        today = dd + '/' + mm + '/' + yyyy;
        const values = "('" + name + "', '" + itemid + "', " + unitprice + ", '" + subcategoryid + "','" + today + "'," + image + ",'" + color + "','" + measure + "','" + brand + "','" + about + "','" + warehouseid + "')";
        const columns = "(name, itemid, unitprice, subcategoryid, date, image, color, measure, brand, about,warehouseid)"
        const dbQuery = 'INSERT INTO "item" ' + columns + ' VALUES ' + values;
        console.log("query to save a item" + dbQuery);
        db.pool.query(dbQuery, (err, res) => {
            if (err) {
                throw err;
            } 12
            const objResponse = {
                status: 200,
                warehouseid: warehouseid,
                itemid: itemid,
                name: name
            }
            response.json(objResponse);
        })
    });
}

const getItemsByWarehouse = (warehouseid, response) => {
    const warehouseid_ = warehouseid + '';
    const dbQuery = "SELECT * FROM item WHERE warehouseid= '" + warehouseid_ + "'";
    db.pool.query(dbQuery, (err, results) => {
        if (err) {
            throw err;
        }
        const itemsWarehouse = results.rows;
        response.json(itemsWarehouse);
    })

}


const deleteItem = (itemid, response) => {
    const itemid_ = itemid + '';
    const dbQuery = "DELETE FROM item WHERE itemid= '" + itemid_ + "'";
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

exports.deleteItem = deleteItem;
exports.getItemsByWarehouse = getItemsByWarehouse;
exports.addItem = addItem;
exports.getItemListSearch = getItemListSearch;
exports.getItemList = getItemList;