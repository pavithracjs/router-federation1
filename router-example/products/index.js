import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import gql from 'graphql-tag';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { printSchema } from 'graphql';
import fs from 'fs';

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

const typeDefs = gql`
    type ProductM @key(fields: "upc") {
        upc: String!
        name: String
        price: Int
        weight: Int
    }

    extend type Query {
        topProducts(first: Int = 5): [ProductM]
    }
`;

const resolvers = {
    Query: {
        topProducts(_, args) {
            return products.slice(0, args.first);
        }
    },
    Product: {
        __resolveReference(object) {
            return products.find(product => product.upc === object.upc);
        },
    },
};
const schema = buildSubgraphSchema({ typeDefs, resolvers });
const server = new ApolloServer({
    schema,
    cors: {
        origin: '*',
        credentials: true,
    },
});

// Function to write the schema to a file
const writeSchemaToFile = async () => {
    fs.writeFileSync('./schema/products-schema.graphql', printSchema(schema));
    console.log('Schema has been written to schema/schema.graphql');
};

async function startServer() {
    const { url } = await startStandaloneServer(server, { listen: { port: 4001 } });
    console.log(`🚀  Server ready at ${url}`);
    writeSchemaToFile();
}

startServer().catch(err => console.error(err));
