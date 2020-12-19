var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('test', { title: '노드 테스트 페이지' });
});

module.exports = router;
