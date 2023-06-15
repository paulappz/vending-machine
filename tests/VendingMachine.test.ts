import request from 'supertest';
import express from 'express';
import VendingMachine from '../src/routes/VendingMachine';

// Initialize the vending machine
const coinTypes = [5, 10, 25, 50]; // cents
const productTypes = ['Apple', 'Bread', 'CocaCola'];
const vendingMachine = new VendingMachine(coinTypes, productTypes);

// Set up the Express app
const app = express();
app.use(express.json());

// Define the REST endpoints
app.post('/user/buy/:product', vendingMachine.buyProduct.bind(vendingMachine));

describe('VendingMachine', () => {
  beforeEach(() => {
    // Reset the inventories before each test
    vendingMachine.initializeInventories();
  });

  test('Buying a product with exact change', async () => {
    vendingMachine.setProductPrice('Apple', 25);
    vendingMachine.adjustProductInventory('Apple', 1);
    vendingMachine.updateCoinInventory(25, 1);

    const response = await request(app)
      .post('/user/buy/Apple')
      .send({ coins: { 25: 1 } });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Purchase successful. Please collect your product.');
    expect(response.body.data.change).toEqual({});

    // Check that the inventory has been updated
    expect(vendingMachine.productInventory['Apple']).toBe(0);
    expect(vendingMachine.coinInventory[25]).toBe(1);
  });

  test('Buying a product without enough payment', async () => {
    vendingMachine.setProductPrice('Bread', 50);
    vendingMachine.adjustProductInventory('Bread', 1);
    vendingMachine.updateCoinInventory(25, 2);

    const response = await request(app)
      .post('/user/buy/Bread')
      .send({ coins: { 25: 1 } });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Insufficient payment. Please insert more coins.');

    // Check that the inventory remains unchanged
    expect(vendingMachine.productInventory['Bread']).toBe(1);
    expect(vendingMachine.coinInventory[25]).toBe(2);
  });

  test('Buying a product with unavailable change', async () => {
    vendingMachine.setProductPrice('CocaCola', 7);
    vendingMachine.adjustProductInventory('CocaCola', 1);
    vendingMachine.updateCoinInventory(5, 5);

    const response = await request(app)
      .post('/user/buy/CocaCola')
      .send({ coins: { 9: 1 } });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Exact change is not available. Please insert exact change.');

    // Check that the inventory remains unchanged
    expect(vendingMachine.productInventory['CocaCola']).toBe(1);
    expect(vendingMachine.coinInventory[5]).toBe(5);
  });
});
