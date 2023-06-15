import express, { Request, Response } from 'express';
import {  SuccessMsgResponse } from '../core/ApiResponse';
import VendingMachine  from './VendingMachine';

const router = express.Router();

// 
/*------------------------------------------------------------------
--------------------------------------------------------------------
---------Create a new instance of the VendingMachine class-----------
------------------------------------------------------------------*/


const coinTypes = [5, 10, 25, 50]; // cents
const productTypes = ['Apple', 'Bread', 'CocaCola'];
const vendingMachine = new VendingMachine(coinTypes, productTypes);


/*------------------------------------------------------------------
--------------------------------------------------------------------
-----Route to set the price for a  product by maintenance user------
------------------------------------------------------------------*/

// 
router.put('/maintenance/product/:product/price/:price', (req: Request, res: Response) => {
  const { product, price } = req.params;
  vendingMachine.setProductPrice(product, parseInt(price, 10));
  return new SuccessMsgResponse('Price successfully set.').send(res);

});

// Route to adjust the product inventory by maintenance user
router.put('/maintenance/product/:product/inventory/:quantity', (req: Request, res: Response) => {
  const { product, quantity } = req.params;
  vendingMachine.adjustProductInventory(product, parseInt(quantity, 10));
  return new SuccessMsgResponse('Product inventory update successfull.').send(res);
});

// Route to update the coin inventory by maintenance user
router.put('/maintenance/coin/:coin/inventory/:quantity', (req: Request, res: Response) => {
  const { coin, quantity } = req.params;
  vendingMachine.updateCoinInventory(parseInt(coin, 10), parseInt(quantity, 10));
  return new SuccessMsgResponse('Coin inventory update successfull.').send(res);
});


/*------------------------------------------------------------------
--------------------------------------------------------------------
---------Route to buy a product by regular user---------------------
------------------------------------------------------------------*/

router.post('/user/buy/:product', (req: Request, res: Response) => {
  vendingMachine.buyProduct(req, res);
});



export default router;
