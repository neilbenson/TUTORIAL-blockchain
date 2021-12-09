const { Blockchain, Transaction } = require("./blockchain");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

const myKey = ec.keyFromPrivate("b630c89f18508886db0397ef001e9e5675eddadef659996fc76d9ac0542868cc");
const myWalletAddress = myKey.getPublic("hex");

let bennoCoin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, "public key goes here", 10);
tx1.signTransaction(myKey);
bennoCoin.addTransaction(tx1);

console.log("\nStarting the miner...");
bennoCoin.minePendingTransactions(myWalletAddress);

console.log("\nBalance of test is", bennoCoin.getBalanceForAddress(myWalletAddress));

// Attempt to change transaction
// bennoCoin.chain[1].transactions[0].amount = 1;

console.log("Is chain valid?", bennoCoin.isChainValid());
