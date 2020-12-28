
var express = require('express');
const { render } = require('pug');
var router = express.Router();
require('dotenv').config();

let fs = require('fs');

const Web3 = require('web3')
let web3 = new Web3(
    new Web3.providers.HttpProvider(process.env.INFURA_RPC_URL)
)
let abi = JSON.parse( fs.readFileSync('abis/token.abi.json'));
let tokenList;

function loadTokenList(){
    let data = fs.readFileSync('data/tokenList.json')
    tokenList = JSON.parse(data);
}
loadTokenList();


router.get("/", async function(req,res,next){
    res.render('wallet',{tokenList:tokenList})
})

router.post('/regist', async function(req,res,next){
    tokenAddress = req.body.newTokenAddress;
    if(tokenAddress != ''){
        sameToken = tokenList.find( element =>{
            return element.tokenAddress == tokenAddress
        })
        if(sameToken === undefined){


            tokenContract = new web3.eth.Contract(abi,tokenAddress);

            tokenName   = await tokenContract.methods.name().call()
            symbol      = await tokenContract.methods.symbol().call()
            tokenList.push({tokenAddress:tokenAddress, name :tokenName, symbol:symbol });
            fs.writeFileSync('data/tokenList.json',JSON.stringify(tokenList));
        }
        
    }
    res.redirect('/wallet');

})

module.exports = router