export class Wallet {
  constructor() {
    this.cash = null;
    this.getMoneyFromDB()
  }

  getMoneyFromDB = async () => {
    new Promise((resolve, reject) => {
      resolve(fetch('http://localhost:3000/money'));
      
    }).then(res => {
      const data = res.json();
      return data;

    }).then(res => {
      const cash = res[0].cash;
      return cash;
      
    }).then( res => {
      this.cash = res
    })
  }

  sendMoneyToDB = async (cashToSend) => {
    const item = {
      cash: cashToSend
    }

    await fetch('http://localhost:3000/money/cash', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    })
  }
}