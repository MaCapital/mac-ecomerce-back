const dataGenerator = require('../utils/dataGenerator')
const db = require('../queries/queries');

//get category list
const getCategoryList = (response) => {
    let categoryList = [];
    db.pool.query('SELECT * FROM category', (error, results) => {
        if (error) {
            throw error
        }
        //const categories = dataGenerator.fakeCategory;
        const categories = results.rows;
        categoryList = categories;
        response.json(categoryList);
    });
    //return categoryList;
}
const getSubCategoryList = (categoryId, response) => {
    let subcategoryList = [];
    db.pool.query('SELECT * FROM sub_category', (error, results) => {

        if (error) {
            throw error
        }
        const subCategories = results.rows;
        if (!categoryId) {
            subcategoryList = subCategories;
        } else {
            subCategories.forEach(subcategory => {
                if (subcategory.categoryid === categoryId) {
                    subcategoryList.push(subcategory)
                }
            });
        }
        response.json(subcategoryList);
    });
    //return subcategoryList;
}
exports.getSubCategoryList = getSubCategoryList;
exports.getCategoryList = getCategoryList;
