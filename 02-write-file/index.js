const { stdin, exit } = process;
const path = require('path');
const fs = require('fs');
const os = require('os');

const dir = path.join(__dirname, 'text.txt');
const username = os.userInfo().username;
const output = fs.createWriteStream(dir);
console.log(`Hello, ${username}, please, write something`)

stdin.on('data', (data) => {
  const str = data.toString().trim();

  if (str === 'exit') {
    exit();
  }
  output.write(data);
});

process.on('exit', () => console.log(`Bye, ${username}`));
process.on('SIGINT', () => exit());