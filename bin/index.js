#! /usr/bin/env node
const { exec } = require('child_process');
const fs = require('fs/promises');
const path = require('path');
const { data } = require('./files/random');

const createFile = async (filename) => fs.writeFile(filename, await fs.readFile(path.resolve(__dirname, './files/.babelrc'), 'utf8'));

exec('ls -la', (error, stdout, stderr) => {
  if (error) {
    console.log(`error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.log(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}\n${data}`);
  createFile('.babelrc');
});
