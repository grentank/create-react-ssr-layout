#! /usr/bin/env node
const {
  makeDirs, scriptToPackageJson, makeFiles, instructions, flagParser,
} = require('./utils');

(async function run() {
  try {
    console.log('Checking package.json...');
    try {
      await scriptToPackageJson();
    } catch (error) {
      console.log(error);
      console.log(`\n${'#'.repeat(50)}\n${'#'.repeat(50)}`);
      console.log('Error reading package.json. Use npm init first.\nThen execute npx create-react-ssr-layout again');
      return;
    }
    console.log('\nCreating directories...');
    await makeDirs();
    console.log('All dirs have been created.\n\nCreating files...');
    await makeFiles();
    console.log('All files have been created\n');
    if (process.argv[2]) {
      try {
        await flagParser();
      } catch (installError) {
        console.log('\nFailed to install dependencies. Try to do it manually or run: npm run deps\n');
      }
    }
    console.log(`Finished!\n\n${'#'.repeat(50)}\n${'#'.repeat(50)}\n`);
    console.table(instructions);
    console.log('Happy hacking!');
  } catch (e) {
    console.log(e);
    console.log(`\n${'#'.repeat(50)}\n${'#'.repeat(50)}`);
    console.log('Failed to execute.');
  }
}());
