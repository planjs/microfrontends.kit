const child_process = require('child_process');

module.exports.spawn = spawn;
module.exports.asyncSpawn = asyncSpawn;

function spawn(command, cwd) {
  const [c, ...args] = command.split(' ');
  const result = child_process.spawnSync(c, args, {
    encoding: 'UTF8',
    env: process.env,
    stdio: 'pipe',
    cwd,
  });

  return result.stdout
    .toString()
    .trim()
    .replace(
      /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
      ''
    );
}

function asyncSpawn(command, cwd) {
  const [cmd, ...args] = command.split(' ');

  return new Promise((result, reject) => {
    const s = spawn(cmd, args, {
      cwd: cwd,
      stdio: 'pipe',
      env: process.env,
    });

    const stdout = [];
    const stderr = [];

    if (s.stdout !== null) {
      s.stdout.on('data', data => {
        stdout.push(data.toString());
      });
    }

    s.on('close', code => {
      result(stdout.join(''));
    });
    s.on('error', e => {
      reject(e);
    });
  });
}
