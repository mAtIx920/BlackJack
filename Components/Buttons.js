import { UI } from "./UI.js";

export class Buttons extends UI {
  constructor(hit, double,stand, insurance) {
    super();
    this.initButtons();
    this.hitAction = hit;
    this.doubleAction = double;
    this.standAction = stand;
    this.insuranceAction = insurance;
    this.addListenersOnButton();
  }

  initButtons = () => {
    this.hitButton = this.createButton('HIT', 'hit');
    this.getElement(this.selectors.hitContener).appendChild(this.hitButton);
    
    this.standButton = this.createButton('STAND', 'stand');
    this.getElement(this.selectors.standContener).appendChild(this.standButton);

    this.doubleButton = this.createButton('DOUBLE', 'double');
    this.getElement(this.selectors.extendContener).appendChild(this.doubleButton);

    this.splitButton = this.createButton('SPLIT', 'split');

    this.insuranceButton = this.createButton('INSURANCE', 'insurance');
  }

  addListenersOnButton = () => {
    this.hitButton.addEventListener('click', this.hitAction);
    this.standButton.addEventListener('click', this.standAction);
    this.doubleButton.addEventListener('click', this.doubleAction);
    this.insuranceButton.addEventListener('click', this.insuranceAction)
  }

  removeListeners = () => {
    this.hitButton.removeEventListener('click', this.hitAction);
    this.standButton.removeEventListener('click', this.standAction);
    this.doubleButton.removeEventListener('click', this.doubleAction);
  }
}