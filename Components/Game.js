import { UI } from "./UI.js";
import { modal } from "./Modal.js";
import { player } from "./Player.js";
import { deck } from "./Deck.js";

class Game extends UI {
  constructor() {
    super();
    modal.playerCashSpan.textContent = player.getPlayerCash;
    this.createElementEvents();
    this.dealerCards = [];

    this.takeCard = card => this.dealerCards.push(card); //function allowing get dealer cards
  }

  #textError = false;
  #multiplier = 100;
  #isfinishedGame = false;

  //Adding listener event on buttons
  createElementEvents = () => {
    modal.betButton.addEventListener('click', () => this.startGame());
  }

  startGame = () => {
    //Checking amount of input
    const bet = modal.betInput.value;
    if(this.#textError) document.querySelector('.text p').remove();
    modal.betInput.value = '';
    this.#textError = false;

    if(!bet || bet < 0) {
      this.createElement('.text', 'p', 'Please, type correct amount', 'error');
      this.#textError = true;
      return

    } else if(bet > player.getPlayerCash && !this.#textError) {
      this.createElement('.text', 'p', 'Sorry, you do not have sufficient money in your wallet', 'error');
      this.#textError = true;

      return    
    }
  
    player.setPlayerBet = bet;
    this.changeScreen(modal.betModal, this.serviceScreenType.HIDDEN); //display modal with message
  
    this.createElement('.message', 'p', 'Please wait until cards will be shuffled');
    this.changeScreen(modal.messageModal, this.serviceScreenType.VISIBLED);

    this.giveFirstCardsPlayer();

    setTimeout(() => {
      this.changeScreen(modal.messageModal, this.serviceScreenType.HIDDEN);

      this.initalizePrimaryGameElements();
      this.displayCardOnTable();
      
    }, 3000);
  }

  //Taking two cards for each person
  giveFirstCardsPlayer = () => {
    for(let i = 0; i < 2; i++) {
      player.takeCard(deck.getOneCard());
      this.takeCard(deck.getOneCard())
    }
  }

  //Creating elements DOM which are on the green table game
  initalizePrimaryGameElements = () => {
    this.playerCardsElement = this.getElement(this.selectors.playerCards);
    this.dealerCardsElement = this.getElement(this.selectors.dealerCards);
    
    this.createElement(this.selectors.multiplier, 'p', "Game's multiplier : ");
    this.createElement(this.selectors.multiplier, 'p', `${this.#multiplier}%`);
    this.createElement(this.selectors.gameBetInfo, 'p', 'Current bet : ');
    this.createElement(this.selectors.gameBetInfo, 'p', `${player.getBet()}zł`);
    this.createElement(this.selectors.playerPoints, 'p', player.playerPointsOperation());
    this.createElement(this.selectors.dealerPoints, 'p', this.dealerPointsOperation());
  }

  //Display player and dealer cards on the table
  displayCardOnTable = () => {
    player.currentCards.forEach(card => this.playerCardsElement.appendChild(card.renderCard()));
    this.dealerCards.forEach((card, index) => {
      const item = this.dealerCardsElement.appendChild(card.renderCard());

      //Setting the second dealer card as turned
      if(index === 1) {
        item.querySelector('.card').classList.add('reverse');
      }
    });
  }

  //Fuction which counts dealer points
  dealerPointsOperation = () => {
    let amountAllCards = null;
    const dealerCards = this.dealerCards;
    let cards = [];

    if(!this.#isfinishedGame) {
      cards.push(dealerCards[0]);
    } else {
      cards = dealerCards;
    }
    
    cards.forEach((card) => {
      amountAllCards += card.valueCard;
    })

    return amountAllCards;
  }
}

window.onload = () => {
  const game = new Game();
}