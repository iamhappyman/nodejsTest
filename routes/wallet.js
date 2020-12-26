
var express = require('express');
const { render } = require('pug');
var router = express.Router();
require('dotenv').config();

let fs = require('fs');

const Web3 = require('web3')
let web3 = new Web3(
    new Web3.providers.HttpProvider(process.env.INFURA_RPC_URL)
)
let tokenList;

function loadTokenList(){
    let data = fs.readFileSync('data/tokenList.json')
    tokenList = JSON.parse(data);
}
loadTokenList();


router.get("/", async function(req,res,next){
    res.render('wallet',{tokenList:tokenList})
})

router.post('/regist', function(req,res,next){
    tokenAddress = req.body.newTokenAddress;
    if(tokenAddress != ''){
        tokenList.find( Element => [])
        tokenList.push({tokenAddress:tokenAddress});
        fs.writeFileSync('data/tokenList.json',JSON.stringify(tokenList));
    }
    res.redirect('/wallet');

})

module.exports = router