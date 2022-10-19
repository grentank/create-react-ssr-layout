#! /usr/bin/env node
import inquirer from 'inquirer';

function createFiles() {

}

inquirer
  .prompt([
    {
      type: 'list',
      name: 'full',
      message: 'Do you want the full version?',
      choices: [
        {
          key: 'y',
          value: true,
          name: 'Yes, I want SSR with custom express render, res.locals, sessions and so on.',
        },
        {
          key: 'n',
          value: false,
          name: 'No, lets customize the SSR',
        },
      ],
    },
  ])
  .then(({ full }) => {
    if (full) {
      console.log('Creating full SSR');
      createFiles();
    } else {
      inquirer
        .prompt([
          {
            type: 'checkbox',
            message: 'Select SSR options',
            name: 'options',
            choices: [
              new inquirer.Separator(' = React customization = '),
              {
                name: 'create Layout.jsx',
                value: 'layout',
              },
              {
                name: 'Router (Static + Browser)',
                value: 'router',
              },
              new inquirer.Separator(' = Builders = '),
              {
                name: 'create .babelrc',
                value: 'babel',
              },
              {
                name: 'create webpack.config.js + set hydration',
                value: 'webpack',
              },
              new inquirer.Separator(' = Server ='),
              {
                name: 'morgan',
              },
              {
                name: 'body parsers',
                value: 'body',
              },
              {
                name: 'configure static dir',
                value: 'static',
              },
              {
                name: 'configure jsx render',
                value: 'jsxrender',
              },
              {
                name: 'add path to res.locals',
                value: 'locals',
              },
              new inquirer.Separator(' = The extras = '),
              {
                name: 'create .sequelizerc + init',
                value: 'sequelize',
              },
              {
                name: 'dotenv',
              },
              {
                name: 'sessions + storage + config',
                value: 'sessions',
              },
            ],
            validate(answer) {
              if (answer.length < 1) {
                return 'You must choose at least one option.';
              }

              return true;
            },
          },
        ])
        .then((answers) => {
          console.log(answers);
        });
    }
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });
