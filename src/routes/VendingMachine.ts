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

interface MaintenanceUser {
  setProductPrice(product: string, price: number): void;
  adjustProductInventory(product: string, quantity: number): void;
  updateCoinInventory(coin: number, quantity: number): void;
}


class VendingMachine implements MaintenanceUser {
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

}

export default VendingMachine;
