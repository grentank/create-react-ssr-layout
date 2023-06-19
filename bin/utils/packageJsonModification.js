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
  eslint: '',
  prettier: '',
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
  prettier: 'prettier eslint-config-prettier',
};

const scriptsToPackageJson = async (options) => {
  const packageJson = await fs.readFile('package.json', 'utf-8');
  const jsonData = JSON.parse(packageJson);
  const devDependencies = [
    'npm',
    'i',
    '-D',
    '@babel/node',
    '@babel/preset-react',
    '@babel/preset-env',
    'eslint',
    'eslint-config-airbnb',
    'eslint-plugin-import',
    'eslint-plugin-jsx-a11y',
    'eslint-plugin-react',
    'eslint-plugin-react-hooks',
  ];
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
      jsonData.scripts[
        'prep-db'
      ] = `npx sequelize-cli db:drop && npx sequelize-cli db:create && npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all`;
      jsonData.scripts.launch = `npm run prep-db && ${jsonData.scripts.start}`;
    }
  });

  jsonData.scripts.deps = [...devDependencies, '&&', ...dependencies]
    .filter((dep) => dep !== '')
    .join(' ');
  await fs.writeFile('package.json', JSON.stringify(jsonData, null, '  '), 'utf-8');
};

function checkPackageJson() {
  return fs.readFile('package.json', 'utf-8');
}

const instructions = [
  {
    command: 'npm start',
    description: 'Configure bundles and start the server',
  },
  {
    command: 'npm run deps',
    description: 'Install all dependencies',
  },
  {
    command: 'npm run launch',
    description: 'Migrate + Seed + Quick start',
  },
  {
    command: 'npm run dev',
    description: 'Start the server',
  },
  {
    command: 'npm run webpack',
    description: 'Start webpack in watch mode',
  },
];

module.exports = { scriptsToPackageJson, checkPackageJson, instructions };
