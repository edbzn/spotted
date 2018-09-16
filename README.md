[![Build Status](https://travis-ci.com/Edouardbozon/spotted.svg?branch=develop)](https://travis-ci.com/Edouardbozon/spotted)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

# Spotted

![Spotted](https://media.giphy.com/media/F3iTD8JI4OPIs/giphy.gif)

## :exclamation: Prerequisites

- Node >= 8.0.0
- Npm >= 5.0.0

## :rainbow: Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## :wrench: Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## :hammer: Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

Run `npm run serve-prod-ngsw` to build and serve the production app to test service workers, then navigate to `http://localhost:8080/`.

## :crystal_ball: Running tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## :whale: Docker

Build image `docker build -t spotted-web .`

Run image (on localhost:8080) `docker run --name spotted-web -p 8080:80 spotted-web`

Run image as virtual host (read more: https://github.com/jwilder/nginx-proxy) `docker run -e VIRTUAL_HOST=spotted-city.com --name spotted-web spotted-web`

## :rocket: Deployment

Simply run `now --docker`
