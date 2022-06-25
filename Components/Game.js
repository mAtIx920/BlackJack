import { UI } from "./UI.js";
import { modal } from "./Modal.js";
import { player } from "./Player.js";
import { deck } from "./Deck.js";
import { Buttons } from "./Buttons.js";
import { message} from "./Message.js";

class Game extends UI {
  constructor() {
    super();
    this.buttons = new Buttons(this.hitAction, this.doubleAction, this.standAction, this.splitAction, this.insuranceAction)
    modal.playerCashSpan.textContent = player.getPlayerCash;//Display player primary player cash on the screen
    this.dealerCards = [];
    this.dealerPoints = null;
    this.points = null;
    this.addListenersModalButtons();

    this.takeCard = card => this.dealerCards.push(card); //function allowing take dealer cards
  }

  #multiplier = 100;
  #playerWon = 0;//Mod player won: 0 - player lost, 1 - player won, 2 - player drawn
  #useSplit = 0
  #textError = false;
  #isfinishedGame = false;
  #useDouble = false;
  #useInsurance = false;

  //Adding listener event on modal start and end game buttons
  addListenersModalButtons = () => {
    modal.betButton.addEventListener('click', (e) => this.startGame());
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
  
    this.giveFirstCardsPlayer();

    player.setPlayerBet = bet;
    this.changeScreen(modal.betModal, this.serviceScreenType.HIDDEN); //Close bet modal
    message.createMessage('Please wait until cards will be shuffled'); //Create message modal before start the game
    this.changeScreen(modal.messageModal, this.serviceScreenType.VISIBLED); // Display message modal    

    setTimeout(() => {
      this.changeScreen(modal.messageModal, this.serviceScreenType.HIDDEN); //Close message modal
      this.initalizePrimaryGameElements();
      this.displayCardOnTable();
      this.checkGame();
      this.buttons.addListenersOnButton();//Adding listeners to buttons when the game will be begun

    }, 2000);
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

    if(!this.#isfinishedGame) {//Checking if game was finished, if it is true, the game will count all dealer cards
      cards.push(dealerCards[0]);
    } else {
      cards = dealerCards;
    }
    
    cards.forEach((card) => {//Here are counted points from cards    
      amountAllCards += card.valueCard; 
    })

    //If all points of cards overs 21 and dealer cards contains AS cards, those AS cards changes its eleven points to one point
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
    const card = deck.getOneCard();//Taking one card for player from deck
    player.takeCard(card, this.#useSplit);
    player.playerPointsOperation(this.#useSplit);

    if(this.#useSplit) {
      if(this.#useSplit === 1) {
        this.cardBoxOne.appendChild(card.renderCard());

      } else if(this.#useSplit === 2) {
        this.cardBoxTwo.appendChild(card.renderCard());
      }

      this.getElement('.playerPoints p').textContent = `${player.boxOnePoints} / ${player.boxTwoPoints}`;

    } else {
      this.playerCardsElement.appendChild(card.renderCard());
      this.getElement('.playerPoints p').textContent = player.playerPoints;
    }

    this.disableButtonsMode();//Removing insurance mode and split mode when player chooses to go on the game without those modes
  }

  doubleAction = () => {
    this.#useDouble = true;

    this.buttons.removeListeners();//Removing listeners from buttons
    this.disableButtonsMode();//Removing insurance mode and split mode when player chooses to go on the game without those modes
    this.hitAction();
    
    //Creating messages
    message.createMessage('You have just used double hit mode');
    this.changeScreen(modal.messageModal, this.serviceScreenType.VISIBLED);

    setTimeout(() => {
      this.changeScreen(modal.messageModal, this.serviceScreenType.HIDDEN);
      this.standAction();
    }, 2000)
   
  }

  standAction = () => {
    if(this.#useSplit === 1) {
      this.#useSplit = 2;
      this.buttons.removeListeners();
      message.createMessage('You have just changed card box');
      this.changeScreen(modal.messageModal, this.serviceScreenType.VISIBLED);

      setTimeout(() => {
        this.changeScreen(modal.messageModal, this.serviceScreenType.HIDDEN);
        this.buttons.addListenersOnButton();
      }, 2000);

      return;
    }

    
    this.#isfinishedGame = true;
    this.buttons.removeListeners();//Removing listeners from buttons

    this.getCardByDealer();

    if(!this.#useSplit) {
      this.analizeFinnalyPoints(player.playerPoints);

    } else if(this.#useSplit === 2) {
      const chossenValue = this.extractLevelOfWIn();

      this.analizeFinnalyPoints(chossenValue);

      console.log(chossenValue);
    }

    
 
    //Display message modal on the screen
    message.createMessage('Dealer are picking his card, please wait');
    this.changeScreen(modal.messageModal, this.serviceScreenType.VISIBLED);

    this.disableButtonsMode();//Removing insurance mode and split mode when player chooses to go on the game without those modes
    this.endGame();
  }

  analizeFinnalyPoints = (playerPoints) => {
    let lvlOfWin = null;

    if(playerPoints <= 21) { //Player have to have less points than 21, then he has chance to win the game

      if(playerPoints === this.dealerPoints) { //Checking if player and dealer have te same points
        lvlOfWin = 2;
        
      } else if(playerPoints > this.dealerPoints) { //Checking if player has more points than dealer
        lvlOfWin = 1;
        
      } else if(playerPoints < this.dealerPoints) { //Checkin if player has less points than dealer
        
        if(this.dealerPoints <= 21) { //If dealer has less points than 21, He will win
          lvlOfWin = 0;

        } else { //If dealer has more points than 21, player will win
          lvlOfWin = 1;
        }
      }
      
    } else { //Checking if player has more points than 21

      if(this.dealerPoints > 21) { //If dealer has more points than 21 too, Player will win
        lvlOfWin = 2;

      } else { //If dealer has less points than 21, dealer will win
        lvlOfWin = 0;
      }
    }

    if(this.#isfinishedGame) {
      this.#playerWon = lvlOfWin;

       //Checking some game conditions, for instance if insurance mode or double mode was used
      if(this.#useInsurance || this.#useDouble || this.#useSplit) {
        this.#multiplier = 200;

        if(this.#useInsurance && this.dealerCards[1].valueCard !== 10) {
          if(this.#useSplit) {
            this.#multiplier = 200;
          }

          this.#multiplier = 100;
        }

        if(this.#playerWon === 2 && this.#useDouble) {
          this.#multiplier = 100;
        }

        if(this.#playerWon === 2 && this.#useSplit) {
          this.#multiplier = 100;
        }
      }

      this.points = playerPoints;
    }

    return lvlOfWin
  }

  compareBoxHandler = (firstBoxPoints, secondBoxPoints) => {
    let choosenBoxPoints = null;

    if(firstBoxPoints === 0) {
      if(secondBoxPoints === firstBoxPoints) {
        if(player.boxOnePoints > player.boxTwoPoints) {
          choosenBoxPoints = player.boxTwoPoints;

        } else {
          choosenBoxPoints = player.boxOnePoints;
        } 
      } else {
        choosenBoxPoints = player.boxTwoPoints;
      }

    } else if(firstBoxPoints === 1) {
      if(firstBoxPoints === secondBoxPoints) {
        if(player.boxOnePoints > player.boxTwoPoints) {
          choosenBoxPoints = player.boxOnePoints;
  
        } else {
          choosenBoxPoints = player.boxTwoPoints;
        }
      } else {
        choosenBoxPoints = player.boxOnePoints;
      }
      
      
    } else if(firstBoxPoints === 2) {
      if(secondBoxPoints === firstBoxPoints) {
        if(player.boxOnePoints > 21 && player.boxTwoPoints > 21) {
          if(player.boxOnePoints > player.boxTwoPoints) {
            choosenBoxPoints = player.boxTwoPoints;

          } else {
            choosenBoxPoints = player.boxOnePoints;
          }
        }
        choosenBoxPoints = player.boxOnePoints;

      } else if(secondBoxPoints < firstBoxPoints) {
        if(secondBoxPoints === 1) {
          choosenBoxPoints = player.boxTwoPoints;

        } else if(secondBoxPoints === 0) {
          choosenBoxPoints = player.boxOnePoints;
        }
      } 
    }

    return choosenBoxPoints;
  }

  extractLevelOfWIn = () => {
    let firstPoints = null;
    let secondPoints = null;

    for(let i = 0; i < this.#useSplit; i++) {
      if(i === 0 ) {
        firstPoints = this.analizeFinnalyPoints(player.boxOnePoints)
      } else if(i === 1) {
        secondPoints = this.analizeFinnalyPoints(player.boxTwoPoints);
      }
    }

    return this.compareBoxHandler(firstPoints, secondPoints);
  }

  insuranceAction = () => {
    this.#useInsurance = true;

    player.playerCash -= (player.playerBet / 2);//Using double mode costs half primary player bet, here it is takes form him

    //Display message modal on the screen
    message.createMessage('You have just used insurance mode');
    this.changeScreen(modal.messageModal, this.serviceScreenType.VISIBLED);

    //Disable insurance button mode
    this.buttons.insuranceButton.removeEventListener('click', this.insuranceAction);
    this.buttons.insuranceButton.classList.add('usedButton');

    setTimeout(() => this.changeScreen(modal.messageModal, this.serviceScreenType.HIDDEN), 2000);
  }

  splitAction = () => {
    this.#useSplit = 1;
    this.buttons.removeListeners();//Block buttons during displaying message modal

    while(this.playerCardsElement.firstChild) {//Remove cards from DOM elements
      this.playerCardsElement.removeChild(this.playerCardsElement.lastChild)
    }

    //Create two box DOM element where will be cards
    this.cardBoxOne = this.createElement(this.selectors.playerCards, 'div', null, 'box__one');
    this.cardBoxTwo = this.createElement(this.selectors.playerCards, 'div', null, 'box__two');

    player.createBoxesElement(this.cardBoxOne, this.cardBoxTwo);

    for(let amount = this.#useSplit; amount <= 2; amount++)  {//Count points of each boxes
      player.playerPointsOperation(amount)
    }

    this.buttons.splitButton.classList.add('usedButton');//Add grey color for split button mode
    this.buttons.doubleButton.classList.add('usedButton');//Add grey color for double button mode

    //Creating new mesage and displaying it
    message.createMessage('You have just used split mode');
    this.changeScreen(modal.messageModal, this.serviceScreenType.VISIBLED);

    setTimeout(() => {
      this.changeScreen(modal.messageModal, this.serviceScreenType.HIDDEN);
      this.buttons.addListenersOnButton();//Adding listeners on butons again
      this.buttons.splitButton.removeEventListener('click', this.splitAction);//Remove listeners from split button mode
      this.buttons.doubleButton.removeEventListener('click', this.doubleAction);//Remove listeners from double button mode
      this.getElement('.playerPoints p').textContent = `${player.boxOnePoints} / ${player.boxTwoPoints}`;
    }, 2000)
  }

  getCardByDealer = () => {
    const maxDealerPoints = 17 //Dealer cards value under which dealer can pick another card

    //Here, dealer picks cards until his cards value does not pass 17 points
    for(let cardsValue = this.dealerPointsOperation(); cardsValue < maxDealerPoints; cardsValue = this.dealerPointsOperation()) {
      this.takeCard(deck.getOneCard());
    }
  }

  //Function which is launched at the beginnign game time, It is check if player could use some mode in game
  checkGame = () => {
    const playerCards = player.currentCards;
    const dealerCards = this.dealerCards;

    //Checking at the beginning time of the game if player has 'BLACKJACK', if he has it, He will always win
    if(playerCards[0].valueCard === 10 && playerCards[1].valueCard === 11 || playerCards[0].valueCard === 11 && playerCards[1].valueCard === 10) {

      this.#isfinishedGame = true;
      this.points = 'BLACKJACK';
      message.createMessage('BLACKJACK'); //Set new message modal
      this.changeScreen(modal.messageModal, this.serviceScreenType.VISIBLED); //Display message modal

      //Checking if dealer has 'BLACKJACK' too
      if(dealerCards[0].valueCard === 10 && dealerCards[1].valueCard === 11 || dealerCards[1].valueCard === 11 && dealerCards[0].valueCard === 10) {
        this.dealerPoints = 'BLACKJACK';
        this.#playerWon = 2;
        this.endGame();

        return;
      }

      this.#multiplier = 150;
      this.getCardByDealer();
      this.endGame();

    }
    
    //Checking if dealer first card is AS card, if it is true, then player could use insurance mode
    if(dealerCards[0].nameCard === 'a') {
      this.button = `INSURANCE - ${player.playerBet / 2}zł`;//Displaying price of insurance mode
      this.getElement(this.selectors.extendCons.insuranceButton.textContenttener).appendChild(this.buttons.insuranceButton);//Added insurance button mode to DOM
    }

    if(player.currentCards[0].valueCard === player.currentCards[1].valueCard) {
      this.getElement(this.selectors.extendContener).appendChild(this.buttons.splitButton);//Added split button mode to DOM
    }
  }

  //Function launching athe the finished game
  endGame = () => {
    this.buttons.removeListeners();

    if(this.#isfinishedGame) { //Checking if the game is finished
      const playerBet = Number(player.getBet());
      const wonCash = playerBet * (this.#multiplier / 100);
      const playerPoints = this.points;
      const dealerPoints = this.dealerPoints;

      setTimeout(() => {
        this.getElement(`${this.selectors.multiplier} p:nth-of-type(2)`).textContent = `${this.#multiplier}%`;
        this.getElement(`${this.selectors.dealerPoints} p`).textContent = `${this.dealerPoints}`;
        this.changeScreen(modal.messageModal, this.serviceScreenType.HIDDEN);
       

        //Display dealer cards on the screen
        this.dealerCards.forEach((card, index) => {
          //Except for first card which is displays yet
          if(index > 1) {
            this.dealerCardsElement.appendChild(card.renderCard());
          }
        });

        //Checking if player won, lost or drawn the game
        const textElement = this.getElement(this.selectors.textInfo);
        if(this.#playerWon === 1) {
          modal.headerElement.textContent = 'YOU WON THE GAME';
          textElement.textContent = `You have won ${wonCash}zł`;

        } else if(this.#playerWon === 2) {
          modal.headerElement.textContent = 'YOU DRAWN THE GAME';
          textElement.textContent = `You have received the recovery your bet`;

        } else {
          modal.headerElement.textContent = 'YOU LOST THE GAME';
          textElement.textContent = `You have lost ${wonCash}zł`;
        }

        if(this.#useInsurance && this.dealerCards[1].valueCard === 10) {
          modal.headerElement.textContent = 'YOU WON THE GAME';
          textElement.textContent = `You have won ${wonCash}zł`;
        }

        this.getElement(this.selectors.betInfo).textContent = playerBet;
        this.getElement(this.selectors.playerPointsInfo).textContent = playerPoints;
        this.getElement(this.selectors.multiplierInfo).textContent = this.#multiplier;
        this.getElement(this.selectors.dealerPointsInfo).textContent = dealerPoints;
        this.changeScreen(modal.endModal, this.serviceScreenType.VISIBLED);

        this.revealCards();
      }, 3000);
    }
  }

  //Function which adds css class which turns all cards
  revealCards = () => {
    const cards = document.querySelectorAll('.table div div.card');

    cards.forEach(card => card.classList.remove('reverse'));
  }

  //Function which disables game mode
  disableButtonsMode = () => {
    if(!this.#useInsurance) {
      this.buttons.insuranceButton.removeEventListener('click', this.insuranceAction);
      this.buttons.insuranceButton.classList.add('usedButton');
    }

    if(!this.#useSplit) {
      this.buttons.splitButton.removeEventListener('click', this.splitAction);
      this.buttons.splitButton.classList.add('usedButton');
    }
  }
}

window.onload = () => {
  const game = new Game();
}