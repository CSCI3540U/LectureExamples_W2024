const express = require('express');
const app = express();
const port = 9000;
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { exec } = require("child_process");

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
      let file = files.uploaded_image[0];
      let temp_file_path = file.filepath;
      let original_filename = file.originalFilename;
      let desired_file_path = path.join(__dirname, original_filename);
      console.log(`new filename: ${desired_file_path}`);
      if (desired_file_path.endsWith('.jpg') || desired_file_path.endsWith('.jpeg')) {
         exec(`file ${temp_file_path}`, (error, output) => {
            if (error) {
               response.send('Error checking file type: ' + error);
            }

            if (output.includes('JPEG')) {
               fs.copyFile(temp_file_path, desired_file_path, fs.constants.COPYFILE_EXCL, (error) => {
                  if (error) {
                     response.send('Error copying file: ' + error);
                  } else {
                     response.write(`File uploaded to ${temp_file_path}`);
                     response.write(`File copied to ${desired_file_path}`);
                     response.end();
                  }
               });
            } else {
               response.send('Invalid file contents');
            }
         });
      } else {
          response.send('Invalid file extension');
      }
   });
});

app.listen(port, () => {
   console.log(`Listening on port ${port}.`);
});
