# Spotted

![Spotted](https://media.giphy.com/media/F3iTD8JI4OPIs/giphy.gif)

## Prerequisites

- Node >= 8.0.0
- Npm >= 5.0.0

Once you have those, you should install these globals with npm install --global:

- webpack (npm install --global webpack)
- webpack-dev-server (npm install --global webpack-dev-server)
- karma (npm install --global karma-cli)
- protractor (npm install --global protractor)
- typescript (npm install --global typescript)
- tslint (npm install --global tslint@4.5.1)

## Getting start

- `npm install webpack-dev-server webpack -g` to install required global dependencies
- `npm install` to install all dependencies or `yarn`
- `npm run server` to start the dev server in another tab

## Running the app

After you have installed all dependencies you can now run the app. Run `npm run server` to start a local server using `webpack-dev-server` which will watch, build (in-memory), and reload for you. The port will be displayed to you as `http://0.0.0.0:5000`

### server

```bash
# development
npm run server
# production
npm run build:prod
npm run server:prod
```

## Other commands

### build files

```bash
# development
npm run build:dev
# production (jit)
npm run build:prod
# AoT
npm run build:aot
```

### hot module replacement

```bash
npm run server:dev:hmr
```

### watch and build files

```bash
npm run watch
```

### run unit tests

```bash
npm run test
```

### watch and run our tests

```bash
npm run watch:test
```

### run end-to-end tests

```bash
# update Webdriver (optional, done automatically by postinstall script)
npm run webdriver:update
# this will start a test server and launch Protractor
npm run e2e
```

### continuous integration (run unit tests and e2e tests together)

```bash
# this will test both your JIT and AoT builds
npm run ci
```

### run Protractor's elementExplorer (for end-to-end)

```bash
npm run e2e:live
```

### build Docker

```bash
npm run build:d
```
