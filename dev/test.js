const Blockchian= require ('./blockchain');

let bc=new Blockchian();

bc.createNewBlock('a','rxx','lxx');
bc.createNewTransaction('100','ij','am');
bc.createNewBlock('b','rxxn','lxxn');

let l=bc.createNewTransaction('100','ijg','am');
bc.createNewTransaction('1000','ijk','am');
bc.createNewTransaction('10000','ijh','am');
bc.createNewBlock('c','rxxn','lxxn');

console.log(l)
console.log(bc.chain[2])