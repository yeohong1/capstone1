const express = require('express');
var request = require('request');

// 인증키, 서비스명, 요청 파일 타입, 요청 시작 위치, 요청 종료 위치, 변수 및 값 설정
const apiKey = 'e171d9fac4cc4db0ae29';
const serviceName = '12790';
const requestFileType = 'json';
const requestStartPoint = 0;
const requestEndPoint = 2;
const foodname = req.body.foodname;

// API 요청 URL 생성
const apiUrl = `http://openapi.foodsafetykorea.go.kr/api/${apiKey}/${serviceName}/${requestFileType}/${requestStartPoint}/${requestEndPoint}/DESC_KOR=${foodname}`;

// HTTP GET 요청 보내기
router.get('/misae', function(req, res, next){
  request(apiUrl, function(error, response, body){
    if(error){
      console.log(error)
    }
    var obj = JSON.parse(body)
    console.log(obj) // 콘솔창에 찍어보기
  })
})