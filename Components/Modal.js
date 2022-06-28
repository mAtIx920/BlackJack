import { UI } from "./UI.js";

class Modal extends UI {
  constructor() {
    super();
    this.initModalElements();
  }

  initModalElements = () => {
    //Message modal displays at the beggining game
    this.betModal = this.getElement(this.selectors.betModal);
    this.playerCashSpan = this.getElement(this.selectors.betPlayerCash);
    this.betInput = this.getElement(this.selectors.betInput);
    this.betButton = this.getElement(this.selectors.betButton);
    this.messageModal = this.getElement(this.selectors.messageModal);

    //Message modal displays at the end game
    this.endModal = this.getElement(this.selectors.endModal);
    this.headerElement = this.getElement(this.selectors.endHeader);
    this.playAgainButton = this.getElement(this.selectors.againButton);
  }
}

export const modal = new Modal();