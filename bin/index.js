#! /usr/bin/env node
const {
  makeDirs, getFiles, createFile, scriptToPackageJson,
} = require('./utils');

(async function run() {
  try {
    try {
      console.log('Creating desired dirs...');
      await makeDirs();
      console.log('All dirs have been created.\nGetting list of files...');
    } catch (dirEr) {
      console.log('Failed to create the desired directories');
    }
    const filesList = (await getFiles(__dirname))
      .filter((filename) => (filename !== 'index.js') && !filename.includes('utils.js'));
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
      console.log('Finished!\n================================\n================================\n');
      console.log('\nYou can install all dependencies with:\tnpm run deps');
    } catch (e) {
      console.log('Failed to modify package.json');
    }
  } catch (e) {
    console.log('Failed to execute');
  }
}());
