# Accept Coints
- 1st Step

Define a generic item to identify a coin: a pair value weight and size will help the machine to then identify the coin.
We call this pair value (weight, size) the ``signature`` of the coin.

Thus

````
export interface IItem {
    weight: number;
    size: number;
}
````

- 2nd Step


Define the Coin enum with the corresponding value (Penny, Dime, Quarter, Nickel) and Unknown (if identification fails)

Thus

````
  export enum Coin {
    Penny = 'Penny',
    Nickel = 'Nickel',
    Dime = 'Dime',
    Quarter = 'Quarter',
    Unknown = 'Unknown'
  }
````

- 3nd Step

Create the VendingMachine Class with its corresponding methods and attibutes

Attributes: ``display, coinInput``

N.B.: the coinInput and coinOutput are both based on a Typescript Map to associate each type of coin with its corresponding value (number of coin in this collection)

Methods: 
````
constructor, 
insertItem (item to identify as a coin), 
isAcceptedItem (to reject the penny), 
getCoinFromItem (called from isAcceptedItem method), 
getBalance (for the display),  => this fn will use the coinInput collection to compute the balance
and finally the dispensteItem
````

helpers: ``formatAmount that calls createCurrencyString to help for formating the currency string``

To retrieve the right coin from the item candidate we define the following classes (based on the Coin Enum);

````
CoinSizes
CoinWeights
````
Write some tests with Jest and code the functions: checking that all coins (excepted Penny) are accepted with Jest

# Select Product

Then Select Product § we add some availableProducts in the attributes and a new Enum

We Add also a class based on the Product Enum
````
ProductPrices
````

We add a collection (base also on a Typescript Map) to define each product with its corresponding availibity
We need to defined a tempDisplay, (overwritten once used by the regular display) after selecting a product => new attribute tempDisplay in the class VendorMachine

Write the test in Jest and make them pass: first THANK YOU then INSERT COIN message 


# Make Change


We need to define a new attribute ``coinOuptut`` and it will be again a Typescript ``Map<coin, number>``.

Once we dispense a product with more money than needed, we should populate the ``coinOuptut`` from the remaining ``coinInput``

For this we need to convert the remaining cash value (difference between the cash put by the customer and the real price of the product) into several coins.

We defined a dispenseInto method that takes a coinOutput and the decimal (converted using DecimalJS (for exact computation on decimal with JS))
For each type of coins, starting with the most expensive to the less expensive, we retrive the maximum number of this coin (using Floor)
If there is not enough coins of this type, we take care of using the Min between the previous Math.Floor and the number of coins available.
Then we can insert this coins inside the coinOuput.

And so on..
Untill the last necessary Penny.

Write the test in Jest and make this test pass.
Update the previous test to see if returned coins are well populated too.


# Sold Out


This time we are missing a new ``Map<product, numer`` to know at each time we want to dispense an item, if it is still available inside the machine.
We create the productAvailable attribute, and initiate it with arbitrary values inside the constructor.

For instance 

````
this.productAvailable.insert(Product.Cola, 3);
this.productAvailable.insert(Product.Chips, 2);
this.productAvailable.insert(Product.Candy, 10);
````

Create the tests that dispense too many products, Cola products for instance, and the test with Jest that the display is "SOLD OUT"


# Exact Change Only


Know instead of knowing the number of available items for each kind of products (like above), we need to know, as an intrisic property of the vendingMachine Class,
the number of coins available inside the machine, and this each time the user (customer) will ask for a given Product.

Thus, we nee a new ``Map<coin, number>`` property, named availableCoins.

We then initialize the constructor with the following coins:

````
// Imagine that the machine has the following money inside
this.coinAvailable.insert(Coin.Quarter, 40);
this.coinAvailable.insert(Coin.Nickel, 20);
this.coinAvailable.insert(Coin.Dime, 30);
this.coinAvailable.insert(Coin.Penny, 60);
````

and before to display ``INSERT COIN`` we will revert to ``EXACT CHANGE ONLY`` if no coin is inside this Map.
Write the test in Jest and make this test pass.
