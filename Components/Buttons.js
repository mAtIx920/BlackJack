import { UI } from "./UI.js";

export class Buttons extends UI {
  constructor(hit, double,stand, split, insurance) {
    super();
    this.hitAction = hit;
    this.doubleAction = double;
    this.standAction = stand;
    this.splitAction = split;
    this.insuranceAction = insurance;
    this.initButtons();
  }

  initButtons = () => {
    //HIT MODE BUTTON OPERATIONS
    this.hitButton = this.createButton('HIT', 'hit');
    this.getElement(this.selectors.hitContener).appendChild(this.hitButton);
    
    //STAND MODE BUTTON OPERATIONS
    this.standButton = this.createButton('STAND', 'stand');
    this.getElement(this.selectors.standContener).appendChild(this.standButton);

    //DOUBLE MODE BUTTON OPERATIONS
    this.doubleButton = this.createButton('DOUBLE', 'double');
    this.getElement(this.selectors.extendContener).appendChild(this.doubleButton);

    //SPLIT MODE BUTTON OPERATIONS
    this.splitButton = this.createButton('SPLIT', 'split');

    //INSURANCE MODE BUTTON OPERATIONS
    this.insuranceButton = this.createButton('INSURANCE', 'insurance');
  }

  //Function adding listeners to mode buttons
  addListenersOnButton = () => {
    this.hitButton.addEventListener('click', this.hitAction);
    this.standButton.addEventListener('click', this.standAction);
    this.doubleButton.addEventListener('click', this.doubleAction);
    this.insuranceButton.addEventListener('click', this.insuranceAction);
    this.splitButton.addEventListener('click', this.splitAction);
  }

  //Function removing listeners from mode buttons
  removeListeners = () => {
    this.hitButton.removeEventListener('click', this.hitAction);
    this.standButton.removeEventListener('click', this.standAction);
    this.doubleButton.removeEventListener('click', this.doubleAction);
    this.insuranceButton.removeEventListener('click', this.insuranceButton);
    this.splitButton.removeEventListener('click', this.splitAction);
  }
}