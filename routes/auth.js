const express = require('express');
const router = express.Router();
const db = require('./../db');
const session = require('express-session')

// 회원가입, 로그인, 로그아웃 응답 메시지 함수
function sendAlertAndRedirect(res, message, redirectUrl) {
    res.send(`<script type="text/javascript">alert("${message}"); document.location.href="${redirectUrl}";</script>`);
}

// register 프로세스
router.post('/register_process', async (req, res, next) => {
    try {
        const userId = req.body.userId;
        const userNm = req.body.userNm;
        const password = req.body.password;
        const password2 = req.body.pwd2;

        if (!userId || !password || !password2) {
            console.log("잘못된 접근입니다.");
            return res.status(400).json({ error: "잘못된 접근입니다." });
        }
       
            const existingUser = await db.selectTable('commUser', userId);
            if (password === password2) {
                await db.insertTable('commUser', { userId, password, userNm });
                sendAlertAndRedirect(res, "회원가입이 완료되었습니다.", "/auth/login");
            } else {
                sendAlertAndRedirect(res, "입력된 비밀번호가 서로 다릅니다.", "/auth/register");
            }
        } catch (error) {
            console.error(error);
            sendAlertAndRedirect(res, "오류가 발생했습니다.", "/auth/register");
        }
    });




//login 프로세스
router.post('/login_process', async function (req, res) {
    const table = 'commUser';
    const userId = req.body.userId;
    const password = req.body.password;

    try {
        if (!userId || !password) {
            return sendAlertAndRedirect(res, "아이디와 비밀번호를 입력하세요", "/auth/login");
        }

        const loginResults = await db.login(table, { userId, password });
       
        if (loginResults && loginResults.length > 0) {
            const userNm = loginResults[0].userNm;
            const userId = loginResults[0].userId;
            const password =  loginResults[0].password;
                
            req.session.userId = userId;
            req.session.userNm = userNm; 
            req.session.password = password;
            req.session.save(() => {
                sendAlertAndRedirect(res, `환영합니다, ${userNm}님!`, "/main");
            });
        } else {
            sendAlertAndRedirect(res, "로그인 정보가 일치하지 않습니다.", "/auth/login");
        }
    } catch (error) {
        console.error(error);
        sendAlertAndRedirect(res, "로그인 중 오류가 발생했습니다.", "/auth/login");
    }
});


// 로그아웃 처리
router.get('/logout', (req, res) => {
    if (!req.session) {
        return sendAlertAndRedirect(res, "로그인 정보가 없습니다.", "/main");
    }

    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return sendAlertAndRedirect(res, "로그아웃 중 오류가 발생했습니다.", "/main");
        }
        sendAlertAndRedirect(res, "성공적으로 로그아웃 하였습니다.", "/main");
    });
});


//login
router.get('/login', function (req, res) {
    console.log("login evnet!)");
    res.render('login');

});

//register
router.get('/register', function (req, res, next) {
    res.render('register');
});

module.exports = router;