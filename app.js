var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
var authRouter = require('./routes/auth');
var mypageRouter = require('./routes/mypage');
var mainRouter = require('./routes/main');
var http = require('http');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static('static'));

app.use(session({
  secret: '12345',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 },
  store: new FileStore(),
}));



// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use((req, res, next) => {
  console.log("app.js: ", req.session);
  res.locals.userId = req.session.userId || "";
  res.locals.userNm = req.session.userNm || "";
  next();
});

// Routes
app.use('/auth', authRouter);
app.use('/mypage', mypageRouter);
app.use('/main', mainRouter);

app.get('/record', (req, res) => {
  res.render('mypageRecord');
});

app.get('/weight', (req, res) => {
  res.render('mypageWeight');
});

app.get('/clalorie', (req, res) => {
  res.render('mypageClalorie');
});

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

var port = normalizePort(process.env.PORT || '3000');
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

module.exports = app;
