const path = require('path');
const fs = require('fs');

const templateDir = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');


const createPage = async () => {

  // html

  const readTemplate = new Promise((resolve, reject) => {
    const stream = fs.createReadStream(templateDir, 'utf-8');
    let data = '';
    stream.on('data', chunk => data += chunk);
    stream.on('end', () => resolve(data));
    stream.on('error', error => reject(error));
  })

  const findComponentsNames = new Promise((resolve, reject) => {
    fs.readdir(componentsDir, {withFileTypes: true}, (err, data) => {
      if (err) reject(err);
      const arr = [];
      data.forEach( file => {
        const fileDir = path.join(componentsDir, file.name);
        
        if (file.isFile() && path.extname(fileDir) === '.html') {
          arr.push(file.name.split('.')[0]);
        }
      });
      resolve(arr);
    })
  })
  
  let template = await readTemplate;
  const componentsNames = await findComponentsNames;
  
  const fillContent = new Promise((resolve, reject) => {
    const arr = [];

    for (let i = 0; i < componentsNames.length; i++) {
      const componentDir = path.join(__dirname, 'components', `${componentsNames[i]}.html`);
      const stream = fs.createReadStream(componentDir, 'utf-8');
      let data = '';
      stream.on('data', chunk => data += chunk);
      stream.on('end', () => {
        arr.push(data);
        if (arr.length === componentsNames.length) {
          resolve(arr);
        }
      });
      stream.on('error', error => reject(error));
    }
  })

  const contentArr = await fillContent;
  
  for (let i = 0; i < contentArr.length; i++) {
    template = template.replace(`{{${componentsNames[i]}}}`, contentArr[i]);
  }
  
  const createProjectDist = new Promise((resolve, reject) => {
    fs.mkdir(path.join(__dirname, 'project-dist'), {recursive: true}, (err) => {
      if (err) reject(err);
      resolve();
    });
  })

  await createProjectDist;
  
  // styles

  const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
  output.write(template);

  const stylesDir = path.join(__dirname, 'styles');
  const stylesArr = [];
  let amountOfFiles = 0;
  const destination = path.join(__dirname, 'project-dist', 'style.css');


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

  const clearFolder = new Promise((resolve, reject) => {
    fs.rm(path.join(__dirname, 'project-dist', 'assets'), {recursive: true, force: true}, () => {
      resolve();
    })
  })
  
  await clearFolder;

  fs.mkdir(path.join(__dirname, 'project-dist', 'assets'), {recursive: true}, (err) => {
    if (err) console.log(err);
  });

  const createDir = (subDirectory) => {
  
  const dir = path.join(__dirname, subDirectory);

  fs.readdir(dir, {withFileTypes: true}, (err, data) => {
    if (err) console.log(err);

    for (let i = 0; i < data.length; i++) {
      if (data[i].isDirectory()) {
        const newDir = path.join(subDirectory, data[i].name);
        fs.mkdir(path.join(__dirname, 'project-dist', newDir), {recursive: true}, (err) => {
          if (err) console.log(err);
        });
        createDir(newDir);
      } else {
        fs.copyFile(
          path.join(__dirname, subDirectory, data[i].name),
          path.join(__dirname, 'project-dist', subDirectory, data[i].name),
          (err) => {
            if (err) console.log(err);
          }
          )
      }
    }
  })
  }
  createDir('assets');
}

createPage();

