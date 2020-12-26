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


module.exports = router