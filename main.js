const { SHA256 } = require("crypto-js");

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block {
  constructor(timestamp, transactions, previousHash = "") {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(this.timestamp + JSON.stringify(this.data) + this.previousHash + this.nonce).toString();
  }

  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log("Block mined:", this.hash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2; // 2-4 is quite quick, 5 takes much longer
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock() {
    return new Block("07/12/2021", "Genesis block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress) {
    let block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);

    console.log("Block successfuly mined!");
    this.chain.push(block);

    this.pendingTransactions = [new Transaction(null, miningRewardAddress, this.miningReward)];
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  getBalanceForAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }
        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }

    return balance;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }
}

let bennoCoin = new Blockchain();
bennoCoin.createTransaction(new Transaction("address1", "address2", 100));
bennoCoin.createTransaction(new Transaction("address2", "address1", 50));

console.log("\nStarting the miner...");
bennoCoin.minePendingTransactions("test-address");

console.log("\nBalance of test is", bennoCoin.getBalanceForAddress("test-address"));

console.log("\nStarting the miner...");
bennoCoin.minePendingTransactions("test-address");

console.log("\nBalance of test is", bennoCoin.getBalanceForAddress("test-address"));
console.log("\nBalance of address2 is", bennoCoin.getBalanceForAddress("address2"));
