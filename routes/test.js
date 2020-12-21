var express = require('express');
const fetch = require('node-fetch');
var router = express.Router();

/* GET home page. */

//"http://localhost:3000/test/" "/""
router.get('/', function(req, res, next) {
  res.render('test', { title: '**노드 테스트 title**' });
});

//"http://localhost:3000/test/" "/page/1""
router.get('/page/:pnum', function(req, res, next){
  var pagenumber = req.params.pnum;
  var param1 = req.params.pnum;

  var result=0;
  for(var i=0; i<=pagenumber; i++){
    result +=i;
  }
  
  
  //요청에 대한 내용을 바탕으로 연산을 할 수 있음
  res.render('page1',{pagenumber :pagenumber, result :result});
})

router.get('/calculate', function(req, res, next) {
  
  // var a= Number(req.params.a);
  // var b= Number(req.params.b);
  // var op= req.params.op;
  
  var a= Number(req.query.a);
  var b= Number(req.query.b);
  var op= req.query.op;
  var negative = Boolean(req.query.nagative) | false;
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

  res.send({result : result});

})

router.get('/btcprice', function(req, res, next) {
let url = 'https://api.upbit.com/v1/trades/ticks?market=KRW-BTC&count=1';
let options = {method: 'GET'};

fetch(url, options)
  .then(result => 
    result.json())
  .then(json => {
    var datetime = json[0].trade_date_utc + " " + json[0].trade_time_utc

    datetime = Date.parse(datetime);
    datetime = new Date(datetime).toLocaleString("ko-KR", {timeZone: "Asia/Seoul"})
    
    res.render('btcprice',
    {
      price: json[0].trade_price, 
      time:datetime, 
    });
  })
  .catch(err => console.error('error:' + err));

})

router.get('/:a/:op/:b', function(req, res, next) {
  
  // var a= Number(req.params.a);
  // var b= Number(req.params.b);
  // var op= req.params.op;
  var nagative = Boolean(req.query.nagative) | false;
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
// {a}, {b}
// {op}는 다음과 같이 
// - 'add, 'sub, 'mul', 'div'

//"http://localhost:3000/test/(10)/add/(100) = "

module.exports = router;
