import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'src/graphql/schema.graphql',
  documents: undefined, // No client-side documents in this project
  generates: {
    'src/graphql/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-resolvers',
        {
          'typescript-mappers': {
            mappers: {
              // Example of mapping GraphQL types to domain models if needed in future
              // User: '../domain/user#User'
            },
          },
        },
      ],
      config: {
        useIndexSignature: true, // Allows for more flexible resolver types
        contextType: 'src/graphql/generated/context#GraphQLContext', // Placeholder for context type
        defaultMapper: 'Partial<{T}>', // Makes mappers partial by default
        enumsAsTypes: true, // Use 'type' for enums instead of 'enum' for wider compatibility
      },
    },
    'src/graphql/generated/schema.json': {
      plugins: ['introspection'],
    },
  },
  hooks: {
    afterAllFileWrite: ['prettier --write'],
  },
};

export default config;