const { spawn } = require('child_process');

const asyncSpawn = (cmd, opts) =>
  new Promise((res, rej) => {
    const cmdProcess = spawn(cmd, opts);
    cmdProcess.stdout.on('data', (data) => console.log(`${data}`));

    cmdProcess.stderr.on('data', (data) => console.log(`ERROR: ${data}`));

    cmdProcess.on('error', (error) => rej(error));

    cmdProcess.on('close', (code) => res(code));
  });

module.exports = asyncSpawn;
