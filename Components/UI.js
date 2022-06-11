export class UI {
  serviceScreenType = {
    HIDDENCLASS: 'hide',
    VISIBLED: true,
    HIDDEN: false
  }

  selectors = {
    betModal: '[data-bet]',
    betPlayerCash: '[data-playerCash]',
    betInput: '[data-betInput]',
    betButton: '[data-betButton]',
    messageModal: '[data-message]'
  }

  getElement = elementSelector => {
    const element = document.querySelector(elementSelector);
    
    if(!element) throw new Error(`Element ${elementSelector} was not found :(`);

    return element;
  }

  createElement = (parentSelector, childSelector, text = null) => {
    const parentElement = document.querySelector(parentSelector);

    const childElement = document.createElement(childSelector);
    childElement.textContent = text
    parentElement.appendChild(childElement);
  }

  changeScreen = (element, mode) => {
    mode === this.serviceScreenType.VISIBLED
      ? element.classList.remove(this.serviceScreenType.HIDDENCLASS)
    : element.classList.add(this.serviceScreenType.HIDDENCLASS)
  }
}