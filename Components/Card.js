let checkNumber = 0;

export class Card {
  constructor(value, type, name){
    this.valueCard = value;
    this.typeCard = type;
    this.nameCard =  name;
    this.checkNumber = null;
  };

  renderCard = () => {
    const contener = document.createElement('div');
    const card = document.createElement('div');
    const frontCard = document.createElement('div');
    const backCard = document.createElement('div');
    const icon = document.createElement('img');

    if(this.nameCard !== 's') {
      var currentNameCard = null;

      switch(this.nameCard) {
        case 'k':
          currentNameCard = 'king';
        break;
        case 'q':
          currentNameCard = 'queen';
        break;
        case 'j':
          currentNameCard = 'jack';
        break;
        case 'a':
          currentNameCard = 'as';
        break;
        default: new Error(`Element ${currentNameCard} was not found`);
      }
      icon.setAttribute('src', `./assets/${currentNameCard}.png`);

      for(let i = 0; i < 4; i++) {
        const span = document.createElement('span');

        if(i === 1 || i === 2) {
          if(currentNameCard === 'king') {
            span.textContent = 'K';
          } else if(currentNameCard === 'queen') {
            span.textContent = 'Q';
          } else if(currentNameCard === 'jack') {
            span.textContent = 'J';
          } else if(currentNameCard === 'as') {
            span.textContent = 'A';;
          }
          frontCard.appendChild(span);

          continue;
        }
        
        const smallIcon = document.createElement('img');

        smallIcon.setAttribute('src', `./assets/${this.typeCard}.png`);
        span.appendChild(smallIcon);
        frontCard.appendChild(span);  
      }  
    } else {

      for(let i = 0; i < 4; i++) {
        const span = document.createElement('span');
        span.textContent = this.valueCard;
        frontCard.appendChild(span);
      }

      icon.setAttribute('src', `./assets/${this.typeCard}.png`);
    } 

    this.checkNumber = checkNumber++;
   
    contener.setAttribute('class', 'contener');
    card.setAttribute('class', `card ${this.typeCard}`);
    frontCard.setAttribute('class', 'frontCard');
    backCard.setAttribute('class', 'backCard');
    frontCard.appendChild(icon);
    contener.appendChild(card);
    card.appendChild(frontCard)
    card.appendChild(backCard);

    card.addEventListener('click', () => this.reverseCard(this.checkNumber))

    return contener
  }

  reverseCard = cardNumber => {
    const cards = document.querySelectorAll('.table div div.card');

    cards.forEach((card, index) => {
      if(index === cardNumber) {
        const tabClassList = card.getAttribute('class').split(' ');
      
        if(tabClassList.includes('reverse')) return;

        card.classList.add('reverse');

        setTimeout(() => card.classList.remove('reverse'), 1000);
      }
    });
  }
}