const fs = require('fs/promises');
const path = require('path');

const createFile = async (filename) =>
  fs.writeFile(
    filename,
    await fs.readFile(path.resolve(__dirname, 'resources', filename), 'utf8'),
    'utf8',
  );

const getFiles = async (dir) => {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    }),
  );
  return files
    .flat()
    .map((pathname) => pathname.replace(path.resolve(__dirname, '..', 'resources'), '').slice(0, -1));
};

const makeDirs = async () => {
  const dirs = ['src/components', 'src/routes', 'src/utils', 'src/middlewares', 'src/config'];
  try {
    await fs.mkdir('src');
    console.log(`+++ Created directory src`);
    await Promise.all(dirs.map((dir) => fs.mkdir(dir)));
    await fs.mkdir('src/components/pages');
    console.log(`+++ Created directories ${[...dirs, 'src/components/pages'].join(', ')}`);
  } catch (e) {
    console.log(`--- Failed to create directories ${dirs.join(', ')}`);
  }
};

const filesToOptionsMap = {
  'webpack.config.js': 'webpack',
  '.sequelizerc': 'sequelize',
  '.env': 'dotenv',
  'src/components/index.jsx': 'webpack',
  'prettierrc.txt': 'prettier',
};

const requiredFiles = [
  'App.jsx',
  'Layout.jsx',
  'indexRouter.js',
  'apiRouter.js',
  'jsxRender.js',
  'server.js',
  '.babelrc',
  'eslintrc.txt',
  'gitignore.txt',
];

const isRequired = (filename) =>
  requiredFiles.some((requiredFile) => filename.includes(requiredFile));

const makeFiles = async (options) => {
  const filesList = await getFiles(path.resolve(__dirname, '..', 'resources')); /* .filter(
    (filename) => isRequired(filename) || options.includes(filesToOptionsMap[filename]),
  ); */

  // if (options.includes('routing') || options.includes('session')) {
  //   filesList.push('src/middlewares/resLocals.js');
  // }

  for (let i = 0; i < filesList.length; i += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await createFile(filesList[i]);
      console.log(`+++ Created file ${filesList[i]}`);
    } catch (error) {
      console.log(`--- Failed to create file ${filesList[i]}`);
      console.log(error);
    }
  }
  await fs.rename('gitignore.txt', '.gitignore');
  await fs.rename('eslintrc.txt', '.eslintrc.js');
  await fs.rename('prettierrc.txt', '.prettierrc');
};

const applyOptions = async (options) => {
  // **********************************************************************
  // **********************************************************************
  // **********************************************************************
  //  APPLYING OPTIONS TO server.js

  try {
    let serverFile = await fs.readFile('src/server.js', 'utf-8');

    if (!options.includes('morgan')) {
      serverFile = serverFile
        .replace("import morgan from 'morgan';\n", '')
        .replace("app.use(morgan('dev'));\n", '');
    }

    if (!options.includes('json')) {
      serverFile = serverFile.replace(
        'app.use(express.urlencoded({ extended: true }));\n' + 'app.use(express.json());\n',
        '',
      );
    }

    if (!options.includes('webpack')) {
      serverFile = serverFile.replace("app.use(express.static('public'));\n", '');
    }

    if (!options.includes('routing')) {
      serverFile = serverFile.replace(
        '\napp.use((req, res, next) => {\n' +
          '  res.locals.path = req.originalUrl;\n' +
          '  next();\n' +
          '});\n',
        '',
      );
    }

    if (!options.includes('routing') && !options.includes('session')) {
      serverFile = serverFile.replace('app.use(resLocals);\n', '');
    }

    if (!options.includes('session')) {
      serverFile = serverFile
        .replace(
          "import session from 'express-session';\n" + "import store from 'session-file-store';\n",
          '',
        )
        .replace('const FileStore = store(session);\n', '')
        .replace(
          '\nconst sessionConfig = {\n' +
            "  name: 'user_sid',\n" +
            "  secret: process.env.SESSION_SECRET ?? 'test',\n" +
            '  resave: true,\n' +
            '  store: new FileStore(),\n' +
            '  saveUninitialized: false,\n' +
            '  cookie: {\n' +
            '    maxAge: 1000 * 60 * 60 * 12,\n' +
            '    httpOnly: true,\n' +
            '  },\n' +
            '};\n',
          '',
        )
        .replace('app.use(session(sessionConfig));\n', '');
    }

    if (!options.includes('dotenv')) {
      serverFile = serverFile
        .replace('process.env.SERVER_PORT || ', '')
        .replace('process.env.SESSION_SECRET ?? ', '')
        .replace("\nrequire('dotenv').config();\n", '');
    }

    await fs.writeFile('src/server.js', serverFile, 'utf-8');
  } catch (error) {
    console.log('Something went wrong with the server', error);
  }

  // **********************************************************************
  // **********************************************************************
  // **********************************************************************
  //  APPLYING OPTIONS TO Layout.jsx
  if (!options.includes('routing')) {
    const newLayout = (await fs.readFile('src/components/Layout.jsx', 'utf-8'))
      .replace(
        '          <StaticRouter location={initState.path}>\n' +
          '            <App {...initState} />\n' +
          '          </StaticRouter>',
        '          <App {...initState} />',
      )
      .replace("import { StaticRouter } from 'react-router-dom/server';\n", '');
    await fs.writeFile('src/components/Layout.jsx', newLayout, 'utf-8');
  }

  if (!options.includes('webpack')) {
    const newLayout = (await fs.readFile('src/components/Layout.jsx', 'utf-8')).replace(
      '        <script\n' +
        '          type="text/javascript"\n' +
        '          dangerouslySetInnerHTML={{\n' +
        // eslint-disable-next-line no-template-curly-in-string
        '            __html: `window.initState=${JSON.stringify(initState)}`,\n' +
        '          }}\n' +
        '        />\n' +
        '        <script defer src="/app.js" />\n' +
        '        <script defer src="/vendor.js" />\n',
      '',
    );
    await fs.writeFile('src/components/Layout.jsx', newLayout, 'utf-8');
  }

  // **********************************************************************
  // **********************************************************************
  // **********************************************************************
  //  APPLYING OPTIONS TO index.jsx
  if (options.includes('webpack') && !options.includes('routing')) {
    const newHydration = (await fs.readFile('src/components/index.jsx', 'utf-8'))
      .replace(
        '  <BrowserRouter>\n' + '    <App {...window.initState} />\n' + '  </BrowserRouter>',
        '  <App {...window.initState} />',
      )
      .replace("import { BrowserRouter } from 'react-router-dom';\n", '');
    await fs.writeFile('src/components/index.jsx', newHydration, 'utf-8');
  }

  // **********************************************************************
  // **********************************************************************
  // **********************************************************************
  //  APPLYING OPTIONS TO eslintrc.js
  if (!options.includes('prettier')) {
    const newEslintrc = (await fs.readFile('.eslintrc.js', 'utf-8')).replace(
      "\n    'prettier',",
      '',
    );
    await fs.writeFile('.eslintrc.js', newEslintrc, 'utf-8');
  }

  // **********************************************************************
  // **********************************************************************
  // **********************************************************************
  //  APPLYING OPTIONS TO resLocals.js
  if (!options.includes('routing') && options.includes('session')) {
    const newResLocalsMWT = (await fs.readFile('src/middlewares/resLocals.js', 'utf-8')).replace(
      '\n  res.locals.path = req.originalUrl;',
      '',
    );
    await fs.writeFile('src/middlewares/resLocals.js', newResLocalsMWT, 'utf-8');
  }

  if (options.includes('routing') && !options.includes('session')) {
    const newResLocalsMWT = (await fs.readFile('src/middlewares/resLocals.js', 'utf-8')).replace(
      '\n  res.locals.user = req.session?.user;',
      '',
    );
    await fs.writeFile('src/middlewares/resLocals.js', newResLocalsMWT, 'utf-8');
  }
};

module.exports = { makeDirs, makeFiles, applyOptions };
