Compose Supergraph
    rover supergraph compose --config ./supergraph-config.yaml > supergraph-schema.graphql
    
Router
    ./router --config ./apollo-router/router-config.yaml --supergraph supergraph-schema.graphql --hot-reload
    z./router --config ./apollo-router/router-config.yaml --supergraph supergraph-composed.graphql


    hive dev --service users --url http://localhost:4000/graphql

Prerequisite:
    - Node 14 and above
        - rover, router
    - Apollo Client 3.7.0 and above for @defer

Additional Packages:
    Apollo Router v1.38.0
    Rover 0.22.0
        -- it needs api key - private also works should check in ci pipeline 
        -- otherwise alternate to rover graphql tools
    Federation: 2.6.3 (https://www.apollographql.com/docs/router/federation-version-support)

@Defer available in
 - node_modules/@apollo/federation-internals/src/definitions.ts

Router yaml configuration
    https://www.apollographql.com/docs/router/configuration/overview
    https://github.com/apollographql/router-template/blob/main/router.yaml

    limits:
        parser_max_tokens: 15000 # This is the default value.
        parser_max_recursion: 4096 # This is the default value.
        max_depth: 100 # Must be 15 or larger to support standard introspection query
        max_height: 200
        max_aliases: 30
        max_root_fields: 20

TODO: 
    - Router customization
        (Rhia)
            - Router logging and monitoring
            - Header Propagation
        Rust Plugins
            - custom binary (build it with rus)
            - https://www.apollographql.com/docs/router/customizations/custom-binary
    - Traffic shaping
        - Query deduplication
        - variable deduplication
    
    https://www.apollographql.com/docs/router/configuration/telemetry/exporters/logging/overview/
    https://www.apollographql.com/docs/router/configuration/header-propagation/
    https://www.apollographql.com/docs/router/configuration/traffic-shaping
    https://www.apollographql.com/docs/router/customizations/overview/

Loading state for inline fragments
    https://github.com/apollographql/apollo-client/blob/d96f4578f89b933c281bb775a39503f6cdb59ee8/src/core/ObservableQuery.ts

CORs Router configuration
    - https://www.apollographql.com/docs/router/configuration/cors/

Suspense queries
 - https://www.apollographql.com/docs/react/data/suspense/


SOC
    - code
    - deployment

- deferred request if it resolves first
- primary non  deferred resolver is mandatory


--hot-reload
