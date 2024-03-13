const express = require('express');
const app = express();
const port = 9000;

const session = require('express-session');
const cookieParser = require('cookie-parser')

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./sqli.db');

let nextSessionId = 1;
let sessionData = { };

// middleware
app.use(express.static('www'));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
   resave: false,
   saveUninitialized: false,
   secret: 'the giraffe with its long neck is able to reach the highest branches'
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

// setup the database
db.serialize(function() {
    db.run(`create table if not exists Login(
        email text primary key not null,
        password text not null
    )`);
    db.run('delete from Login');
    db.run(`insert into Login(email, password) values(?, ?)`, ['bsmith@abc.com', 'bobby']);
    db.run(`insert into Login(email, password) values(?, ?)`, ['akhan@abc.com', 'ahmed']);
    db.run(`insert into Login(email, password) values(?, ?)`, ['admin@abc.com', 'secret123']);
    db.each('select * from Login', (error,row) => {
        console.log(`   ${row['email']},${row['password']}`);
    });
    db.run(`create table if not exists Roles(
        email text primary key not null,
        role text not null
    )`);
    db.run('delete from Roles');
    db.run(`insert into Roles(email, role) values(?, ?)`, ['bsmith@abc.com', 'user']);
    db.run(`insert into Roles(email, role) values(?, ?)`, ['akhan@abc.com', 'user']);
    db.run(`insert into Roles(email, role) values(?, ?)`, ['admin@abc.com', 'admin']);
});

app.get('/home', (request, response) => {
    let sessionId = request.cookies['session_id'];
    let email = sessionData[sessionId]['email'];
    let role = sessionData[sessionId]['role'];
    if (email) {
       response.send(`Welcome, ${email}.<br /><a href="/logout">Logout</a>`);
    } else {
       response.redirect('/login');
    }
 });

app.get('/login', function(request, response) {
    response.render('login', {
       title: 'Login Page',
       errorMessage: ''
    });
 });
 

 app.post('/processLogin', function(request, response) {
    let email = request.body.email;
    let password = request.body.password;

    console.log(`QUERY:  select email from Login where email = '${email}' and password = '${password}'`);

    // db.all(`select email from Login where email = ? and password = ?`, [email, password], (error, rows) => {
    db.all(`select email from Login where email = '${email}' and password = '${password}'`, (error, rows) => {
            if (error || rows.length == 0) {
            console.log(`FAILED: Result of query: ${rows}, error: ${error}`);

            // invalid login
            response.render('login', {
                title: 'Login Page',
                errorMessage: error
            });
        } else {
            let loginEmail = rows[0]['email'];

            // email and password are a match
            response.cookie('session_id', `${nextSessionId}`);
            sessionData[nextSessionId] = {email: loginEmail};
            nextSessionId++;

            response.redirect('/home');
        }
    });
 });

 app.get('/logout', (request, response) => {
    request.session.email = '';

    response.redirect('/login');
 });

 app.listen(port, () => {
    console.log(`Web server listening on port ${port}`);
 });
