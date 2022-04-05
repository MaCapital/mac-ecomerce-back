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

exports.getItemListSearch = getItemListSearch;
exports.getItemList = getItemList;