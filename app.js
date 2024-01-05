var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session')//추가
const FileStore = require('session-file-store')(session)//추가
var authRouter = require('./routes/auth');//추가//수정
var mypageRouter = require('./routes/mypage');

const bodyParser = require('body-parser');//추가




//추가
// app.use(bodyParser.urlencoded({ extended: false }));//extended: 중첩된 객체표현을 허용할지 말지

var app = express();
app.use(session({
  secret:'12345',
  resave: false,
  saveUninitialized: true,//세션을 수정할 때만 세션을 DB에 저장하고 쿠키를 넘겨줌
  store: new FileStore(),//확인필요 //세션 객체에 세션스토어를 적용
  
}))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRouter);//인증라우터 //추가
app.use('/mypage', mypageRouter);//인증라우터

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(cookieParser());


// 정적 파일 제공을 위한 미들웨어 설정
app.use(express.static(path.join(__dirname, 'public')));

// "/mypage" 경로로 접근하면 "mypage.html" 파일을 제공
app.get('/mypage', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'page', 'mypage.html'));
});

// app.get("/mypage",(req,res)=>{//가상경로로 매칭
//   res.sendFile(__dirname+"/index.html");
// })


// app.get('/',(req,res)=>{
//   if(!authCheck.isOwner(req,res)){  // 로그인 안되어있으면 로그인 페이지로 이동시킴
//     res.redirect('/auth/login');//수정 /auth/login->/login
//     return false;
//   }else{
//     res.redirect('/index');//로그인 되어있는 거: 경로수정
//     return false;
//   }
// });



/*
//메인페이지
app.get('/',(req,res)=>{
  if(!authCheck.isOwner(req,res)){// 로그인 안되어있으면 로그인 페이지로 이동시킴
    res.redirect('/auth/login');
    return false;
  }
  var html = template.HTML('Welcome',
    `<hr>
        <h2>메인 페이지에 오신 것을 환영합니다</h2>
        <p>로그인에 성공하셨습니다.</p>`,
    authCheck.statusUI(req, res)
  );
  res.send(html);
})

*/


//추가

//app.use('/', indexRouter);//수정 / ->/index
//app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;