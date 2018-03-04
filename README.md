# Spotted

![Spotted](https://media.giphy.com/media/F3iTD8JI4OPIs/giphy.gif)

## Prerequisites

* Node >= X
* PHP >= 7
* Composer
* MariaDB

## Getting start

Command line interfaces are accessible through their related directory in `src/`

Start the api

```
php bin/console server:start
```

You can easily interact with the API using Postman

Api documentation is accessible at `http://localhost:XXXX/api/doc`

Start the front-end dev environment

```
npm start
```

Follow your dreams at `localhost:XXXX`

## API roadmap

* Authentication
  * [ ] Login
* Core
  * [ ] Define person model
  * [ ] Define spot model
  * [ ] Add spot roles
    * [ ] Logged (Put, Post, Delete)
    * [ ] Anonym (Get)
  * [ ] Search

## Front-end roadmap

* Core
  * Login page
  * Map page
    * [ ] Initialize map on user position
    * [ ] Show spots near from initialized position
    * [ ] For connected user ability to add a new spot
  * [ ] Spot detail page
  * [ ] Create spot page
* Shared
  * Ability to upload images
