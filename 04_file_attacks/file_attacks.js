const express = require('express');
const app = express();
const port = 9000;
const fs = require('fs');
const axios = require('axios');

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

const base_dir = '/home/kali/LectureExamples_W2024/04_file_attacks/www';
app.get('/dir_traversal', (request, response) => {
   let filename = request.query['page'];
   let path = __dirname + '/' + filename;
   fs.realpath(path, (error, resolved_path) => {
      if (error) {
         console.error(error);
         return;
      } else {
         if (resolved_path.startsWith(base_dir)) {
            fs.readFile(path, (error, data) => {
               if (error) {
                  console.error(error);
                  return;
               }

               response.send(data);
            });
         } else {
            console.error(`Invalid path: ${resolved_path}`);
         }
      }
   });
});

app.get('/rfi', async (request, response) => {
   let url = request.query['url'];
   try {
      let pageResponse = await axios.get(url);
      response.send(pageResponse.data);
   } catch (error) {
      response.status(500).send(`Error: ${error.message}`);
   }
});

app.post('/file_upload', (request, response) => {
   const formidable = require('formidable');
   let form = new formidable.IncomingForm();
   form.parse(request, (error, fields, files) => {
      // to be continued
   });
});

app.listen(port, () => {
   console.log(`Listening on port ${port}.`);
});
