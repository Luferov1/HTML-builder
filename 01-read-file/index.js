const path = require('path');
const fs = require('fs');
const { error } = require('console');

const dir = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(dir, 'utf-8');

let data = '';
stream.on('data', (chunk) => data += chunk);
stream.on('end', () => console.log(data));
stream.on('error', (error) => console.log(error.message));