const fs = require('fs');
const { version } = require('./package.json')
const folder = './dist/'

fs.readdir(folder, (err, files) => {
  files.forEach(file => {
    const fileNameParts = file.split('.');
    const extension = fileNameParts[fileNameParts.length - 1];

    if (extension == 'map' || extension == 'html') {
      fs.unlinkSync(folder + file)
    } else {
      fs.rename(folder + file, folder + version + '.' + extension, (err) => console.log(err))
    }
  });
});


