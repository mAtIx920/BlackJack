import { Wallet } from "./Wallet.js";

class Player extends Wallet {
  constructor() {
    super(50);
    this.playerBet = null;
    this.playerCash = this.cash;
    this.currentCards = null;
  }
  
  get getPlayerCash() {
    return this.playerCash;
  }

  set setPlayerBet(currentBet) {
    this.playerBet = currentBet;
    this.playerCash -= currentBet;
  }
}

export const player = new Player();