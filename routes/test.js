var express = require('express');
const fetch = require('node-fetch');
var router = express.Router();

/* GET home page. */
//"http://localhost:3000/test/"   "/"
router.get('/', function(req, res, next) {
  res.render('test', { title: '테스트페이지' });
});

//"http://localhost:3000/test/page/1"   "/page/1"
router.get('/page/:pnum', function(req, res, next){
  // 요청 시 parameter를 읽어 올수 있음
  var pageNumber = req.params.pnum;

  //요청에 대한 내용을 바탕으로 연산을 할 수 있음.
  var result=0;
  for(var i=0; i<=pageNumber; i++){
    result +=i;
  }
  res.render('page1', {pagenumber :pageNumber, result : result});
})

router.get('/btcprice', function(req,res,next){

let url = 'https://api.upbit.com/v1/trades/ticks?market=KRW-BTC&count=1';
let options = {method: 'GET'};

fetch(url, options)
  .then(result=> 
    result.json())
  .then(json => {
    var datetime = json[0].trade_date_utc +" "+ json[0].trade_time_utc

    datetime = Date.parse(datetime)
    //           msec sec min hour
    // KST = UTC+9
    datetime += (1000*60*60*9)
    datetime = new Date(datetime).toLocaleString("ko-KR", {timeZone: "Asia/Seoul"})

    res.render('btcprice',
      {
        price: json[0].trade_price ,
        time:datetime,
      });
  })
  .catch(err => console.error('error:' + err));  
})

router.get('/calculate', function(req,res,next) {
  
  var a= Number(req.query.a);
  var b= Number(req.query.b);
  var op = req.query.op;
  var negative = Boolean(req.query.negative) | false;
  var result=0;
  switch(op){
    case 'add':
      result = a+b;
      break;
    case 'sub':
      result = a-b;
      break;
    case 'mul':
      result = a*b;
      break;
    case 'div':
      result = a/b;
      break;
  }
  if(negative){
    result *=-1;
  }

  res.send({result:result})

})

router.get('/:a/:op/:b/:negative', function(req,res,next) {
  
  var a= Number(req.params.a);
  var b= Number(req.params.b);
  var op = req.params.op;
  var negative = Boolean(req.params.negative) | false;
  var result=0;
  switch(op){
    case 'add':
      result = a+b;
      break;
    case 'sub':
      result = a-b;
      break;
    case 'mul':
      result = a*b;
      break;
    case 'div':
      result = a/b;
      break;
  }
  if(negative){
    result *=-1;
  }
  res.render('calculate', 
                        {result : result,
                          a:a,
                          b:b,
                          op:op});

})

// 다음과 같은 요청을 보내면 수식 연산결과를 보여주는 페이지를 작성
//  "http://localhost:3000/test/{a}/{op}/{b}
//  {a}, {b} 는 숫자
//  {op}은 다음과 같은 문자열
//     - 'add', 'sub' ,'mul', 'div'


//"http://localhost:3000/test/{10}/add/{100}"
module.exports = router;