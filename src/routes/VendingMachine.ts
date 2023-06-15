import { Request, Response } from 'express';

interface CoinInventory {
  [coin: number]: number;
}

interface ProductInventory {
  [product: string]: number;
}

interface ProductPrices {
  [product: string]: number;
}


interface RegularUser {
  buyProduct(req: Request, res: Response): void;
}

interface MaintenanceUser {
  setProductPrice(product: string, price: number): void;
  adjustProductInventory(product: string, quantity: number): void;
  updateCoinInventory(coin: number, quantity: number): void;
}


class VendingMachine implements RegularUser, MaintenanceUser {
  public coinInventory: CoinInventory = {};
  public productInventory: ProductInventory = {};
  public productPrices: ProductPrices = {};

  constructor(
    private coinTypes: number[],
    private productTypes: string[],
  ) {
    this.initializeInventories();
  }

  public initializeInventories() {
    this.productTypes.forEach((product) => {
      this.productInventory[product] = 0;
      this.productPrices[product] = 0;
    });

    this.coinTypes.forEach((coin) => {
      this.coinInventory[coin] = 0;
    });
  }


  setProductPrice(product: string, price: number) {
    if (this.productPrices.hasOwnProperty(product)) {
    }
  }

  adjustProductInventory(product: string, quantity: number) {
    if (this.productInventory.hasOwnProperty(product)) {
      this.productInventory[product] += quantity;
    }
  }

  updateCoinInventory(coin: number, quantity: number) {
    if (this.coinInventory.hasOwnProperty(coin.toString())) {
      this.coinInventory[coin] += quantity;    
    }
  }

  buyProduct(req: Request, res: Response) {
    const { product } = req.params;
    const coins: CoinInventory = req.body.coins;

    if (
      this.productInventory.hasOwnProperty(product) &&
      this.productPrices.hasOwnProperty(product)
    ) {

      const productCount = this.productInventory[product];
      if (productCount === 0) {
        res.status(400).json({ message: 'Product is out of stock.' });
        return;
      }      

      const price = this.productPrices[product];
      if (price === 0) {
        res.status(400).json({ message: 'Product price is not set, contact admin.' });
        return;
      }

      const totalPayment = Object.keys(coins).reduce(
        (sum, coin) => sum + Number(coin) * coins[coin],
        0
      );

      if (totalPayment < price) {
        res.status(400).json({ message: 'Insufficient payment. Please insert more coins.' });
        return;
      }

      const changeDue = totalPayment - price;
      if (!this.isExactChangeAvailable(changeDue)) {
        res.status(400).json({ message: 'Exact change is not available. Please insert exact change.' });
        return;
      }

      this.productInventory[product]--;
      const changeCoins = this.returnChange(changeDue);
      res.json({ message: 'Purchase successful. Please collect your product.', change: changeCoins });
    } else {
      res.status(400).json({ message: 'Invalid product selection.' });
    }
  }

  private isExactChangeAvailable(changeDue: number): boolean {
    const sortedCoins = this.coinTypes.sort((a, b) => b - a);
    let remainingChange = changeDue;

    for (const coin of sortedCoins) {
      while (remainingChange >= coin && this.coinInventory[coin] > 0) {
        remainingChange -= coin;
      }
    }

    return remainingChange === 0;
  }

  private returnChange(changeDue: number): CoinInventory {
    const changeCoins: CoinInventory = {};

    const sortedCoins = this.coinTypes.sort((a, b) => b - a);
    console.log(sortedCoins)
    for (const coin of sortedCoins) {
      while (changeDue >= coin && this.coinInventory[coin] > 0) {
        if (!changeCoins.hasOwnProperty(coin.toString())) {
          changeCoins[coin] = 0;
        }
  
        changeCoins[coin]++;
        changeDue -= coin;
        this.coinInventory[coin]--;
      }
    }
  
    return changeCoins;
  }
}

export default VendingMachine;
