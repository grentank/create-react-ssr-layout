const { Select } = require('enquirer');

const quickOrCustom = () => {
  const prompt = new Select({
    name: 'value',
    message: 'Which setup would you like?',
    limit: 7,
    choices: [
      { name: 'Minimum (basic server, no hydration)', value: 'min' },
      { name: 'Maximum (everything included)', value: 'max' },
      { name: 'Custom (pick desired options)', value: 'custom' },
    ],
  });
  return prompt.run();
};

quickOrCustom.then(console.log);
