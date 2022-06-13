import { Card } from "./Card.js";

const typeCard = ['clubs', 'diamonds', 'hearts', 'spades'];
const valueCard = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];
const nameCard = ['s', 'k', 'q', 'j', 'a'];

class Deck {
  constructor() {
    this.cards = [];
    this.#createDeck();
    this.shuffleCards();
  }

  #createDeck = () => {
    for(let i = 0; i < typeCard.length; i++) {
      for(let j = 0; j < valueCard.length; j++) {
        if(j < 9) {
          this.cards.push(new Card(valueCard[j], typeCard[i], nameCard[0]));
         } else if(valueCard.length > 9) {
          for(let x = 1; x < nameCard.length; x++) {
            this.cards.push(new Card(valueCard[j++], typeCard[i], nameCard[x]))
          }
        }
      }
    }
  }

  shuffleCards = () => {
    const deck = this.cards;
    const tab = [];

    while(deck.length) {
      const randomNumber = Math.floor(Math.random() * deck.length);

      tab.push(deck[randomNumber])
      deck.splice(randomNumber, 1);
    }

    this.cards = tab;
  }

  getOneCard = () => {
    const card = this.cards.pop();
    return card;
  }
}



export const deck = new Deck();