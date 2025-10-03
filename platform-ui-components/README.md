# Platform UI Components Library

This repository contains the official, reusable React component library for the platform's frontend applications. It provides a consistent visual and interactive language across all user-facing products, ensuring brand consistency and promoting code reuse.

Built with React, TypeScript, and MUI, and developed in isolation using Storybook.

## Requirements

- Node.js (v18.x or later)
- npm (v8.x or later)

## Installation for Consumers

This is a private package hosted on GitHub Packages. To install it in a consuming project (e.g., `platform-web-app`), first authenticate with GitHub Packages.

1.  **Authenticate**: Ensure you have a Personal Access Token (PAT) with `read:packages` scope.
2.  **Configure `.npmrc`**: Add the following to a `.npmrc` file in your project's root:
    ```
    @platform-ui:registry=https://npm.pkg.github.com/
    ```
3.  **Install the package**:
    ```bash
    npm install @platform-ui/components
    ```

## Local Development

To develop and test components in isolation:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-org/platform-ui-components.git
    cd platform-ui-components
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run Storybook**:
    ```bash
    npm run storybook
    ```
    This will start the Storybook development server, typically at `http://localhost:6006`.

## Available Scripts

- `npm run storybook`: Starts the Storybook development server.
- `npm run build`: Bundles the library for production using Rollup.
- `npm run test`: Runs the test suite using Jest.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run format`: Formats the codebase using Prettier.
- `npm run changeset`: Creates a new changeset for versioning.
- `npm run changeset:version`: Bumps the package version based on existing changesets.
- `npm run changeset:publish`: Publishes the new version to the registry.

## Contributing

### Creating a New Component

1.  Create a new directory for your component under `src/components/`.
2.  Create the component file (e.g., `MyComponent.tsx`).
3.  Create a Storybook file (e.g., `MyComponent.stories.tsx`).
4.  Export the component from `src/index.ts`.
5.  Develop the component in isolation using its Storybook story.

### Submitting Changes

1.  Make your changes on a new feature branch (e.g., `feature/add-new-component`).
2.  Add a changeset to document your changes:
    ```bash
    npm run changeset
    ```
    Follow the prompts to specify the type of change (patch, minor, major) and write a clear description. This will generate a new markdown file in the `.changeset` directory.
3.  Commit your code and the new changeset file.
4.  Push your branch and open a Pull Request to `main`.

## Release Process

The release process is automated by GitHub Actions using **Changesets**.

1.  When a Pull Request with one or more changesets is merged into `main`, the `Release Pipeline` workflow will automatically run.
2.  This action will create a "Version Packages" Pull Request that bumps the package version in `package.json` and compiles a `CHANGELOG.md`.
3.  Once this "Version Packages" PR is merged into `main`, the same workflow will trigger again. This time, it will detect the version bump and proceed to publish the new version of the package to the GitHub Packages registry.