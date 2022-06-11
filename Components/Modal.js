import { UI } from "./UI.js";

class Modal extends UI {
  constructor() {
    super();
    this.initModalElements();
  }

  initModalElements = () => {
    this.betModal = this.getElement(this.selectors.betModal);
    this.playerCashSpan = this.getElement(this.selectors.betPlayerCash);
    this.betInput = this.getElement(this.selectors.betInput);
    this.betButton = this.getElement(this.selectors.betButton);
    this.messageModal = this.getElement(this.selectors.messageModal);
  }
}

export const modal = new Modal();