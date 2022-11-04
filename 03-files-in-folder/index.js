const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'secret-folder');

fs.readdir(dir, {withFileTypes: true}, (err, data) => {
  if(err) throw err;
  data.forEach( item => {
    if (item.isFile()) {
      const file = item.name.split(".");
      fs.stat(path.join(dir, `${item.name}`), (err, stats) => {
        if (err) throw err;
        file.push(`${Math.ceil(stats.size / 1024)}kb`);
        console.log(file.join(' - '));
      });
    }
  });
})



