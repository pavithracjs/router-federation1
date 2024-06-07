import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import gql from 'graphql-tag';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { buildFederatedSchema } from '@apollo/federation';
import { printSchema } from 'graphql';
import fs from 'fs';
import { users, products, fetchUserById, fetchProductById } from './helpers.js';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const typeDefs = gql`

    type Product @key(fields: "productId") {
        productId: Int!
        upc: String!
        name: String
        price: Int
        weight: Int
    }

    type User @key(fields: "id") {
        id: ID!
        username: String
        product: Product
    }

    

    type Query {
        me: User,
        users: [User],
        product: Product,
        usersId: User,
        topUserProducts(first: Int = 5): [Product]
    }

`;
const resolvers = {
    Query: {
        me: async () => {
            return fetchUserById('1');
        },
        users: async () => {
            return users;
        },
        user: async (_, { id }) => {
            return fetchUserById(id);
        },
    },
    User: {
        __resolveReference: (object) => {
            console.log("__resolveReference for User", object);
            return fetchUserById(object.id);
        },
        product: (user) => {
            return { __typename: 'Product', productId: user.productId };
        },
    },
    Product: {
        __resolveReference: (productRepresentation) => {
            console.log("__resolveReference for Product", productRepresentation);
            return fetchProductById(productRepresentation.productId);
        },
    },
};
// const resolvers = {
//     Query: {
//         async me() {
//             // await sleep(1000)
//             return { id: '1', username: '@ava' };
//         },
//         async users() {
//             // await sleep(4000)
//             return users;
//         },
//         async topUserProducts(_, args) {
//             // await sleep(8000)
//             return products.slice(0, args.first);
//         },
//         async product(_, args) {
// console.log(args);
//         }
//     },
//     User: {
//         __resolveReference(object) {
//             console.log("__resolveReference")
//             return { ...object, ...fetchUserById(object.id) };
//         },
//         product(user) {
//             return user.productId;
//         },
//         // async product(user) {
//         //     console.log("object", user)
//         //     await sleep(8000)
//         //     return fetchProductById(user.productId);
//         //     // return { __typename: 'Product', productId: user.productId };
//         // },
//     },
//     Product: {
//         __resolveReference(productRepresentation) {
//             console.log("productRepresentation", productRepresentation)
//             return fetchProductById(productRepresentation.productId);
//         },
        
//         // title: (parent) => {
//         //     return `${parent.upc}@${parent.name}`;
//         // },
//     },
    
// };
const schema = buildSubgraphSchema({ typeDefs, resolvers });
// const schema = buildFederatedSchema({ typeDefs, resolvers });
const server = new ApolloServer({
    schema,
    cors: {
        origin: '*',
        credentials: true,
    },
});

const writeSchemaToFile = async () => {
    // console.log(schema);
    fs.writeFileSync('./schema/user-schema.graphql', printSchema(schema));
    // console.log('Schema has been written to schema/schema.graphql');
};

async function startServer() {
    const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
    console.log(`🚀  Server ready at ${url}`);
    writeSchemaToFile();
}

startServer().catch(err => console.error(err));