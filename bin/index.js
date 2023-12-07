#! /usr/bin/env node
const fs = require('fs').promises;
const { makeDirs, makeFiles, applyOptions } = require('./utils/filesGenerator');
const {
  scriptsToPackageJson,
  checkPackageJson,
  instructions,
} = require('./utils/packageJsonModification');
const getProjectDirectory = require('./utils/projectDirectory');
const asyncSpawn = require('./utils/promisified');

(async function run() {
  try {
    const projDir = getProjectDirectory();
    if (projDir !== '.') await fs.mkdir(projDir); // await asyncSpawn('mkdir', [projDir]);
    console.log('Checking package.json...');
    try {
      await checkPackageJson();
    } catch (error) {
      // console.log(error);
      console.log('Error reading package.json. Initiating "npm init -y"');
      await asyncSpawn('npm', ['init', '-y']).catch(() => {
        console.log('Failed to initiate package.json. Try to do it manually or run: npm init -y');
        process.exit(1);
      });
    }
    // const { default: getChoices } = await import('./utils/optionsGenerator.mjs');
    // const options = await getChoices();

    console.log('\nCreating directories...');
    await makeDirs();
    console.log('\nCreating files...');
    await makeFiles();
    // console.log('All files have been created\n\nApplying options...');
    // await applyOptions(options);
    console.log('\nModifying package.json...');
    await scriptsToPackageJson();
    console.log('\nInstalling dependencies...');

    try {
      await asyncSpawn('npm', ['run', 'deps']);
    } catch (error) {
      console.log('\nFailed to install dependencies. Try to do it manually or run: npm run deps\n');
    }

    console.log(`Finished!\n\n${'#'.repeat(50)}\n${'#'.repeat(50)}\n`);
    console.table(instructions);
    console.log('Happy hacking!');
  } catch (e) {
    console.log(e);
    console.log(`\n${'#'.repeat(50)}\n${'#'.repeat(50)}`);
    console.log('Failed to execute.');
  }
})();
