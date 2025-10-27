# Repository Guidelines

This document provides guidelines for contributing to the Codetopic repository. Following these guidelines will help us maintain a high-quality and consistent codebase.

## Project Structure & Module Organization

The project is organized into the following directories:

-   **`/app`**: Contains the core application logic, including routing, pages, and API endpoints.
-   **`/components`**: Contains reusable React components used throughout the application.
-   **`/lib`**: Contains shared utilities, helper functions, and business logic.
-   **`/public`**: Contains static assets such as images, fonts, and icons.
-   **`/docs`**: Contains project documentation.

## Build, Test, and Development Commands

The following commands are available for building, testing, and running the project locally:

-   **`npm run dev`**: Starts the development server with hot-reloading.
-   **`npm run build`**: Compiles the application for production.
-   **`npm run start`**: Starts the production server.
-   **`npm run lint`**: Lints the code to enforce a consistent style.

## Coding Style & Naming Conventions

We follow these coding style and naming conventions:

-   **Indentation**: Use 2 spaces for indentation.
-   **Styling**: We use ESLint and Prettier to enforce a consistent coding style. Please make sure to run `npm run lint` before submitting a pull request.
-   **Naming**: Components should be named in PascalCase (e.g., `MyComponent`), and files should be named in kebab-case (e.g., `my-component.tsx`).

## Testing Guidelines

-   **Framework**: We use Jest for testing. While there are no tests in the project yet, we encourage you to add them for any new features or bug fixes.
-   **Running Tests**: You can run the tests using the `npm test` command (once tests are added).

## Commit & Pull Request Guidelines

-   **Commit Messages**: Commit messages should be descriptive and follow the conventional commit format. Start with a verb in the imperative mood, followed by a summary of the changes (e.g., "Add feature for user authentication").
-   **Pull Requests**: Before submitting a pull request, please ensure that your code lints correctly and that you have added any necessary tests. Provide a clear description of the changes in the pull request, and link to any relevant issues.
