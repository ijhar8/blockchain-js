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

const previousBlockHash="jfbdsakjfb";
const nonce=100;
console.log(bc.hashBlock(previousBlockHash,currentBlock,nonce))