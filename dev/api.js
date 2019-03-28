var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var Blockchain = require('./blockchain')

bitcoin=new Blockchain();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))
 
app.get('/blockchain', function (req, res) {

    res.send(bitcoin)

})

app.post('/transaction', function (req, res) {

    const blockIndex=bitcoin.createNewTransaction(req.body.amount,req.body.sender,req.body.recipient)

    res.json({blockIndex:`you block added at ${blockIndex}`})

})

app.get('/mine', function (req, res) {

const nonce=bitcoin.proofOfWork();

})

app.listen(8888,function(){
    
    console.log('listening on 8888');

})
