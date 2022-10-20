#! /usr/bin/env node
const {
  makeDirs, getFiles, createFile, scriptToPackageJson,
} = require('./utils');

(async function run() {
  try {
    console.log('Creating desired dirs...');
    await makeDirs();
    console.log('All dirs have been created.\nGetting list of files...');
    const filesList = (await getFiles(__dirname))
      .filter((filename) => !filename.includes('index.js') && !filename.includes('utils.js'));
    for (let i = 0; i < filesList.length; i += 1) {
      try {
        await createFile(filesList[i]);
        console.log(`Created file ${filesList[i]}`);
      } catch (error) {
        console.log(`Failed to create file ${filesList[i]}`);
      }
    }
    try {
      console.log('Modifying package.json');
      await scriptToPackageJson();
      console.log('You can install all dependencies with\n\t\tnpm run deps');
    } catch (e) {
      console.log('Failed to modify package.json');
    }
  } catch (e) {
    console.log('Failed to execute');
  }
}());
