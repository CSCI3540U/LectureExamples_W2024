const express = require('express');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser')
const port = 9000;

app.use(express.static('www'));
app.use(express.urlencoded({extended: false}));



app.set('views', __dirname + '/views');
app.set('view engine', 'pug');



app.listen(port, () => {
   console.log(`does robert@abc.com exist? ${userExists("robert@abc.com")}`);
   console.log(`Web server listening on port ${port}`);
});
