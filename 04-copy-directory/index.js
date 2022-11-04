const fs = require('fs');
const path = require('path');

// const createDir = () => {
//   fs.mkdir(path.join(__dirname, 'files-copy'), {recursive: true}, (err) => {
//     if (err) console.log(err);
//   });
// }

// const clearFolder = () => {
//   fs.readdir( path.join(__dirname, 'files-copy'), (err, data) => {
//     if(err) throw err;
//     data.forEach( item => {
//       fs.unlink(path.join(__dirname, 'files-copy', `${item}`), (err) => {
//         if (err) console.log(err);
//       })
//     })
//   });
// }

// const createFiles = () => {
//   fs.readdir(path.join(__dirname, 'files'), (err, data) => {
//     if(err) throw err;
  
//     data.forEach( (item) => {
//       fs.copyFile(
//         path.join(__dirname, 'files', `${item}`), 
//         path.join(__dirname, 'files-copy', `${item}`), 
//         (err) => {
//           if (err) console.log(err);
//         }
//         )
//     })
//   })
// }

// createDir();
// clearFolder();
// createFiles();
const func = async () => {
  const clearFolder = new Promise((resolve, reject) => {
    fs.rm(path.join(__dirname, 'files-copy'), {recursive: true, force: true}, () => {
      resolve();
    })
  })
  
  await clearFolder;
  
  fs.mkdir(path.join(__dirname, 'files-copy'), {recursive: true}, (err) => {
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
        console.log(path.join(__dirname, subDirectory, data[i].name));
        fs.copyFile(
          path.join(__dirname, subDirectory, data[i].name),
          path.join(__dirname, 'files-copy', data[i].name),
          (err) => {
            if (err) console.log(err);
          }
          )
      }
    }
  })
  }
  createDir('files');
}

func();





