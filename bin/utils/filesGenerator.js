const fs = require('fs/promises');
const path = require('path');

const createFile = async (filename) => fs.writeFile(filename, await fs.readFile(path.resolve(__dirname, `./resources/${filename}`), 'utf8'));

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

const filesToOptionsMap = {
  'webpack.config.js': 'webpack',
  '.sequelizerc': 'sequelize',
  '.env': 'dotenv',
};

const isRequired = (filename) => filename.includes('App.jsx')
    || filename.includes('index.jsx')
    || filename.includes('Layout.jsx')
    || filename.includes('indexRouter.js')
    || filename.includes('apiRouter.js')
    || filename.includes('jsxRender.js')
    || filename.includes('server.js')
    || filename.includes('.babelrc');

const makeFiles = async (options) => {
  const filesList = (await getFiles(path.resolve(__dirname, './resources')))
    .filter((filename) => isRequired(filename) || options.includes(filesToOptionsMap[filename]));
  for (let i = 0; i < filesList.length; i += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await createFile(filesList[i]);
      console.log(`+++ Created file ${filesList[i]}`);
    } catch (error) {
      console.log(`--- Failed to create file ${filesList[i]}`);
    }
  }
};

const applyOptions = async (options) => {
  // **********************************************************************
  // **********************************************************************
  // **********************************************************************
  //  APPLYING OPTIONS TO server.js

  if (!options.includes('morgan')) {

  }

  // **********************************************************************
  // **********************************************************************
  // **********************************************************************
  //  APPLYING OPTIONS TO Layout.jsx
  if (!options.includes('routing')) {
    const newLayout = (await fs.readFile('src/components/Layout.jsx', 'utf-8'))
      .replace(
        '          <StaticRouter location={initState.path}>\n'
      + '            <App {...initState} />\n'
      + '          </StaticRouter>',
        '          <App {...initState} />\n',
      )
      .replace("import { StaticRouter } from 'react-router-dom/server';\n", '');
    await fs.writeFile('src/components/Layout.jsx', newLayout, 'utf-8');
  }

  if (!options.includes('webpack')) {
    const newLayout = (await fs.readFile('src/components/Layout.jsx', 'utf-8'))
      .replace('        <script\n'
      + '          type="text/javascript"\n'
      + '          dangerouslySetInnerHTML={{\n'
      // eslint-disable-next-line no-template-curly-in-string
      + '            __html: `window.initState=${JSON.stringify(initState)}`,\n'
      + '          }}\n'
      + '        />\n'
      + '        <script defer src="/app.js" />\n'
      + '        <script defer src="/vendor.js" />\n', '');
    await fs.writeFile('src/components/Layout.jsx', newLayout, 'utf-8');
  }

  // **********************************************************************
  // **********************************************************************
  // **********************************************************************
  //  APPLYING OPTIONS TO .babelrc

  if (!options.includes('webpack')) {
    const newBabelrc = (await fs.readFile('.babelrc', 'utf-8'))
      .replace('"plugins": ["@babel/plugin-proposal-class-properties"]\n', '');
    await fs.writeFile('.babelrc', newBabelrc, 'utf-8');
  }

  // **********************************************************************
  // **********************************************************************
  // **********************************************************************
  //  APPLYING OPTIONS TO index.jsx
  if (options.includes('webpack') && !options.includes('routing')) {
    const newHydration = (await fs.readFile('src/components/index.jsx', 'utf-8'))
      .replace(
        '  <BrowserRouter>\n'
      + '    <App {...window.initState} />\n'
      + '  </BrowserRouter>',
        '  <App {...window.initState} />',
      )
      .replace("import { BrowserRouter } from 'react-router-dom';\n", '');
    await fs.writeFile('src/components/index.jsx', newHydration, 'utf-8');
  }
};

module.exports = { makeDirs, makeFiles, applyOptions };
