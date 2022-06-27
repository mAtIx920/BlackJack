import { Wallet } from "./Wallet.js";

class Player{
  constructor() {
    this.playerBet = null;
    this.playerWallet = new Wallet();
    this.currentCards = [];
    this.playerPoints = null;
    this.boxOnePoints = null;
    this.boxTwoPoints = null;

    this.getBet = () => this.playerBet; //Function getting player bet
    this.takeCard = (card, number) => { //Function putting new card to the player deck
      if(!number) {
        this.currentCards.push(card);
      } else if(number === 1) {
        this.boxOne.push(card);
      } else if(number === 2) {
        this.boxTwo.push(card);
      }
    } 
  }

  //Function which counts player points
  playerPointsOperation = (splitOperation = 0) => {
    const cards = splitOperation ? (splitOperation === 1 ? this.boxOne : this.boxTwo) : this.currentCards;
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
    
    if(!splitOperation) {
      this.playerPoints = amountAll;
    } else if(splitOperation === 1) {
      this.boxOnePoints = amountAll;
    } else if(splitOperation === 2) {
      this.boxTwoPoints = amountAll;
    }

    return amountAll;
  }

  createBoxesElement = (boxOne, boxTwo) => {
    this.playerPoints = null;

    this.boxOne = [];
    this.boxTwo = [];

    for(let i = 0; i <= this.currentCards.length; i++) {
      const existCard = this.currentCards.shift();

      if(i === 0) {
        this.boxOne.push(existCard);
        boxOne.appendChild(this.boxOne[0].renderCard());

      } else if(i === 1) {
        this.boxTwo.push(existCard);
        boxTwo.appendChild(this.boxTwo[0].renderCard());
      }
    }
  }
  
  get getPlayerCash() {
    return this.playerWallet.cash;
  }

  set setPlayerBet(currentBet) {
    this.playerBet = currentBet;
    this.playerWallet.cash -= currentBet;
  }
}

export const player = new Player();