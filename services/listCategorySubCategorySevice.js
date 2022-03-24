const dataGenerator = require('../utils/dataGenerator')

//get category list
const getCategoryList = () => {

    let categoryList = [];
    const categories = dataGenerator.fakeCategory;
    const subCategories = dataGenerator.fakeSubCategory;

    categoryList = categories;

    return categoryList;
}
const getSubCategoryList = (categoryId) => {

    let subcategoryList = [];
    const subCategories = dataGenerator.fakeSubCategory;

    subCategories.forEach(subcategory => {
        if (subcategory.categoryId === categoryId) {
            subcategoryList.push(subcategory)
        }
    });

    return subcategoryList;
}
exports.getSubCategoryList = getSubCategoryList;
exports.getCategoryList = getCategoryList;
