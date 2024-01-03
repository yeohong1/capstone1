const express = require('express');
const router = express.Router();
const db = require('./../db');
//var index = require('./index');//추가

//register
router.get('/register', function (req, res, next) {
    res.render('register');
});


//register 프로세스  
router.post('/register_process', (req, res, next) => {//next추가
    var username = req.body.username;
    var password = req.body.pwd;
    var password2 = req.body.pwd2;
    console.log(username);
    console.log(password);
    console.log(password2);
    if (username != null && password != null && password2 != null) {
        console.log(username);
        console.log(db.get_connection())
        
        db.get_connection().query('SELECT * FROM users WHERE username=?', [username], function (error, results, fields) {// 쿼리 중에 오류가 발생하면 error가 된다.
            // result에는 쿼리 결과가 포함된다.
            // field에는 반환된 result(있는 경우)에 대한 정보가 포함된다.
            if (error) throw error;
            console.log("bbb");
            if (results.length <= 0 && password == password2) {//DB에 같은 이름의 회원아이디가 없고, 비번 맞는 경우
                db.get_connection().query('INSERT INTO users (username, password) VALUES(?,?)', [username, password], function (error, data) {
                    if (error) throw error2;
                    res.send(`<script type="text/jascript">alert("회원가입이 완료되었습니다.");
                                            document.location.href="/";</script>`);
                });
            } else if (password != password2) {
                res.send(`<script type= "text/javascript">alert("입력된 비밀번호가 서로 다릅니다.");
                                        document.location.href="/auth/register"</script>`);
            }
            else {
                res.send(`<script type = "type/javascript">alert("이미 존재하는 회원아이디");
                                        document.location.href="/auth/register"</script>`);
            }
        });
        console.log("ok");
    }else { 
        console.log("333");
        res.send(`<script type = "type/javascript">alert("잘못된 접근입니다.");
            document.location.href="/auth/regsiter"</script>`);
    }
});


//login
router.get('/login', function (req, res) {
    console.log("login evnet!)");
    res.render('login');
    // res.send('login');//수정 render->send
});

//login 프로세스
router.post('/login_process', function (req, res) {
    var username = req.body.username; //view에서 ID,ㅣ비번 불러옴
    var password = req.body.pwd;
    if (username != null && password != null ) { //입력확인
        console.log(username);
        console.log(password);
        db.get_connection().query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
            console.log(error);
            console.log(results);
            console.log(fields);

            if (error) throw error;
            if (results.length > 0) {
                req.session.is_logined = true;//세션 정보 갱신
                req.session.nickname = username;
                req.session.save(function () {
                    res.redirect('/');// 확인필요
                });

            } else {
                res.send(`<script type="text/javascript">alert("로그인 정보가 일치하지 않습니다."); 
                                        document.location.href="/auth/login";</script>`);//문자 url    
            }
        });
    } else {
        res.send(`<script type="text/javascript">alert("아이디와 비밀번호를 입력하세요");
                                document.location.href="/auth/login";</script>`);
    }

});

//로그아웃
router.get('/logout', function (req, res) {
    console.log("TEST!");
    if (req.session == null) { 
        res.send(`<script type="text/javascript">alert("로그인 정보가 없습니다."); 
                                        document.location.href="/index";</script>`);//문자 url    
            
    } else { 
        req.session.destroy(function (err) {//세션 삭제
            console.log("callback event");
            res.send(`<script type="text/javascript">alert("성공적으로 로그아웃 하였습니다."); 
                document.location.href="/index";</script>`);//문자 url    
        });
    }
});



module.exports = router;
