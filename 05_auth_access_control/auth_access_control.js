const express = require('express');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser')
const port = 9000;

app.use(express.static('www'));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use(session({
   resave: false,
   saveUninitialized: false,
   secret: 'the giraffe with its long neck eats from the tallest trees',
}));

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

// login/session related
// let nextSessionId = 2;

// let sessionData = {
//    '1': {
//       'email': 'admin@abc.com',
//       'role': 'administrator',
//    },
// };

let loginData = {
   'admin@abc.com': 'v05f!j_R',
   'robert@abc.com': 'burt',
   'sandra@abc.com': 'galdalf6',
};

function userExists(toFind) {
   return Object.keys(loginData).includes(toFind);
}

function checkPassword(email, password) {
   return loginData[email] === password;
}

function sleep(duration) {
   return new Promise(resolve => setTimeout(resolve, duration));
}

app.get('/home', (request, response) => {
   // console.log('Cookies: ' + request.cookies);
   // let sessionId = request.cookies['session_id'];
   // let email = sessionData[sessionId]['email'];
   // let role = sessionData[sessionId]['role'];
   let email = request.session.email;
   let role = request.session.role;
   
   if (email) {
      response.send(`Welcome, ${email}! Role: ${role} <a href="/logout">Logout</a>`);
   } else {
      response.redirect('/login');
   }
});

app.get('/login', (request, response) => {
   response.render('login', {
      title: 'Login Page',
      errorMessage: '',
   });
});

app.post('/processLogin', (request, response) => {
   let email = request.body.email;
   let password = request.body.password;

  sleep(500).then(() => {
   if (userExists(email)) {
      if (checkPassword(email, password)) {
         // login success
         // response.cookie('session_id', `${nextSessionId}`);
         // sessionData[nextSessionId] = {
         //    email: email,
         //    role: 'user',
         // };
         // nextSessionId++;
         request.session['email'] = email;
         request.session.role = 'user';

         response.redirect('/home');
      } else {
         // password does not match
         response.render('login', {
            title: 'Login Page',
            errorMessage: 'Login incorrect',
         });
      }
   } else {
      // no such email
      response.render('login', {
         title: 'Login Page',
         errorMessage: 'Login incorrect',
      });
   }
  });
});

app.get('/logout', (request, response) => {
   let sessionId = request.cookies['session_id'];
   delete sessionData[sessionId];
});

app.get('/profile/:email', (request, response) => {
   let session_id = request.cookies['session_id'];
   let email = sessionData[session_id]['email'];
   let provided_email = request.params.email;
   if (provided_email === email) {
      response.send(`Ciao ${email}!  Your password is ${loginData[email]}`);
   } else {
      response.status(404).send('Invalid E-Mail address');
   }
});

app.get('/order_status', (request, response) => {
   let orderId = request.query.orderId;
   response.send(`Viewing order ${orderId}`);
});

app.listen(port, () => {
   console.log(`does robert@abc.com exist? ${userExists("robert@abc.com")}`);
   console.log(`Web server listening on port ${port}`);
});
