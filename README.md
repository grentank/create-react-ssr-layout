# create-react-ssr-layout

A useful tool to quickly build a basic express server that uses a custom-built SSR engine.

## Installation

There is no need to install this package. Its purpose is to be executable-only. However if you do want it to be installed use

```
npm install -D create-react-ssr-layout
```


## Usage

Simply run this command in your terminal

```
npx create-react-ssr-layout
```

It will create all essential files and directories to launch a server. By default dependencies will not be installed. Run `npm run deps` or add a flag  `-i` or `--install` to install all dependencies automatically.

If you don't want to install all of the provided dependencies you can configure them by yourself. Check the `npm run deps` script in `package.json` to extract the required packages.


## Quick start

Execute this package with `-i` to create required files and install all dependencies

```
npx create-react-ssr-layout -i
```

To launch the server use

```
npm start
```

The server starts on port 3000 by default. Go to `http://localhost:3000/` to open the page.

## Scripts

### npm run deps

Installs all dependencies at once. To be specific it installs the following

- dependencies: express, react, react-dom, react-router-dom, sequelize, pg, pg-hstore, dotenv, express-session, session-file-store, bcrypt, axios
- devDependencies: @babel/node, @babel/plugin-proposal-class-properties, @babel/preset-react, @babel/preset-env, babel-loader, morgan, webpack, webpack-cli, sequelize-cli

### npm start

Executes webpack to create bundles and then launches the server on a specified port via babel-node.

### npm run launch

Performs migrations and seeds a database. Then executes webpack and launches the server. Before executing this script run `npx sequelize-cli --init`, prepare and configure a database, make required changes to `.env` file.

### npm run dev

Only starts the server.

### npm run webpack

Starts webpack with in watch mode.

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

`Layout.jsx` has basic HTML markdown. It uploads webpack scripts `app.js` and `vendor.js` and uses `dangerouslySetInnerHTML` to pass `initState` to client side for the hydration process.