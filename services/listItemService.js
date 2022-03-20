const dataGenerator = require('../utils/dataGenerator')

//get the item list
const getItemList = (categoryId, subcategoryId) => {
    
    let filteredItems = [];
    //ask for all items
    const items = dataGenerator.fakeItem;
    filteredItems = items;
    //ask for subcategories of a specific category
    
    let subcategories = dataGenerator.fakeSubCategory;

    if(categoryId && !subcategoryId) {
        subcategories = filterSubcategoryByCategory(categoryId, dataGenerator.fakeSubCategory);
        //filter items by all subcategories of a specific categoryId
        subcategories.forEach(subcatId => {
            const filteredItemsBySubCat = filterItemBySubcategory(items, subcatId);
            filteredItemsBySubCat.forEach(item => {
                filteredItems.push(item);
            });
        });
    }

    //filter items by a specific subcategory
    if(subcategoryId) {
        filteredItems = filterItemBySubcategory(filteredItems, subcategoryId)
    }
    return filteredItems;
}

function filterSubcategoryByCategory(category, subCategoryList) {
    let subCategoryFiltered = [];
    subCategoryList.forEach(scObj => {
        if(scObj.categoryId === category) {
            subCategoryFiltered.push(scObj);    
        }
    });
    return subCategoryFiltered;
}

function filterItemBySubcategory(items, subcategory) {
    let filteredItems = [];
    items.forEach(item => {
        if(item.subCategoryId === subcategory) {
            filteredItems.push(item);
        }
    });
    return filteredItems;
}

exports.getItemList = getItemList;