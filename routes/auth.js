const express = require('express');
const router = express.Router();
const db = require('./../db');
const session = require('express-session')


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
            console.log(userId);
            const existingUser = await db.selectTable('commUser',  userId );
            console.log("1",existingUser,"2");
            if (existingUser && existingUser.length > 0) {
                // 이미 존재하는 회원 아이디
                res.send(`<script type="text/javascript">alert("이미 존재하는 회원아이디 입니다."); document.location.href="/auth/register";</script>`);
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
            res.status(400).json({ error: "잘못된 접근입니다." });
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

});

//login 프로세스
router.post('/login_process', async function (req, res) {
    const table = 'commUser';
    const userId = req.body.userId;
    const password = req.body.password;

    try {
        if (!userId || !password) {
            res.send(`<script type="text/javascript">alert("아이디와 비밀번호를 입력하세요"); document.location.href="/auth/login";</script>`);
            return;
        }

        const loginResults = await db.login(table, { userId, password });
        console.log(loginResults);
        if (loginResults && loginResults.length > 0) {
            const userNm = loginResults[0].userNm;
            const userId = loginResults[0].userId;
            const password =  loginResults[0].password;
          
            req.session.userId = userId;
            req.session.userNm = userNm; 
            req.session.password = password;
            req.session.save(() => {
                res.send(`<script type="text/javascript">alert("환영합니다, ${userNm}님!"); document.location.href="/main";</script>`);
            });
        } else {
            res.send(`<script type="text/javascript">alert("로그인 정보가 일치하지 않습니다."); document.location.href="/auth/login";</script>`);
        }
    } catch (error) {
        console.error(error);
        res.send(`<script type="text/javascript">alert("로그인 중 오류가 발생했습니다."); document.location.href="/auth/login";</script>`);
    }
});


//로그아웃
router.get('/logout', function (req, res) {
   console.log("1");
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