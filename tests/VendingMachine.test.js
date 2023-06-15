"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const VendingMachine_1 = __importDefault(require("../src/routes/VendingMachine"));
// Initialize the vending machine
const coinTypes = [5, 10, 25, 50]; // cents
const productTypes = ['Apple', 'Bread', 'CocaCola'];
const vendingMachine = new VendingMachine_1.default(coinTypes, productTypes);
// Set up the Express app
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Define the REST endpoints
app.post('/user/buy/:product', vendingMachine.buyProduct.bind(vendingMachine));
describe('VendingMachine', () => {
    beforeEach(() => {
        // Reset the inventories before each test
        vendingMachine.initializeInventories();
    });
    test('Buying a product with exact change', () => __awaiter(void 0, void 0, void 0, function* () {
        vendingMachine.setProductPrice('Apple', 25);
        vendingMachine.adjustProductInventory('Apple', 1);
        vendingMachine.updateCoinInventory(25, 1);
        const response = yield (0, supertest_1.default)(app)
            .post('/user/buy/Apple')
            .send({ coins: { 25: 1 } });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Purchase successful. Please collect your product.');
        expect(response.body.data.change).toEqual({});
        // Check that the inventory has been updated
        expect(vendingMachine.productInventory['Apple']).toBe(0);
        expect(vendingMachine.coinInventory[25]).toBe(1);
    }));
    test('Buying a product without enough payment', () => __awaiter(void 0, void 0, void 0, function* () {
        vendingMachine.setProductPrice('Bread', 50);
        vendingMachine.adjustProductInventory('Bread', 1);
        vendingMachine.updateCoinInventory(25, 2);
        const response = yield (0, supertest_1.default)(app)
            .post('/user/buy/Bread')
            .send({ coins: { 25: 1 } });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Insufficient payment. Please insert more coins.');
        // Check that the inventory remains unchanged
        expect(vendingMachine.productInventory['Bread']).toBe(1);
        expect(vendingMachine.coinInventory[25]).toBe(2);
    }));
    test('Buying a product with unavailable change', () => __awaiter(void 0, void 0, void 0, function* () {
        vendingMachine.setProductPrice('CocaCola', 7);
        vendingMachine.adjustProductInventory('CocaCola', 1);
        vendingMachine.updateCoinInventory(5, 5);
        const response = yield (0, supertest_1.default)(app)
            .post('/user/buy/CocaCola')
            .send({ coins: { 9: 1 } });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Exact change is not available. Please insert exact change.');
        // Check that the inventory remains unchanged
        expect(vendingMachine.productInventory['CocaCola']).toBe(1);
        expect(vendingMachine.coinInventory[5]).toBe(5);
    }));
});
