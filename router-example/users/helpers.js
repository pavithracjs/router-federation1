
export const users = [
    {
        username: 'Peter1',
        id: 1,
        productId: 4
    },
    {
        username: 'Peter',
        id: 2,
        productId: 1
    },
    {
        username: 'John',
        id: 3,
        productId: 2
    },
    {
        username: 'Doe',
        id: 4,
        productId: 3
    },
    {
        username: 'Sam',
        id: 5,
        productId: 2
    }
]

export const products = [
    {
        productId: 1,
        name: 'Table',
        price: 899,
        weight: 100
    },
    {
        productId: 2,
        name: 'Couch',
        price: 1299,
        weight: 1000
    },
    {
        productId: 3,
        name: 'Chair',
        price: 54,
        weight: 50
    }
];
export const fetchUserById = (userId) => {
    return users.find(user => user.id === userId);
}

export const fetchProductById = (id) => {
    console.log('fetchProductById', id);
    return products.find(product => product.productId === id);
}