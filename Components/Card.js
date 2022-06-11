export class Card {
  constructor(value, type, name){
    this.valueCard = value;
    this.typeCard = type;
    this.nameCard =  name;
  };

  renderCard = () => {
    const card = document.createElement('div');
    const icon = document.createElement('img');

    for(let i = 0; i < 4; i++) {
      const span = document.createElement('span');
      span.textContent = this.valueCard;
      card.appendChild(span);
    }

    icon.setAttribute('src', `./assets/${this.typeCard}.png`)
    card.setAttribute('class', `card ${this.typeCard}`);
    card.appendChild(icon)

    return card
  }
}