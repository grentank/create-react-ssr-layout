#! /usr/bin/env node
const {
  makeDirs, scriptToPackageJson, makeFiles, instructions,
} = require('./utils');

(async function run() {
  try {
    console.log('Checking package.json...');
    try {
      await scriptToPackageJson();
    } catch (error) {
      console.log(error);
      console.log(`\n${'#'.repeat(20)}`);
      console.log('Error reading package.json. Use npm init first.\nThen execute npx create-react-ssr-layout again');
      return;
    }
    console.log('\nCreating directories...');
    await makeDirs();
    console.log('All dirs have been created.\n\nCreating files...');
    await makeFiles();
    console.log(`Finished!\n${'#'.repeat(20)}\n${'#'.repeat(20)}\n`);
    console.table(instructions);
  } catch (e) {
    console.log(e);
    console.log(`\n${'#'.repeat(20)}`);
    console.log('Failed to execute.');
  }
}());
