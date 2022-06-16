import { Wallet } from "./Wallet.js";

class Player extends Wallet {
  constructor() {
    super(50);
    this.playerBet = null;
    this.playerCash = this.cash;
    this.currentCards = [];
    this.playerPoints = null;

    this.getBet = () => this.playerBet; //Function getting player bet
    this.takeCard = card => this.currentCards.push(card); //Function putting new card to the player deck
  }

  //Function which counts player points
  playerPointsOperation = () => {
    const cards = this.currentCards;
    let amountAll = null;

    cards.forEach((card) => {
      amountAll += card.valueCard;
    })

    if(amountAll > 21) { 
      amountAll = null;

      cards.forEach(card => { //Checking if player deck owns AS card, if it is true, value of AS card will change at one point
        if(card.nameCard === 'a') {
          card.valueCard = 1;
        }

        amountAll += card.valueCard;
      })
    }

    this.playerPoints = amountAll;
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