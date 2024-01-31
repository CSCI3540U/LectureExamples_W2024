const express = require('express');
const app = express();
const port = 9000;
const fs = require('fs');

app.use(express.static('www'));

app.get('/open_redirect', (request, response) => {
   let uri = request.query['dest'];
   response.redirect(uri);
});

app.get('/lfi', (request, response) => {
   let filename = request.query['page'];
   response.setHeader('Content-Type', 'text/html');
   response.sendFile(__dirname + '/' + filename);// + '.php');
});

app.get('/dir_traversal', (request, response) => {
   let filename = request.query['page'];
   let path = __dirname + '/' + filename;
   fs.readFile(path, (error, data) => {
      if (error) {
         console.error(error);
         return;
      }

      response.send(data);
   });
});

app.listen(port, () => {
   console.log(`Listening on port ${port}.`);
});
