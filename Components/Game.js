import { UI } from "./UI.js";
import { modal } from "./Modal.js";
import { player } from "./Player.js";

class Game extends UI {
  constructor() {
    super();
    this.initalizePrimaryGame();
    this.createElementEvents()
  }
  #textError = false;

  initalizePrimaryGame = () => {
    modal.playerCashSpan.textContent = player.getPlayerCash
  }

  createElementEvents = () => {
    modal.betButton.addEventListener('click', () => this.startGame());
  }

  startGame = () => {
    const bet = modal.betInput.value;
    if(this.#textError) document.querySelector('.text p').remove();
    modal.betInput.value = '';
    this.#textError = false;

    if(!bet) {
      this.createElement('.text', 'p', 'Please, type correct amount', 'error');
      this.#textError = true;
      return

    } else if(bet > player.getPlayerCash && !this.#textError) {
      this.createElement('.text', 'p', 'Sorry, you do not have sufficient money in your wallet', 'error');
      this.#textError = true;
      return
        
    }
  
    player.setPlayerBet = bet;
    this.changeScreen(modal.betModal, this.serviceScreenType.HIDDEN);
  
    this.createElement('.message', 'p', 'Please wait until cards will be shuffled');
    this.changeScreen(modal.messageModal, this.serviceScreenType.VISIBLED);

    setTimeout(() => {
      this.changeScreen(modal.messageModal, this.serviceScreenType.HIDDEN);
    }, 3000);
  }
}

window.onload = () => {
  const game = new Game();
}