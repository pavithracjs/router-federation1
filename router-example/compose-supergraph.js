import { buildSchema, parse, printSchema } from 'graphql';
import { composeAndValidate } from '@apollo/federation';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
// import { IntrospectAndCompose } from '@apollo/gateway';

// Resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read subgraph schemas
const usersSchema = readFileSync(join(__dirname, 'schema/user-schema.graphql'), 'utf-8');
const productsSchema = readFileSync(join(__dirname, 'schema/products-schema.graphql'), 'utf-8');

// Parse schemas into DocumentNode (AST)
const usersTypeDefs = parse(usersSchema);
const productsTypeDefs = parse(productsSchema);

// Build subgraph schemas
const subgraphs = [
    {
        name: 'users',
        typeDefs: usersTypeDefs,
        url: 'http://localhost:4000'
    }
];

// {
//     name: 'products',
//     typeDefs: productsTypeDefs,
//     url: 'http://localhost:4011'
// },

// Compose the subgraphs into a supergraph schema
const composed = composeAndValidate(subgraphs);

// const supergraphSDL = new IntrospectAndCompose({
//     subgraphs: [
//         { name: 'users', url: 'http://localhost:4000' },
//     ],
// });


import { stitchSchemas } from '@graphql-tools/stitch';

const gatewaySchema = stitchSchemas({
    subschemas: [
        { schema: usersTypeDefs },
    ],
});

console.log(JSON.stringify(gatewaySchema))

// const supergraphSchema = printSchema(supergraphSDL);
// writeFileSync('supergraph-composed.graphql', supergraphSchema);
// console.log('Supergraph schema written to supergraph.graphql');

// console.log(JSON.stringify(supergraphSDL))

// if (composed.errors?.length > 0) {
//     console.error('Errors in composed schema:', composed.errors);
// } else {
// const supergraphSchema = printSchema(composed.schema);
// writeFileSync('supergraph-composed.graphql', supergraphSchema);
// console.log('Supergraph schema written to supergraph.graphql');
// }