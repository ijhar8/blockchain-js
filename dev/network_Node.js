var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Blockchain = require('./blockchain');
var uuid=require('uuid/v1');
var port=process.argv[2];
var rp=require('request-promise');
const nodeAddress=uuid().split('-').join('');//unique id


bitcoin=new Blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
 
app.get('/blockchain', function (req, res) {

    res.send(bitcoin);

})

app.post('/transaction', function (req, res) {

    const blockIndex=bitcoin.createNewTransaction(req.body.amount,req.body.sender,req.body.recipient)

    res.json({blockIndex:`you block added at ${blockIndex}`});

});

app.get('/mine', function (req, res) {

    const lastBlock=bitcoin.getLastBlock();
    const previousBloackHash=lastBlock.has;
    const currentBlockData={

        transactions: bitcoin.pendingTransactions,
        index:lastBlock.index
    }
    const nonce=bitcoin.proofOfWork(previousBloackHash,currentBlockData);
    const blockHash=bitcoin.hashBlock(previousBloackHash,currentBlockData,nonce);

    bitcoin.createNewTransaction('12.0',"00",nodeAddress);//mining reward

    const newBlock=bitcoin.createNewBlock(nonce,previousBloackHash,blockHash)

    res.json({
        note:"New Block Mined",
        block:newBlock
    })




}) //end mine

//register a new node and broadcast it entire network
app,post('/register-and-broadcast-node',function(req,res){

    const newNodeUrl=req.body.newNodeUrl


    if(bitcoin.networkNodes.includes(newNodeUrl)===false)
       bitcoin.networkNodes.push(newNodeUrl)

    const regNodesPromises=[]
    let  requestOptions=''
    bitcoin.networkNodes.foreach(networkNodeUrl=>{
     
        requestOptions={
            uri:networkNodeUrl+'/register-node',
            method:'POST',
            body:{ newNodeUrl : newNodeUrl },
            json:true
        }

        regNodesPromises.push(rp(regNodesPromises));

    });

    Promise.all(regNodesPromises)
    .then( data =>{
          const bulkRegisterOptions={
            uri:networkNodeUrl+'/register-bulk-nodes',
            method:'POST',
            body:{ allNodes : [...bitcoin.networkNodes,bitcoin.currentNodeUrl] },
            json:true   
          }
        return rp(bulkRegisterOptions);
    })
    .then(data =>{
        res.join(`node added success fully`);
    });
});
 
app,post('/register-node',function(req,res){

    
})

app,post('/register-bulk-nodes',function(req,res){

    
})




app.listen(port,function(){
    
    console.log(`listening on  ${port} `);

})
