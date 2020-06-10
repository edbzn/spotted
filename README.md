# Spotted

![Spotted](https://media.giphy.com/media/F3iTD8JI4OPIs/giphy.gif)

## :rainbow: Development

Run `yarn start` to serve the project, navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## :hammer: Build

Run `yarn nx build spotted` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## :crystal_ball: Tests

Run `yarn nx test spotted` to execute the unit tests via [Jest](https://jestjs.io).

Run `yarn nx affected:test` to execute the unit tests affected by a change.

Run `yarn nx e2e spotted` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `yarn nx affected:e2e` to execute the end-to-end tests affected by a change.

## Workspace

Run `yarn nx dep-graph` to see a diagram of the dependencies of your projects.
