var express = require('express');
const { render } = require('pug');
var router = express.Router();
require('dotenv').config();

let fs = require('fs');


const Web3 = require('web3')
let web3 = new Web3(
    new Web3.providers.WebsocketProvider(process.env.INFURA_RPC_URL)
)
let voteAbi = JSON.parse( fs.readFileSync('abis/vote.abi.json'))
let voteContract = new web3.eth.Contract( voteAbi, "0x0000000000000000000000000000000000000000")


//localhost:3000/vote
router.get("/", async function(req,res,next){
    
    var voteFactoryAbi = JSON.parse( fs.readFileSync('abis/voteFactory.abi.json') )
    var voteFactoryContract = new web3.eth.Contract(voteFactoryAbi, process.env.CONTRACT_ADDR_VOTE)

    // ** 컨트랙트를 호출하는 두가지 방법
    // call() : 상수함수들 view/pure, public으로 지정된 상태변수
    // send() : 그 외의 함수들(상태변수를 변경하는 함수들) 
    //        : 트랜잰션을 만들어서 전송함. ** Private Key가 필요

    // 네트워크를 통해서 데이터를 읽어오는 행위. -> IO 작업.
    // IO 작업이 끝나면, Callback 함수를 호출하여, 남은 작업을 수행.
    //
    //
    // 작업 1....
    // voteFactoryContract.methods.countOfVote().call()
    // .then(function (result){
    //     //작업 2....
    //     voteFactoryContract.methods.countOfVote().call()
    //     .then( function (result2){
    //         //작업 3....
    //
    //     })
    // 
    // })


    let count = Number.parseInt(await voteFactoryContract.methods.countOfVote().call())
    let voteAddressList = []
    let titleList=[]

    for(let i=0;i<count;i++){
        let _address = await voteFactoryContract.methods.findVoteByIndex(i).call()
        voteAddressList.push(_address);
    }
    for(let i=0;i<count;i++){
        let voteAddress = voteAddressList[i]
        voteContract.options.address = voteAddress
        let title = await voteContract.methods.title().call()
        let votingCount = await voteContract.methods.voteCount().call();
        let voteClosing = await voteContract.methods.timeLimit().call(); // sec 단위
        voteClosing = new Date(voteClosing*1000).toLocaleString("ko-KR", {timeZone: "Asia/Seoul"})
                                  //msec 단위
        titleList.push({
            title : title,
            votingCount:votingCount,
            voteClosing:voteClosing,
            address:voteAddress
        });
    }
      
    var data = {
        factory : {
            address :process.env.CONTRACT_ADDR_VOTE,
            count :count
        },
        votelist : titleList
    }

    res.render('voteDashboard',{data:data});
})

module.exports = router;