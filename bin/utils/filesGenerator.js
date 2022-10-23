const fs = require('fs/promises');
const path = require('path');

const createFile = async (filename) => fs.writeFile(filename, await fs.readFile(path.resolve(__dirname, `./${filename}`), 'utf8'));

const getFiles = async (dir) => {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  }));
  return files.flat().map((pathname) => pathname.replace(`${__dirname}/resources/`, ''));
};

const makeDirs = async () => {
  const dirs = ['src', 'src/components', 'src/routes', 'src/utils'];
  for (let i = 0; i < dirs.length; i += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await fs.mkdir(dirs[i]);
      console.log(`+++ Created directory ${dirs[i]}`);
    } catch (e) {
      console.log(`--- Failed to create directory ${dirs[i]}`);
    }
  }
};

const makeFiles = async () => {
  const filesList = (await getFiles(path.resolve(__dirname, '/resources')));
  // .filter((filename) => (filename !== 'index.js') && (filename !== 'utils.js'));
  for (let i = 0; i < filesList.length; i += 1) {
    try {
      await createFile(filesList[i]);
      console.log(`+++ Created file ${filesList[i]}`);
    } catch (error) {
      console.log(`--- Failed to create file ${filesList[i]}`);
    }
  }
};

const applyOptions = async (options) => {

};

module.exports = { makeDirs, makeFiles, applyOptions };
