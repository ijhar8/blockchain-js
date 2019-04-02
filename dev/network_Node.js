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

    const newTransaction=req.body;

    const blockIndex=bitcoin.addTransactionToPendingTransactions(newTransaction)
    

    res.json({blockIndex:`you block added at ${blockIndex}`});

});


app.post('/transaction/broadcast', function (req, res) {

    const newTransaction=bitcoin.createNewTransaction(req.body.amount,req.body.sender,req.body.recipient)

    bitcoin.addTransactionToPendingTransactions(newTransaction)

   const regNodesPromises=[]
   let  requestOptions=''
    bitcoin.networkNodes.forEach(networkNodeUrl =>{
     
        requestOptions = {

            uri: networkNodeUrl +'/transaction',
            method:'POST',
            body:newTransaction,
            json:true
        }

        regNodesPromises.push(rp(requestOptions));

    });

    Promise.all(regNodesPromises)
    .then(data=>{

        res.json({note:`Transaction created and broadcast successfully`});

    });



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

   // bitcoin.createNewTransaction('12.0',"00",nodeAddress);//mining reward

    const newBlock=bitcoin.createNewBlock(nonce,previousBloackHash,blockHash)



    const regNodesPromises=[]
    let  requestOptions=''
    bitcoin.networkNodes.forEach(networkNodeUrl =>{
     
        requestOptions = {

            uri: networkNodeUrl +'/receive-new-block',
            method:'POST',
            body:{newBlock:newBlock},
            json:true
        }

        regNodesPromises.push(rp(requestOptions));

    });

    Promise.all(regNodesPromises)
    .then(data=>{

         const  requestOption = {

            uri: bitcoin.currentNodeUrl +'/transaction-broadcast',
            method:'POST',
            body:{
                amount:12.00,
                sender:'system',
                recipient:nodeAddress,
            },
            json:true
        }

      return  rp(requestOption);

    })
    .then(data =>{

        res.json({
            note:"New Block Mined & Broadcast",
            block:newBlock
        })
    });

    




}) //end mine


app.post('/receive-new-block',function(req,res){

    const newBlock=req.body.newBlock;
    const lastBlock=bitcoin.getLastBlock();
    const isValidHash=newBlock.previousBloackHash===lastBlock.has;
    const isValidIndex=newBlock.index===lastBlock.index+1;

    if(isValidHash && isValidIndex)
      {
          bitcoin.chain.push(newBlock);
          bitcoin.pendingTransactions=[];
          res.json({note:`new block received and accepted successfully`});

      }
      else{
        res.json({note:`new block received and rejected`});

      }

});







//register a new node and broadcast it entire network
app.post('/register-and-broadcast-node',function(req,res){

    const newNodeUrl=req.body.newNodeUrl


    if(bitcoin.networkNodes.includes(newNodeUrl)===false)
       bitcoin.networkNodes.push(newNodeUrl)

    const regNodesPromises=[]
    let  requestOptions=''
    bitcoin.networkNodes.forEach(networkNodeUrl =>{
     
        requestOptions = {

            uri: networkNodeUrl +'/register-node',
            method:'POST',
            body:{ newNodeUrl : newNodeUrl },
            json:true
        }

        regNodesPromises.push(rp(requestOptions));

    });

    Promise.all(regNodesPromises)
    .then( data =>{
          const bulkRegisterOptions={

            uri:newNodeUrl +'/register-bulk-nodes',
            method:'POST',
            body:{ allNetworkNodes : [...bitcoin.networkNodes,bitcoin.currentNodeUrl] },
            json:true   
          }
        return rp(bulkRegisterOptions);
    })
    .then(data =>{
        res.json({note:`node added success fully`});
    });
});
 

app.post('/register-node',function(req,res){
    
    const newNodeUrl=req.body.newNodeUrl;

    if(bitcoin.networkNodes.includes(newNodeUrl)===false && bitcoin.currentNodeUrl!==newNodeUrl)
    bitcoin.networkNodes.push(newNodeUrl);

    res.json({note:`New node registerd successfully`});
});

app.post('/register-bulk-nodes',function(req,res){

    const allNetworkNodes=req.body.allNetworkNodes;

    allNetworkNodes.forEach(networkNodeUrl =>{

        if(bitcoin.networkNodes.includes(networkNodeUrl)===false && bitcoin.currentNodeUrl!==networkNodeUrl)
        bitcoin.networkNodes.push(networkNodeUrl);
    

    });

    res.json({note:`New node registerd successfully`});
    
})




app.listen(port,function(){
    
    console.log(`listening on  ${port} `);

})
