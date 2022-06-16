import { UI } from "./UI.js";

class Message extends UI{
  constructor() {
    super();
    this.element = this.getElement(this.selectors.messageModal); //Get message DOM element
  }

  //Creating modal message
  createMessage = (message) => {
    //Checking if child of DOM parent element exists, If it is true, function will remove the previous element
    if(document.querySelector(this.selectors.messageModal).children.length) {
      this.element.removeChild(this.getElement(`${this.selectors.messageModal} p`))
    }
    
    const text = document.createElement('p');
    text.textContent = message;

    this.element.appendChild(text);
  }
}

export const message = new Message();