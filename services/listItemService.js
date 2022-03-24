const dataGenerator = require('../utils/dataGenerator');
//get the item list
const db = require('../queries/queries');
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

        let subcategories = dataGenerator.fakeSubCategory;

        if (categoryId && !subcategoryId) {
            filteredItems = [];
            subcategories = filterSubcategoryByCategory(categoryId, dataGenerator.fakeSubCategory);
            subcategories.forEach(subcatObj => {
                const filteredItemsBySubCat = filterItemBySubcategory(items, subcatObj.subCategoryId);
                filteredItemsBySubCat.forEach(item => {
                    filteredItems.push(item);
                });
            });
        }
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
    })

}

function filterSubcategoryByCategory(category, subCategoryList) {
    let subCategoryFiltered = [];
    subCategoryList.forEach(scObj => {
        if (scObj.categoryId === category) {
            subCategoryFiltered.push(scObj);
        }
    });
    return subCategoryFiltered;
}

function filterItemBySubcategory(items, subcategory) {
    let filteredItems = [];
    items.forEach(item => {
        if (item.subCategoryId === subcategory) {
            filteredItems.push(item);
        }
    });
    console.log("item filter s cat : " + JSON.stringify(filteredItems));
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
        if (item.unitPrice == price) {
            filterItemsPrice.push(item);
        }
    });
    return filterItemsPrice;
}

exports.getItemList = getItemList;