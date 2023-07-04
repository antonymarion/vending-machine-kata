import {IItem} from "./interfaces/Item";
import {CoinWeights} from "./CoinWeights";
import {CoinSizes} from "./CoinSizes";
import {ProductPrices} from "./ProductPrices";
import {IProduct, Product} from "./interfaces/Product";
import {CoinAmounts} from "./CoinAmounts";
import {ProductCollection} from "./ProductCollection";
import {CoinCollection} from "./CoinCollection";
import {Coin} from "./interfaces/Coin";
import {Decimal} from "decimal.js";

export class VendingMachine {

    // Normal display
    private display: string;
    // Temporary display: displayed once (after call to getProduct)
    private tempDisplay: string;

    // Available products
    private products: IProduct[];

    // Products available in order to display SOLD OUT
    // if not product is remaining in the machine
    private productAvailable: ProductCollection;

    // Coin management: Input (Given by Customer) vs Output (Retrieved by Customer)
    private coinAvailable: CoinCollection;
    private readonly coinInput: CoinCollection;
    private readonly coinOutput: CoinCollection;

    constructor() {


        this.products = [
            {name: Product.Cola, price: ProductPrices.Cola.value},
            {name: Product.Chips, price: ProductPrices.Chips.value},
            {name: Product.Candy, price: ProductPrices.Candy.value},
        ];

        this.display = 'INSERT COIN';
        this.tempDisplay = null;

        // PM
        this.productAvailable = new ProductCollection();

        // Coins Mgt
        this.coinInput = new CoinCollection();
        this.coinAvailable = new CoinCollection();
        this.coinOutput = new CoinCollection();

        // Init.
        this.init();

    }

    private init(): void {

        // Let's say this vending machine stores 3 Colas, 2 Chips and many candies
        this.productAvailable.insert(Product.Cola, 3);
        this.productAvailable.insert(Product.Chips, 2);
        this.productAvailable.insert(Product.Candy, 10);

        // Imagine that the machine has the following money inside
        this.coinAvailable.insert(Coin.Quarter, 40);
        this.coinAvailable.insert(Coin.Nickel, 20);
        this.coinAvailable.insert(Coin.Dime, 30);
        this.coinAvailable.insert(Coin.Penny, 60);
    }

    /**
     * Used in testing only (to flush money from machine)
     */
    public razCoinAvailables() {
        this.coinAvailable = new CoinCollection();
    }

    /**
     * Insert one or more coins (as item = unknown type)
     * Update coinInput with number of items and weights
     * @param item
     */
    public insertItem(item: IItem): void {
        if (this.isAcceptedItem(item)) {
            const coin = this.getCoinFromItem(item);
            // console.log(`inserting 1 coin 🪙 ${coin} into slot `)
            this.coinInput.insert(coin, 1);
        } else {
            // console.log(`returning item ${JSON.stringify(item)} since it is not a valid coin!`)
            this.addToItemReturn(item);
        }
    }

    /**
     * Show 'INSERT COIN' if coinInput is zero
     * Show coinInput.value otherwise
     */
    public getDisplay(): string {

        if (typeof (this.tempDisplay) === 'string') {
            this.display = this.tempDisplay;
            this.tempDisplay = null;
        } else if (this.coinInput.value === 0) {
            if (this.coinAvailable.value === 0) {
                this.display = "EXACT CHANGE ONLY";
            } else {
                this.display = 'INSERT COIN';
            }
        } else {
            this.display = this.formatAmount(this.coinInput.value);
        }
        return this.display;
    }

    /**
     * Refuse item if its weight is the weight && size of a penny
     * @param coin
     * @private
     */
    private isAcceptedItem(coin: IItem): boolean {
        // if it's a penny (recognized thanks to its size and weight), then refuse it!
        if (CoinWeights.Penny.value === coin.weight && CoinSizes.Penny.value === coin.size) {
            return false;
        }
        return true;
    }

    private getItemValue(item: IItem): number {
        const signature = '(' + item.size + ',' + item.weight + ')';
        const availableCoins = [
            'Penny',
            'Nickel',
            'Dime',
            'Quarter'
        ];
        for (let coinName of availableCoins) {
            const currentCoinSignature = '(' + CoinSizes[coinName].value + ',' + CoinWeights[coinName].value + ')';
            if (signature === currentCoinSignature) {
                // Stop once the signature (ie weight and size) matches the current Coin signature
                return CoinAmounts[coinName].value;
            }
        }
        console.log(`unrecognized coin for weigh ${item.weight} and size ${item.size} ...`);
        return 0;
    }

    /**
     * Returns the items since not valid
     * @param item
     * @private
     */
    private addToItemReturn(item: IItem): void {
        const coin = this.getCoinFromItem(item);
        this.coinOutput.insert(coin, 1);
    }

    /**
     * This is a transfer function
     * that retrieve the coin from a given
     * (weight,size) item
     * @param item
     * @private
     */
    private getCoinFromItem(item: IItem): Coin {
        const signature = '(' + item.size + ',' + item.weight + ')';
        const availableCoins = [
            'Penny',
            'Nickel',
            'Dime',
            'Quarter'
        ];
        for (let coinName of availableCoins) {
            const currentCoinSignature = '(' + CoinSizes[coinName].value + ',' + CoinWeights[coinName].value + ')';
            if (signature === currentCoinSignature) {
                return Coin[coinName];
            }
        }
        console.log(`unrecognized coin for weigh ${item.weight} and size ${item.size} ...`);
        return Coin.Unknown;
    }

    private formatAmount(amount: number): string {
        return `${this.createCurrencyString(amount)}`;
    }

    public getBalance(): number {
        return this.coinInput.value;
    }

    /**
     * Call by Customer to choose a given Product (from the availableProducts)
     * @param product
     */
    public getProduct(product: Product): string {
        const chosenProduct = this.products.find((item) => item.name === product);

        this.dispenseItem(Product[chosenProduct.name], chosenProduct.price);

        return this.display;
    }

    /**
     * Used for internal testing only
     */
    public getRemainingAvailableProducts(product: Product): number {
        return this.productAvailable.count(product);
    }

    /**
     * Return products still available in machine
     * Computes changes and give it back
     * @param product
     * @private
     */
    private dispenseItem(product: Product, price: number): void {

        if (this.productAvailable.count(product) === 0) {
            this.tempDisplay = "SOLD OUT";
        } else if (this.coinInput.value >= price) {

            this.productAvailable.dispense(product);
            this.tempDisplay = 'THANK YOU';

            const returnedMoney = this.coinInput.value - price;
            if (returnedMoney > 0) {
                this.coinAvailable.dispenseInto(this.coinOutput, new Decimal(returnedMoney));
            }

            this.coinInput.emptyInto(this.coinAvailable);

        } else {
            if (this.coinAvailable.value === 0) {
                this.tempDisplay = `EXACT CHANGE ONLY: PRICE ${this.formatAmount(price)}`;
            } else {
                this.tempDisplay = `PRICE ${this.formatAmount(price)}`;
            }

        }
    }

    public getCoinReturn(): number {
        return this.coinOutput.value;
    }

    /**
     * Btn used by Customer to get back is money
     */
    public pressOnReturnCoinsBtn(): void {
        this.coinInput.emptyInto(this.coinOutput);
    }

    private createCurrencyString(amount: number): string {
        return new Intl.NumberFormat("fr-FR", {style: "currency", currency: "USD"}).format(amount);
    }

}
