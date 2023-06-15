# Vending Machine Assignment by Paul Oluyege
### Pariti


# Project Highlights 
1. Node.js
2. Express.js
3. Typescript
4. Tests
5. Docker

## How to build and run this project

* Install using Docker Compose [**Recommended Method**] 
    * Unzip vendingMachine.zip into a folder
    * Install Docker [Find Instructions Here](https://docs.docker.com/install/).
    * Execute `docker build -t vending-machine:latest .`  and `sudo docker run --env-file=.env vending-machine` in terminal from the repo directory.
    * You will be able to access the api from http://localhost:3000
    * *If having any issue* then make sure 3000 port is not occupied else provide a different port in **.env** file.
    * *If having any issue* then make sure 27017 port is not occupied else provide a different port in **.env** file.
 * Run The Tests
    * Install node.js and npm on your local machine.
    * From the root of the project executes in terminal `npm install`.
    * *Use the latest version of node on the local machine if the build fails*.
    * To run the tests execute `npm test`.
 * Install Without Docker [**2nd Method**]
    * Execute `npm start` and You will be able to access the API from http://localhost:3000
    * To run the tests execute `npm test`.
    
  
 ## Project Directory Structure
 ```
├── src
│   ├── server.ts
│   ├── app.ts
│   ├── config.ts
│   ├── core
│   │   ├── ApiError.ts
│   │   ├── ApiResponse.ts
│   │   └── Logger.ts
│   ├── routes
│   │   ├── index.ts
│   │   └── VendingMachine.ts
├── tests
│   ├── .env.test
│   ├── setup.ts
│   └── VendingMachine.test.ts
├── .env
├── .gitignore
├── .dockerignore
├── .eslintrc
├── .eslintignore
├── .prettierrc
├── .prettierignore
├── Dockerfile
├── package-lock.json
├── package.json
├── jest.config.js
└── tsconfig.json
 ```


 ## API Information  
 
 ### Assumptions (Data saved in memory)
  ```
    coinTypes = [5, 10, 25, 50]; // cents
    productTypes = ['Apple', 'Bread', 'CocaCola'];
  
  ```
  
 ##   Maintenance User
 
* Set the price for a  product.
    * Method and Headers
    ** Route : /maintenance/product/:product/price/:price **
    ```
    PUT /maintenance/product/Apple/price/10 HTTP/1.1
    Host: localhost:3000
    Content-Type: application/json
    ```
    * Request Body
    ``` none ```
    * Response Body: 200
    ```json
    {
    "statusCode": "10000",
    "message": "Price successfully set."
    }
    ```

* Adjust the number of items available for a product slot.
    * Method and Headers
    ** Route : /maintenance/product/:product/inventory/:quantity **
    ```
    PUT /maintenance/product/Apple/inventory/2 HTTP/1.1
    Host: localhost:3000
    Content-Type: application/json
    ```
    * Request Body
    ``` none ```
    * Response Body: 200
    ```json
    {
    "statusCode": "10000",
    "message": "Product inventory update successfull."
    }
    ```


* Update the coins available in the machine for each type of coin.
    * Method and Headers
    ** Route : /maintenance/product/:product/inventory/:quantity **
    ```
    PUT /maintenance/coin/5/inventory/2 HTTP/1.1
    Host: localhost:3000
    Content-Type: application/json
    ```
    * Request Body
    ``` none ```
    * Response Body: 200
    ```json
    {
    "statusCode": "10000",
    "message": "Coin inventory update successfull."
    }
    ```


 ##   Regular User
 
* Set the price for a  product.
    * Method and Headers
    ** Route : /user/buy/:product **
    ```
    POST /user/buy/Apple HTTP/1.1
    Host: localhost:3000
    Content-Type: application/json
    ```
    * Request Body
    ``` 
    {
     "coins": { "15" : 1 } 
    }

    ```
    * Response Body: 200
    ```json
    {
    "statusCode": "10000",
    "message": "Purchase successful. Please collect your product.",
    "data": {
        "change": {
            "5": 1
            }
        }
    }
    ```

    * Response Body: 400
    ```json
    {
    "statusCode": "10001",
    "message": "Invalid product selection."
    }
    ```
    
    * Response Body: 400
    ```json
    {
    "statusCode": "10001",
    "message": "Product is out of stock."
    }
    ```
