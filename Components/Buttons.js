import { UI } from "./UI.js";

export class Buttons extends UI {
  constructor(hit, stand) {
    super();
    this.initButtons();
    this.hitAction = hit;
    this.standAction = stand;
    this.addListenersOnButton();
  }

  initButtons = () => {
    this.hitButton = this.createButton('HIT', 'hit');
    this.getElement(this.selectors.buttons).appendChild(this.hitButton);
    
    this.standButton = this.createButton('STAND', 'stand');
    this.getElement(this.selectors.buttons).appendChild(this.standButton);

    this.doubleButton = this.createButton('DOUBLE', 'double');
    this.splitButton = this.createButton('SPLIT', 'split');
  }

  addListenersOnButton = () => {
    this.hitButton.addEventListener('click', this.hitAction);
    this.standButton.addEventListener('click', this.standAction);
  }

  removeListeners = () => {
    this.hitButton.removeEventListener('click', this.hitAction);
    this.standButton.removeEventListener('click', this.standAction);
  }
}