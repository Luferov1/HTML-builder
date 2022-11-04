const path = require('path');
const fs = require('fs');

const stylesDir = path.join(__dirname, 'styles');
const stylesArr = [];
let amountOfFiles = 0;
const destination = path.join(__dirname, 'project-dist', 'bundle.css');


const readStylesDir = async () => {
  const promise = new Promise ( (resolve, reject)  => {
    fs.readdir(stylesDir, {withFileTypes: true}, (err, data) => {
      if (err) reject(err);
      
      fs.truncate(destination, 0, () => {
        return
      });
       data.forEach( (item) => {
        const fileDir = path.join(stylesDir, item.name);
        
        if (item.isFile() && path.extname(fileDir) === '.css') {
          const input = fs.createReadStream(fileDir, 'utf-8');
          amountOfFiles++;

          let data = '';
          input.on('data', chunk => data += chunk);
          input.on('end', () => {
            stylesArr.push(data);
            if (stylesArr.length === amountOfFiles) {
              resolve(stylesArr);
            }
          });
          input.on('error', error => console.log('Error', error.message));
          // input.pipe(output);
        }
      })
    })
  })

  await promise;
  const output = fs.createWriteStream(destination);
  for (let i = 0; i < stylesArr.length; i++) {
    output.write(`${stylesArr[i]}\n`);
  }
}

readStylesDir();

