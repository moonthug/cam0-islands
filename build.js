const fs = require('fs');


fs.readdir('./src', (err, files) => {
  if(err) throw err;

  files.forEach(file => {
    const pattern = require('./src/' + file);
    
    pattern()
      .then(count => {
        console.log(` --- ${file} created ${count} islands`);
      })
      .catch(err => {
        console.err(` --- ${file} had an error: ${err}`);
      })
  });
});