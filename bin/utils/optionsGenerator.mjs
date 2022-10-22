import inquirer from 'inquirer';

function getMode() {
  return inquirer.prompt([{
    type: 'list',
    name: 'mode',
    message: 'What do you want to do?',
    choices: [
      { name: 'Minimum (basic server, no hydration)', value: 'min' },
      { name: 'Maximum (everything included)', value: 'max' },
      { name: 'Custom (pick desired options)', value: 'custom' },
    ],
  }]);
}

const choices = [
  {
    name: 'Webpack and Hydration',
    value: 'webpack',
  },
  {
    name: 'Body-parser',
    value: 'json',
  },
  {
    name: 'React Routing (StaticRouter + BrowserRouter)',
    value: 'routing',
  },
  {
    name: 'Morgan logger',
    value: 'morgan',
  },
  {
    name: 'Dotenv',
    value: 'dotenv',
  },
  {
    name: 'Sequelize',
    value: 'sequelize',
  },
  {
    name: 'Express sessions + session-store',
    value: 'session',
  },
  {
    name: 'Axios',
    value: 'axios',
  },
  {
    name: 'Bcrypt',
    value: 'bcrypt',
  },
];

function getOptions() {
  return inquirer
    .prompt([
      {
        type: 'checkbox',
        message: 'Select custom options',
        name: 'options',
        pageSize: 9,
        choices,
        validate(answer) {
          if (answer.length < 1) {
            return 'You must choose at least one option.';
          }
          return true;
        },
      },
    ]);
}

async function getChoices() {
  const { mode } = await getMode();
  switch (mode) {
    case 'min':
      console.log('You have picked a minimum server');
      return [];
    case 'max':
      console.log('You have picked a maximum server');
      return choices.map((choice) => choice.value);
    case 'custom':
      console.log('You have picked to customize a server');
      return getOptions();
    default:
      console.log('Uknown option');
      return [];
  }
}

export default getChoices;
