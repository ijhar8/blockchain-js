const Blockchian= require ('./blockchain');

let bc=new Blockchian();

const currentBlock=[
    {
        amount:10,
        sender:'kdfhasdkjfba',
        recipient:'jdsabdjb',
    },
    {
        amount:20,
        sender:'kdfhasdkjfbwqedwq',
        recipient:'jdsabdrewrejb',
    },
    {
        amount:30,
        sender:'kdfhasrfdsfdkjfba',
        recipient:'jdsabdjfdsfdsb',
    }
]

const previousBlockHash="jfbdsakjfbl";
const nonce= bc.proofOfWork(previousBlockHash,currentBlock) 

//console.log(bc.hashBlock(previousBlockHash,currentBlock,nonce))

console.log(bc)