const fs = require('fs/promises');
const path = require('path');

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
    } catch (e) {
      console.log(`Failed to create a new directory ${dirs[i]}.\n`);
    }
  }
};

const scriptToPackageJson = async () => {
  const packageJson = await fs.readFile('package.json', 'utf-8');
  const jsonData = JSON.parse(packageJson);
  jsonData.scripts.deps = 'npm i -D @babel/node @babel/plugin-proposal-class-properties @babel/preset-react @babel/preset-env babel-loader morgan webpack webpack-cli sequelize-cli'
  + '&& npm i express react react-dom react-router-dom sequelize pg pg-hstore dotenv express-session session-file-store bcrypt axios';
  await fs.writeFile('package.json', JSON.stringify(jsonData, null, '  '), 'utf-8');
};

module.exports = {
  createFile, getFiles, makeDirs, scriptToPackageJson,
};
