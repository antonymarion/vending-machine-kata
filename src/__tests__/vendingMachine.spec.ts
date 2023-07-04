import {VendingMachine} from '../VendingMachine';
import {expect, test} from '@jest/globals';
import {CoinWeights} from "./../CoinWeights";
import {CoinSizes} from "./../CoinSizes";
import {Product} from "../interfaces/Product";
import {CoinAmounts} from "../CoinAmounts";

describe('VendingMachine', () => {
    let vendingMachine: VendingMachine;

    beforeEach(() => {
        vendingMachine = new VendingMachine();
    });

    describe('insert item (item = coin candidate to be identified)', () => {

        test('NICKEL Coin - should compute both balance and display', () => {
            // TESTING NICKEL
            vendingMachine.insertItem({weight: CoinWeights.Nickel.value, size: CoinSizes.Nickel.value});
            expect(vendingMachine.getBalance()).toBe(CoinAmounts.Nickel.value);
            expect(vendingMachine.getDisplay()).toBe('0,05 $US');
        });

        test('DIME Coin - should compute both balance and display', () => {
            // TESTING DIME
            vendingMachine.insertItem({weight: CoinWeights.Dime.value, size: CoinSizes.Dime.value});
            expect(vendingMachine.getBalance()).toBe(CoinAmounts.Dime.value);
            expect(vendingMachine.getDisplay()).toBe('0,10 $US');
        });

        test('QUARTER Coin - should compute both balance and display', () => {
            // TESTING QUARTER
            vendingMachine.insertItem({weight: CoinWeights.Quarter.value, size: CoinSizes.Quarter.value});
            expect(vendingMachine.getBalance()).toBe(CoinAmounts.Quarter.value);
            expect(vendingMachine.getDisplay()).toBe('0,25 $US');
        });

        test('PENNY Coin - should not be accepted', () => {
            // TESTING PENNY
            vendingMachine.insertItem({weight: CoinWeights.Penny.value, size: CoinSizes.Penny.value});
            expect(vendingMachine.getBalance()).toBe(0);
            expect(vendingMachine.getCoinReturn()).toBe(0.01);
            expect(vendingMachine.getDisplay()).toBe('INSERT COIN');
        });
    });

    describe('select product', () => {
        beforeEach(() => {
            // Add 0.5 $ in the machine
            for (let i = 0; i < 2; i++) {
                // 0.25 $ each
                vendingMachine.insertItem({weight: CoinWeights.Quarter.value, size: CoinSizes.Quarter.value});
            }
        });
        test('should display PRICE when the selected item is too expensive', () => {
            vendingMachine.getProduct(Product.Cola);
            expect(vendingMachine.getDisplay()).toBe('PRICE 1,00 $US');
            expect(vendingMachine.getDisplay()).toBe('0,50 $US');
            expect(vendingMachine.getBalance()).toBe(0.5);
        });

        test('should display THANK YOU when the selected item is affordable (enough money)', () => {
            vendingMachine.getProduct(Product.Chips);
            expect(vendingMachine.getDisplay()).toBe('THANK YOU');
            expect(vendingMachine.getDisplay()).toBe('INSERT COIN');
        });

        test('should dispense the item, return money, and update display ' +
            '(only if item is available and availableCoins is not empty inside machine)', () => {

            // add some cash in order to have balance = 1$
            vendingMachine.insertItem({
                weight: CoinWeights.Quarter.value,
                size: CoinSizes.Quarter.value
            });
            vendingMachine.insertItem({
                weight: CoinWeights.Quarter.value,
                size: CoinSizes.Quarter.value
            });

            expect(vendingMachine.getBalance()).toBe(1);

            vendingMachine.getProduct(Product.Candy);

            expect(vendingMachine.getDisplay()).toBe('THANK YOU');

            // User trigger the return coins btn
            expect(vendingMachine.getCoinReturn()).toBe(0.35);
            expect(vendingMachine.getBalance()).toBe(0);
            expect(vendingMachine.getDisplay()).toBe('INSERT COIN');
        });


    });

    describe('return coins', () => {
        beforeEach(() => {
            // Add 0.5 $ in the machine
            for (let i = 0; i < 2; i++) {
                // 0.25 $ each
                vendingMachine.insertItem({weight: CoinWeights.Quarter.value, size: CoinSizes.Quarter.value});
            }
        });
        test('should return the inserted coins and update display', () => {

            vendingMachine.pressOnReturnCoinsBtn();
            expect(vendingMachine.getDisplay()).toBe('INSERT COIN');
            expect(vendingMachine.getBalance()).toBe(0);
            expect(vendingMachine.getCoinReturn()).toBe(0.50);
        });
    });


    describe('sold out', () => {

        test('should display SOLD OUT when the selected item is out of stock', () => {
            // Fill in the machine with 1$
            for (let i = 0; i < 4; i++) {
                // 0.25$ each
                vendingMachine.insertItem({weight: CoinWeights.Quarter.value, size: CoinSizes.Quarter.value});
            }

            vendingMachine.getProduct(Product.Cola);
            expect(vendingMachine.getDisplay()).toBe('THANK YOU');

            // Fill in the machine with 1$
            for (let i = 0; i < 4; i++) {
                // 0.25$ each
                vendingMachine.insertItem({weight: CoinWeights.Quarter.value, size: CoinSizes.Quarter.value});
            }
            vendingMachine.getProduct(Product.Cola);

            // Fill in the machine with 1$
            for (let i = 0; i < 4; i++) {
                // 0.25$ each
                vendingMachine.insertItem({weight: CoinWeights.Quarter.value, size: CoinSizes.Quarter.value});
            }
            expect(vendingMachine.getDisplay()).toBe('THANK YOU');

            // Fill in the machine with 1$
            for (let i = 0; i < 4; i++) {
                // 0.25$ each
                vendingMachine.insertItem({weight: CoinWeights.Quarter.value, size: CoinSizes.Quarter.value});
            }
            vendingMachine.getProduct(Product.Cola);
            expect(vendingMachine.getDisplay()).toBe('THANK YOU');

            // There should not be any Cola (3 at init. inside Vending Machine and 3 dispensed)
            // Fill in the machine with 1$
            for (let i = 0; i < 4; i++) {
                // 0.25$ each
                vendingMachine.insertItem({weight: CoinWeights.Quarter.value, size: CoinSizes.Quarter.value});
            }
            expect(vendingMachine.getRemainingAvailableProducts(Product.Cola)).toBe(0)
            vendingMachine.getProduct(Product.Cola);
            expect(vendingMachine.getDisplay()).toBe('SOLD OUT');
        });
    })

    describe('exact change', () => {

        test('should display EXACT CHANGE ONLY if the machine has not enough money inside', () => {
            vendingMachine = new VendingMachine();
            vendingMachine.razCoinAvailables();

            vendingMachine.getProduct(Product.Chips);
            expect(vendingMachine.getDisplay()).toMatch('EXACT CHANGE ONLY');
        });
    });

});
