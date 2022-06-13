import { Wallet } from "./Wallet.js";

class Player extends Wallet {
  constructor() {
    super(50);
    this.playerBet = null;
    this.playerCash = this.cash;
    this.currentCards = [];
    this.playerPoints = null;

    this.getBet = () => this.playerBet;
    this.takeCard = card => this.currentCards.push(card);
  }

  //Function which counts player points
  playerPointsOperation = () => {
    const cards = this.currentCards;
    let amountAll = null;

    cards.forEach((card) => {
      amountAll += card.valueCard;
    })

    return amountAll;
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