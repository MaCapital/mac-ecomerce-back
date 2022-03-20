const fakeCategory = [{
    categoryId: 'cat-001',
    name: 'Fashion'
},
{
    categoryId: 'cat-002',
    name: 'Accesories'
}];

const fakeSubCategory = [{
    subCategoryId: 's-cat-001',
    categoryId: 'cat-001',
    name: "Men's Fashion"
},
{
    subCategoryId: 's-cat-002',
    categoryId: 'cat-001',
    name: "Women's Fashion"
},
{
    subCategoryId: 's-cat-003',
    categoryId: 'cat-001',
    name: "Men's Shoes"
},
{
    subCategoryId: 's-cat-004',
    categoryId: 'cat-001',
    name: "Women's Shoes"
},
{
    subCategoryId: 's-cat-005',
    categoryId: 'cat-002',
    name: "Watches"
},
{
    subCategoryId: 's-cat-006',
    categoryId: 'cat-002',
    name: "Bags"
}];

const fakeItem = [
    {
        name: 'item1',
        unitPrice: 5,
        subCategoryId: 's-cat-001',
        date: '01/01/22',
        brand: 'brand1',
        description: ' men fashion fashion'

    },
    {
        name: 'item2',
        unitPrice: 15,
        subCategoryId: 's-cat-002',
        date: '02/01/22',
        brand: 'brand1',
        description: ' women fashion fashion'
    }, {
        name: 'item3',
        unitPrice: 25,
        subCategoryId: 's-cat-003',
        date: '03/01/22',
        brand: 'brand5',
        description: ' men shoes fashion'

    }, {
        name: 'item4',
        unitPrice: 25,
        subCategoryId: 's-cat-004',
        date: '04/01/22',
        brand: 'brand2',
        description: ' women shoes fashion'

    }, {
        name: 'item5',
        unitPrice: 25,
        subCategoryId: 's-cat-005',
        date: '05/01/22',
        brand: 'brand2',
        description: ' watches  acc'

    }, {
        name: 'item6',
        unitPrice: 25,
        subCategoryId: 's-cat-006',
        date: '06/01/22',
        brand: 'brand3',
        description: ' bags acc'

    }];
