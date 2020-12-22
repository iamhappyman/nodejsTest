var express = require('express');
var router = express.Router();

const Web3 = require('web3')
let web3 = new Web3(
    //나중에 유로 서비스 이용 가능 
    new Web3.providers.WebsocketProvider("wss://ropsten.infura.io/ws/v3/395ab90b2f134ea78d0bd652496f4e17")
)


router.get('/getBlock', function(req, res, next) {
    //현재 블록체인 에서 생성된 블록의 정보를 조회하여 보여주는 기능.
    var block_num
    if( Number(req.query.block_num) ){
        block_num=Number(req.query.block_num);
    }
    else{
        block_num="latest"
    }
    web3.eth.getBlock(block_num, true, function(err,block)
    {
        console.log(block);

        datetime = block.timestamp*1000;
        block.time = new Date(datetime).toLocaleString("ko-KR", {timeZone: "Asia/Seoul"})
        block.txCount = block.transactions.length;
        //res.json(block);
        res.render('blockinfo',{block:block})
    })
});

router.get('/getTx/:txhash', function(req, res, next){
    var txHash = req.params.txhash
    //트랜잭션 정보를 보여주는 기능 구현

    // transaction Receipt
    web3.eth.getTransactionReceipt( txHash , function(err,receipt){
        web3.eth.getTransaction( txHash, function(err,tx){
            web3.eth.getBlock(tx.blockHash,false, function(err, block){
                var data={time:0,fee:0}
                var datetime = block.timestamp*1000;

                data.time = new Date(datetime).toLocaleString("ko-KR", {timeZone: "Asia/Seoul"})
                data.fee = tx.gasPrice * receipt.gasUsed
                data.fee = web3.utils.fromWei(data.fee.toString(),'ether')
                tx.gasPrice = web3.utils.fromWei(tx.gasPrice,'ether') + "("+ web3.utils.fromWei(tx.gasPrice,'gwei')+"gwei)"

                res.render('txInfo',{tx : tx, receipt : receipt, data : data});
            })
        })
    })
});



module.exports = router;