import { UI } from "./UI.js";
import { modal } from "./Modal.js";
import { player } from "./Player.js";
import { deck } from "./Deck.js";
import { Buttons } from "./Buttons.js";
import { message} from "./Message.js";

class Game extends UI {
  constructor() {
    super();
    this.buttons = new Buttons(this.hitAction, this.standAction)
    modal.playerCashSpan.textContent = player.getPlayerCash;
    this.createElementEvents();
    this.dealerCards = [];
    this.dealerPoints = null;

    this.takeCard = card => this.dealerCards.push(card); //function allowing take dealer cards
  }

  #textError = false;
  #multiplier = 100;
  #isfinishedGame = false;
  #playerWon = 0;

  //Adding listener event on buttons
  createElementEvents = () => {
    modal.betButton.addEventListener('click', () => this.startGame());
  }

  startGame = () => {
    //Checking amount of input if input is empty or not
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
    this.changeScreen(modal.betModal, this.serviceScreenType.HIDDEN); //Close bet modal
  
    message.createMessage('Please wait until cards will be shuffled'); //Create message modal before start the game
    this.changeScreen(modal.messageModal, this.serviceScreenType.VISIBLED); // Display message modal

    this.giveFirstCardsPlayer();

    setTimeout(() => {
      this.changeScreen(modal.messageModal, this.serviceScreenType.HIDDEN); //Close message modal

      this.initalizePrimaryGameElements();
      this.displayCardOnTable();
      this.checkGame();

    }, 3000);
  }

  //Taking two cards for each person at the beggining time of the game
  giveFirstCardsPlayer = () => {
    for(let i = 0; i < 2; i++) {
      player.takeCard(deck.getOneCard());
      this.takeCard(deck.getOneCard())
    }
  }

  //Creating elements DOM which are on the green table game
  initalizePrimaryGameElements = () => {
    this.playerCardsElement = this.getElement(this.selectors.playerCards); //Get place where are put player cards
    this.dealerCardsElement = this.getElement(this.selectors.dealerCards); //Get place where are put dealer cards
    
    this.createElement(this.selectors.multiplier, 'p', "Game's multiplier : ");
    this.createElement(this.selectors.multiplier, 'p', `${this.#multiplier}%`);
    this.createElement(this.selectors.gameBetInfo, 'p', 'Current bet : ');
    this.createElement(this.selectors.gameBetInfo, 'p', `${player.getBet()}zł`);
    this.createElement(this.selectors.playerPoints, 'p', player.playerPointsOperation());
    this.createElement(this.selectors.dealerPoints, 'p', this.dealerPointsOperation());
  }

  //Display player and dealer cards on the table at the beginnig time of the game
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

    if(amountAllCards > 21){
      amountAllCards = null;
      cards.forEach(card => {
        if(card.nameCard === 'a') {
          card.valueCard = 1;
        }

        amountAllCards += card.valueCard;
      })
    }

    this.dealerPoints = amountAllCards;
    return amountAllCards;
  }

  hitAction = () => {
    const card = deck.getOneCard()
    
    this.playerCardsElement.appendChild(card.renderCard());
    player.takeCard(card);
   
    this.getElement('.playerPoints p').textContent = player.playerPointsOperation();
  }

  standAction = () => {
    const maxDealerPoints = 17 //Dealer cards value under which dealer can pick another card
    this.#isfinishedGame = true;
    this.buttons.removeListeners();

    //Here, dealer picks cards until his cards value does not pass 17 points
    for(let cardsValue = this.dealerPointsOperation(); cardsValue < maxDealerPoints; cardsValue = this.dealerPointsOperation()) {
      this.takeCard(deck.getOneCard());
    }

    if(player.playerPoints <= 21) { //Player have to have less points than 21, then he has chance to win the game

      if(player.playerPoints === this.dealerPoints) {  //Checking if player and dealer have te same points
        this.#playerWon = 2;
        this.#multiplier = 100;
        
      } else if(player.playerPoints > this.dealerPoints) { //Checking if player has more points than dealer
        this.#playerWon = 1;
        this.#multiplier = 100;
        
      } else if(player.playerPoints < this.dealerPoints) { //Checkin if player has less points than dealer
        
        if(this.dealerPoints <= 21) { //If dealer has less points than 21, He will win
          this.#playerWon = 0;
          this.#multiplier = 100;

        } else { //If dealer has more points than 21, player will win
          this.#playerWon = 1;
          this.multiplier = 100;
        }
      }
    } else { //Checking if player has more points than 21

      if(this.dealerPoints > 21) { //If dealer has more points than 21 too, Player will win
        this.#playerWon = 2;
        this.#multiplier = 100;

      } else { //If dealer hss less points than 21, dealer will win
        this.#playerWon = 0;
        this.#multiplier = 100;

      }
    }

    message.createMessage('Dealer are picking his card, please wait'); //Creating message
    this.changeScreen(modal.messageModal, this.serviceScreenType.VISIBLED);// Displaying message on the screen

    this.endGame();
  }

  checkGame = () => {
    const playerCards = player.currentCards;
    const dealerCards = this.dealerCards;

    //Checking at the beginning time of the game if player has 'BLACKJACK', if he has it, He will always win
    if(playerCards[0].valueCard === 10 && playerCards[1].valueCard === 11 || playerCards[0].valueCard === 11 && playerCards[1].valueCard === 10) {
      message.createMessage('BLACKJACK'); //Set new message modal
      this.changeScreen(modal.messageModal, this.serviceScreenType.VISIBLED); //Display message modal

      this.buttons.removeListeners();
      this.#isfinishedGame = true;
      this.#playerWon = 1;

      //Checking if dealer has 'BLACKJACK'
      if(dealerCards[0].valueCard === 10 && dealerCards[1].valueCard === 11 || dealerCards[1].valueCard === 11 && dealerCards[0].valueCard === 10) {
        this.#multiplier = 100;
        this.#playerWon = 2;
        this.endGame();

        return;
      }

      this.#multiplier = 150;
      this.dealerPointsOperation();
      this.endGame();
    }
  }

  endGame = () => {
    if(this.#isfinishedGame) { //Checking if the game is finished
      const playerBet = Number(player.getBet());
      const wonCash = playerBet * (this.#multiplier / 100);
      const playerPoints = player.playerPoints;
      const dealerPoints = this.dealerPoints;

      setTimeout(() => {
        this.getElement(`${this.selectors.multiplier} p:nth-of-type(2)`).textContent = `${this.#multiplier}%`;
        this.getElement(`${this.selectors.dealerPoints} p`).textContent = `${this.dealerPoints}`;
        this.changeScreen(modal.messageModal, this.serviceScreenType.HIDDEN);
        this.changeScreen(modal.endModal, this.serviceScreenType.VISIBLED);

        //Display dealer cards on the screen
        this.dealerCards.forEach((card, index) => {
          //Except for first card which is displays yet
          if(index > 1) {
            this.dealerCardsElement.appendChild(card.renderCard());
          }
        });

        //Checking if player won, lost or drawn the game
        if(this.#playerWon === 1) {
          modal.headerElement.textContent = 'YOU WON THE GAME';
          this.createElement(this.selectors.textInfo, 'p', `You have won ${wonCash}zł`);

        } else if(this.#playerWon === 2) {
          modal.headerElement.textContent = 'YOU DRAWN THE GAME';
          this.createElement(this.selectors.textInfo, 'p', `You have received the recovery your bet`);

        } else {
          modal.headerElement.textContent = 'YOU LOST THE GAME';
          this.createElement(this.selectors.textInfo, 'p', `You have lost ${wonCash}zł`);
        }

        this.createElement(this.selectors.betInfo, 'p', `Your bet in game : ${playerBet}`);
        this.createElement(this.selectors.betInfo, 'p', `Your points : ${playerPoints}`);
        this.createElement(this.selectors.multiplierInfo, 'p', `Multiplier amount : ${this.#multiplier}%`);
        this.createElement(this.selectors.multiplierInfo, 'p', `Dealer points : ${dealerPoints}`);

        this.revealCards();
      }, 3000);
    }
  }

  //Function which adds css class which turns all cards
  revealCards = () => {
    const cards = document.querySelectorAll('.table div div.card');

    cards.forEach(card => card.classList.remove('reverse'));
  }
}

window.onload = () => {
  const game = new Game();
}