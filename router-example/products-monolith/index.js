import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import gql from 'graphql-tag';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const typeDefs = gql`
    type Query {
        me: User,
        users: [User],
        usersId: User,
        topUserProducts(first: Int = 5): [Product]
    }

    type User {
        id: ID!
        username: String
    }

    type Product {
        upc: String!
        name: String
        price: Int
        weight: Int
    }
`;

const users = [
    {
        username: 'Peter',
        id: 2
    },
    {
        username: 'John',
        id: 3
    },
    {
        username: 'Doe',
        id: 4
    },
    {
        username: 'Sam',
        id: 5
    }
]

const products = [
    {
        upc: '1',
        name: 'Table',
        price: 899,
        weight: 100
    },
    {
        upc: '2',
        name: 'Couch',
        price: 1299,
        weight: 1000
    },
    {
        upc: '3',
        name: 'Chair',
        price: 54,
        weight: 50
    }
];

const resolvers = {
    Query: {
        me() {
            return { id: '1', username: '@ava' };
        },
        async users() {
            await sleep(2000)
            return users;
        },
        usersId(_, args) {
            console.log(args);
            return users;
        },
        async topUserProducts(_, args) {
            await sleep(4000)
            return products.slice(0, args.first);
        }
    }
};

const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
    const { url } = await startStandaloneServer(server, { listen: { port: 4010 } });
    console.log(`🚀  Server ready at ${url}`);
}

startServer().catch(err => console.error(err));
