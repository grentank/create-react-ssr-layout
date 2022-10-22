const fs = require('fs/promises');

const dependenciesMap = {
  webpack: '',
  json: '',
  routing: 'react-router-dom',
  morgan: '',
  dotenv: 'dotenv',
  sequelize: 'sequelize pg pg-hstore',
  session: 'express-session session-file-store',
  axios: 'axios',
  bcrypt: 'bcrypt',
};

const devDependenciesMap = {
  webpack: '@babel/plugin-proposal-class-properties babel-loader webpack webpack-cli',
  json: '',
  routing: '',
  morgan: 'morgan',
  dotenv: '',
  sequelize: 'sequelize-cli',
  session: '',
  axios: '',
  bcrypt: '',
};

const scriptToPackageJson = async (options) => {
  const packageJson = await fs.readFile('package.json', 'utf-8');
  const jsonData = JSON.parse(packageJson);
  const devDependencies = ['npm', 'i', '-D', '@babel/node', '@babel/preset-react', '@babel/preset-env'];
  const dependencies = ['npm', 'i', 'express', 'react', 'react-dom'];
  jsonData.scripts.dev = 'babel-node src/server.js';
  jsonData.scripts.start = 'babel-node src/server.js';

  // configure starting scripts and dependenices based on options provided
  options.forEach((option) => {
    devDependencies.push(devDependenciesMap[option]);
    dependencies.push(dependenciesMap[option]);

    if (option === 'webpack') {
      jsonData.scripts.webpack = 'webpack -wd eval-source-map';
      jsonData.scripts.start = 'webpack -d eval-source-map && babel-node src/server.js';
    }

    if (option === 'sequelize') {
      jsonData.scripts.launch = `npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all && ${jsonData.scripts.start}`;
    }
  });

  jsonData.scripts.deps = [...devDependencies, '&&', ...dependencies].filter((dep) => dep !== '').join(' ');
  await fs.writeFile('package.json', JSON.stringify(jsonData, null, '  '), 'utf-8');
};

module.exports = scriptToPackageJson;
