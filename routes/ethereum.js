var express = require('express');
const { render } = require('pug');
var router = express.Router();

require('dotenv').config();


const Web3 = require('web3')
let web3 = new Web3(
    new Web3.providers.WebsocketProvider(process.env.INFURA_RPC_URL)
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
        if(err){
            next(err)
            return
        }
        web3.eth.getTransaction( txHash, function(err,tx){
            if(err){
                next(err)
                return
            }
            web3.eth.getBlock(tx.blockHash,false, function(err, block){
                if(err){
                    next(err)
                    return
                }
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

router.get('/transferEth', function(req, res, next){
    var private_key = process.env.ETH_PRIVATE_KEY;
    var _account = web3.eth.accounts.privateKeyToAccount(private_key)

    var bestGasPrice = // todo  infu
    web3.eth.getBalance(_account.address, function(err,balance){

        var account = {
            address : _account.address,
            balance : web3.utils.fromWei(balance,'ether')
        }
        res.render('transferEth',{account:account})
    })
})

router.post('/transferEth', function(req,res,next){
    var transferInfo = req.body
    var private_key = process.env.ETH_PRIVATE_KEY;
    var _account = web3.eth.accounts.privateKeyToAccount(private_key)

    web3.eth.getTransactionCount(_account.address, function(err,nonce){
        var gasPrice = web3.utils.toWei(transferInfo.gasPrice,'gwei')
        var rawTx={
            nonce: web3.utils.toHex(nonce),
            from: _account.address,
            gasLimit: web3.utils.toHex(25000),
            gasPrice: web3.utils.toHex(gasPrice),
            to : transferInfo.address,
            value : web3.utils.toWei(transferInfo.amount,'ether')
        }
        _account.signTransaction(rawTx, function( err, signedTx){
            if(err){
                next(err)
                return
            }
            

            web3.eth.sendSignedTransaction(signedTx.rawTransaction)
            .on('transactionHash', function(hash){
                console.log(hash);
            })
            .on('receipt',function(receipt){
                console.log("Transcation send Finished")
            })
            .on('confirmation', function(confirmationNumber, receipt){
                console.log( '#',confirmationNumber ,"Confirmed")
                if(confirmationNumber == 6){
                    res.redirect("https://ropsten.etherscan.io/tx/"+receipt.transactionHash)
                }
            })
            .on('error', function(err){
                next(error)
            })
        })
    })
})


module.exports = router;