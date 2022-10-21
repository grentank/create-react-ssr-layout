const fs = require('fs/promises');
const path = require('path');
const { exec } = require('child_process');

const createFile = async (filename) => fs.writeFile(filename, await fs.readFile(path.resolve(__dirname, `./${filename}`), 'utf8'));

const getFiles = async (dir) => {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  }));
  return files.flat().map((pathname) => pathname.replace(`${__dirname}/`, ''));
};

const makeDirs = async () => {
  const dirs = ['src', 'src/components', 'src/routes', 'src/utils'];
  for (let i = 0; i < dirs.length; i += 1) {
    try {
      await fs.mkdir(dirs[i]);
      console.log(`+++ Created directory ${dirs[i]}`);
    } catch (e) {
      console.log(`--- Failed to create directory ${dirs[i]}`);
    }
  }
};

const makeFiles = async () => {
  const filesList = (await getFiles(__dirname))
    .filter((filename) => (filename !== 'index.js') && (filename !== 'utils.js'));
  for (let i = 0; i < filesList.length; i += 1) {
    try {
      await createFile(filesList[i]);
      console.log(`+++ Created file ${filesList[i]}`);
    } catch (error) {
      console.log(`--- Failed to create file ${filesList[i]}`);
    }
  }
};

const deps = 'npm i -D @babel/node @babel/plugin-proposal-class-properties @babel/preset-react @babel/preset-env babel-loader morgan webpack webpack-cli sequelize-cli'
+ ' && npm i express react react-dom react-router-dom sequelize pg pg-hstore dotenv express-session session-file-store bcrypt axios';

const scriptToPackageJson = async () => {
  const packageJson = await fs.readFile('package.json', 'utf-8');
  const jsonData = JSON.parse(packageJson);
  jsonData.scripts.dev = 'babel-node src/server.js';
  jsonData.scripts.webpack = 'webpack -wd eval-source-map';
  jsonData.scripts.start = 'webpack -d eval-source-map && babel-node src/server.js';
  jsonData.scripts.launch = 'npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all && webpack && babel-node src/server.js';
  jsonData.scripts.deps = deps;
  await fs.writeFile('package.json', JSON.stringify(jsonData, null, '  '), 'utf-8');
};

const instructions = [
  {
    command: 'npm run deps',
    description: 'Install all dependencies',
  },
  {
    command: 'npm start',
    description: 'Bundle and start the server',
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
    description: 'Start webpack',
  },
];

const asyncExec = (str) => new Promise((res, rej) => {
  exec(str, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      rej(error);
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      rej(stderr);
    }
    res(stdout);
  });
});

const flagParser = () => {
  const flag = process.argv[2];
  switch (flag) {
    case '-i':
      console.log('Installing dependencies...');
      return asyncExec(deps);
    case '--install':
      console.log('Installing dependencies...');
      return asyncExec(deps);
    // case '-q':
    //   console.log('Initiating quick start');
    //   return asyncExec(deps).then(() => asyncExec('npm start'));
    // case '--quickstart':
    //   console.log('Initiating quick start');
    //   return asyncExec(deps).then(() => asyncExec('npm start'));
    default:
      return Promise.resolve();
  }
};

module.exports = {
  createFile, getFiles, makeDirs, scriptToPackageJson, makeFiles, instructions, flagParser,
};
