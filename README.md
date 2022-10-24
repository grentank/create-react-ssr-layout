# create-react-ssr-layout

A useful npx tool to quickly build a basic express server that uses a custom-built SSR engine.

[Check out this package on npm](https://www.npmjs.com/package/create-react-ssr-layout "NPM create-react-ssr-layout")
[And on GitHub](https://github.com/grentank/create-react-ssr-layout "GitHub")

## Usage

Simply run this command in your terminal

```
npx create-react-ssr-layout
```

Answer questions via cli and pick a server build. You may use a predefined one or customize the build on your own. All required dependencies will be installed automatically.

## Quick start

Execute this package

```
npx create-react-ssr-layout
```

Answer some questions and wait until all files are created and all dependencies are installed. To launch the server use

```
npm start
```

The server starts on port 3000 by default. Go to [`http://localhost:3000/`](http://localhost:3000/) to open the page.

## Scripts

### npm start

Executes webpack to create bundles and then launches the server on a specified port via babel-node.

### npm run deps

Installs all chosen dependencies at once. Picking "Maximum server" option will install the following

- dependencies: express, react, react-dom, react-router-dom, sequelize, pg, pg-hstore, dotenv, express-session, session-file-store, bcrypt, axios
- devDependencies: @babel/node, @babel/plugin-proposal-class-properties, @babel/preset-react, @babel/preset-env, babel-loader, morgan, webpack, webpack-cli, sequelize-cli


The option "Minimum server" will install the following

- dependencies: express, react, react-dom
- devDependencies: @babel/node, @babel/preset-react, @babel/preset-env

Each custom option picked adds required dependencies and/or devDependencies.

### npm run launch

Performs migrations and seeds a database. Then executes webpack and launches the server. Before executing this script run `npx sequelize-cli --init`, prepare and configure a database, make required changes to `.env` file.

### npm run dev

Only starts the server.

### npm run webpack

Starts webpack in watch mode.

## Project tree

```bash
.
├── .babelrc
├── .env
├── .sequelizerc
├── webpack.config.js
└── src
    ├── components
    │   ├── App.jsx
    │   ├── index.jsx
    │   └── Layout.jsx
    ├── routes
    │   ├── apiRouter.js
    │   └── indexRouter.js
    ├── server.js
    └── utils
        └── jsxRender.js
```

## Used packages

- React-based
    - react
    - react-dom
    - react-router-dom
- Server-based
    - express
    - express-session
    - session-file-store
    - dotenv
    - morgan
    - bcrypt
    - axios
- Sequelize
    - sequelize
    - sequelize-cli
    - pg
    - pg-hstore
- Babel
    - @babel/node
    - @babel/plugin-proposal-class-properties
    - @babel/preset-react
    - @babel/preset-env
- Webpack
    - webpack
    - webpack-cli
    - babel-loader

## SSR

The server uses custom jsx render engine that constructs a markup on the server side via `renderToString()` method from `react-dom/server`. The object `initState` is used to deliver data from server through props directly to the `App.jsx` component. For routing purposes `req.originalUrl` is included into `res.locals`.

Two routers are added for convenience. `indexRouter` uses `res.render` method for rendering markups. `res.render` requires a string `Layout` to be passed as its first argument. The second argument may be ommited. Use it to pass props to `App.jsx`.

`Layout.jsx` has basic HTML markdown. It uploads webpack scripts `app.js` and `vendor.js` and uses `dangerouslySetInnerHTML` to pass `initState` to client side for the hydration process (if an option `webpack` with hydration was picked).

## Issues

Please, report about any found problems in project's github issues.
