import { buildSchema, parse, print, printSchema } from 'graphql';
import { composeAndValidate, buildFederatedSchema } from '@apollo/federation';
import { readFileSync, writeFileSync } from 'fs';
import path, { dirname } from 'path';

import { fileURLToPath } from 'url';

// Resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to ensure consistent federation directives
const addFederationDirectives = (typeDefs) => {
    // const federationDirectives = `
    //     scalar _FieldSet
    //     directive @key(fields: _FieldSet!) on OBJECT | INTERFACE
    //     directive @extends on OBJECT | INTERFACE
    //     directive @external on FIELD_DEFINITION
    //     directive @requires(fields: _FieldSet!) on FIELD_DEFINITION
    //     directive @provides(fields: _FieldSet!) on FIELD_DEFINITION
    //     directive @shareable on OBJECT | FIELD_DEFINITION
    // `;
    // return `${federationDirectives}\n${typeDefs}`;
    return typeDefs
};

// Read subgraph schemas
const usersSchema = readFileSync(path.join(__dirname, './schema/user-schema.graphql'), 'utf-8');
// const productsSchema = readFileSync(path.join(__dirname, './schema/products-schema.graphql'), 'utf-8');

// Apply federation directives
const usersSchemaWithDirectives = addFederationDirectives(usersSchema);
// const productsSchemaWithDirectives = addFederationDirectives(productsSchema);

// Function to add @join__graph directive dynamically
const addJoinGraphDirective = (typeDefs, name, url) => {
    const documentNode = parse(typeDefs);
    const directiveDefinition = `directive @join__graph(name: String!, url: String!) on ENUM_VALUE`;

    documentNode.definitions.unshift(parse(directiveDefinition).definitions[0]);

    documentNode.definitions.forEach(def => {
        if (def.kind === 'EnumTypeDefinition' && def.name.value === 'join__Graph') {
            def.values.forEach(value => {
                if (value.name.value === name.toUpperCase()) {
                    value.directives.push({
                        kind: 'Directive',
                        name: { kind: 'Name', value: 'join__graph' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'name' },
                                value: { kind: 'StringValue', value: name }
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'url' },
                                value: { kind: 'StringValue', value: url }
                            }
                        ]
                    });
                }
            });
        }
    });

    return print(documentNode);
};

// Define subgraphs with URLs and updated schemas
const subgraphs = [
    {
        name: 'users',
        typeDefs: addJoinGraphDirective(usersSchemaWithDirectives, 'users', 'http://localhost:4000'),
        url: 'http://localhost:4000'
    },
    // {
    //     name: 'products',
    //     typeDefs: addJoinGraphDirective(productsSchemaWithDirectives, 'products', 'http://localhost:4001'),
    //     url: 'http://localhost:4001'
    // }
];

// Parse the modified schemas
const usersParsed = parse(subgraphs[0].typeDefs);
// const productsParsed = parse(subgraphs[1].typeDefs);

// Build subgraph schemas
const subgraphSchemas = [
    {
        name: 'users',
        typeDefs: usersParsed,
    },
    // {
    //     name: 'products',
    //     typeDefs: productsParsed,
    // },
];

// Compose and validate the supergraph schema
const { schema, errors } = composeAndValidate(subgraphSchemas);

if (errors && errors.length > 0) {
    console.error('Errors in composed schema:', errors);
} else {
    const supergraphSchema = printSchema(schema);
    writeFileSync('supergraph-composed.graphql', supergraphSchema);
    console.log('Supergraph schema written to supergraph-composed.graphql');
}