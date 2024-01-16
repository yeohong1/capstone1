const express = require('express');
const router = express.Router();
const db = require('./../db');
//var index = require('./index');//추가

//register
router.get('/register', function (req, res, next) {
    res.render('register');
});


// register 프로세스
router.post('/register_process', async (req, res, next) => {
    try {
        const userId = req.body.userId;
        const userNm = req.body.userNm;
        const password = req.body.password;
        const password2 = req.body.pwd2;

        if (userId != null && password != null && password2 != null) {
            const existingUser = await db.selectTable('commUser', { userId });

            if (existingUser && existingUser.length > 0) {
                // 이미 존재하는 회원 아이디
                res.send(`<script type="text/javascript">alert("이미 존재하는 회원아이디"); document.location.href="/auth/register";</script>`);
            } else if (password === password2) {
                await db.insertTable('commUser', { userId, password, userNm });
                res.send(`<script type="text/javascript">alert("회원가입이 완료되었습니다."); document.location.href="/auth/login";</script>`);
            } else {
                // 입력된 비밀번호가 서로 다름
                res.send(`<script type="text/javascript">alert("입력된 비밀번호가 서로 다릅니다."); document.location.href="/auth/register";</script>`);
            }
        } else {
            // 잘못된 접근
            console.log("잘못된 접근입니다.");
            res.send(`<script type="text/javascript">alert("잘못된 접근입니다."); document.location.href="/auth/register";</script>`);
        }
    } catch (error) {
        console.error(error);
        res.send(`<script type="text/javascript">alert("오류가 발생했습니다."); document.location.href="/auth/register";</script>`);
    }
});


//login
router.get('/login', function (req, res) {
    console.log("login evnet!)");
    res.render('login');
    // res.send('login');//수정 render->send
});

//login 프로세스
router.post('/login_process', async function (req, res) {
    try {
        const userId = req.body.userId;
        const password = req.body.password;
      
        if (userId != null && password != null) {
            const results = await db.login('commUser', { userId, password });

            console.log(results);

            if (results && results.length > 0) {
                req.session.is_logined = true;
                req.session.nickname = userId;
                req.session.save(function () {
                    res.redirect('/mypage/record');
                });
            } else {
                res.send(`<script type="text/javascript">alert("로그인 정보가 일치하지 않습니다."); document.location.href="/auth/login";</script>`);
            }
        } else {
            res.send(`<script type="text/javascript">alert("아이디와 비밀번호를 입력하세요"); document.location.href="/auth/login";</script>`);
        }
    } catch (error) {
        console.error(error);
        res.send(`<script type="text/javascript">alert("로그인 중 오류가 발생했습니다."); document.location.href="/auth/login";</script>`);
    }
});



//로그아웃
router.get('/mypage/logout', function (req, res) {
    console.log("TEST!");
    if (req.session == null) { 
        res.send(`<script type="text/javascript">alert("로그인 정보가 없습니다."); 
                                        document.location.href="/main";</script>`);
            
    } else { 
        req.session.destroy(function (err) {//세션 삭제
            console.log("callback event");
            res.send(`<script type="text/javascript">alert("성공적으로 로그아웃 하였습니다."); 
                document.location.href="/main";</script>`);   
        });
    }
});

module.exports = router;