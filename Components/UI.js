export class UI {
  serviceScreenType = {
    HIDDENCLASS: 'hide',
    VISIBLED: true,
    HIDDEN: false
  }

  //Here are all selectors DOM elements
  selectors = {
    betModal: '[data-bet]',
    betPlayerCash: '[data-playerCash]',
    betInput: '[data-betInput]',
    betButton: '[data-betButton]',
    messageModal: '[data-message]',
    playerCards: '[data-playerCards]',
    dealerCards: '[data-dealerCards]',
    gameBetInfo: '[data-gameBetInfo]',
    playerPoints: '[data-playerPoints]',
    dealerPoints: '[data-dealerPoints]',
    multiplier: '[data-multiplier]',
    //Contener of buttons elements
    hitContener: '[data-hitContener]',
    extendContener: '[data-extendContener]',
    standContener: '[data-standContener]',
    //End modal elements
    endModal: '[data-end]',
    endHeader: '[data-end-header]',
    betInfo: '[data-betInfo]',
    playerPointsInfo: '[data-playerPointsInfo]',
    multiplierInfo: '[data-multiplierInfo]',
    dealerPointsInfo: '[data-dealerPointsInfo]',
    textInfo: '[data-textInfo]',
    againButton: '[data-playAgain]',
    backButton: '[data-back]'
  }

  //Function allowing get DOM elements to js
  getElement = elementSelector => {
    const element = document.querySelector(elementSelector);
    
    if(!element) throw new Error(`Element ${elementSelector} was not found :(`); //Checking if DOM element exists

    return element;
  }

  //Function creating new element in DOM
  createElement = (parentSelector, childSelector, text = null) => {
    const parentElement = document.querySelector(parentSelector);

    const childElement = document.createElement(childSelector);
    childElement.textContent = text;
    parentElement.appendChild(childElement);
  }

  //Function creating buttons
  createButton = (text, classText) => {
    if(!text.length || !classText.length) new Error('Text must be type in button element');

    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add(classText);

    return button;
  }

  //Function answering for changing modal messages
  changeScreen = (element, mode) => {
    mode === this.serviceScreenType.VISIBLED
      ? element.classList.remove(this.serviceScreenType.HIDDENCLASS)
    : element.classList.add(this.serviceScreenType.HIDDENCLASS);
  }
}