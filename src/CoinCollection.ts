import {Coin} from "./interfaces/Coin";
import {CoinAmounts} from "./CoinAmounts";
import {Decimal} from 'decimal.js';

export class CoinCollection {
    private readonly coins: Map<Coin, number>;
    public id: number;

    constructor() {
        this.id = Math.random();
        this.coins = new Map<Coin, number>();
    }

    get value(): number {
        return (
            this.count(Coin.Quarter) * this.coinValue(Coin.Quarter) +
            this.count(Coin.Dime) * this.coinValue(Coin.Dime) +
            this.count(Coin.Nickel) * this.coinValue(Coin.Nickel) +
            this.count(Coin.Penny) * this.coinValue(Coin.Penny)
        );
    }

    insert(coin: Coin, num: number): void {
        if (this.coins.has(coin)) {
            this.coins.set(coin, this.coins.get(coin)! + num);
        } else {
            this.coins.set(coin, num);
        }
    }

    private remove(coin: Coin, num: number): void {
        if (this.coins.has(coin)) {
            this.coins.set(coin, this.coins.get(coin)! - Math.min(num, this.coins.get(coin)!));
        }
    }

    emptyInto(collection: CoinCollection): void {
        for (const [coin, count] of this.coins) {
            collection.insert(coin, count);
        }
        this.coins.clear();
    }

    dispenseInto(collection: CoinCollection, amount: Decimal): void {
        let numQuartersDispensed = this.dispenseCoinInto(collection, Coin.Quarter, amount.toNumber());
        amount = amount.minus((new Decimal(numQuartersDispensed)).mul(new Decimal(this.coinValue(Coin.Quarter))));

        let numDimesDispensed = this.dispenseCoinInto(collection, Coin.Dime, amount.toNumber());
        amount = amount.minus((new Decimal(numDimesDispensed)).mul(new Decimal(this.coinValue(Coin.Dime))));

        let numNickelsDispensed = this.dispenseCoinInto(collection, Coin.Nickel, amount.toNumber());
        amount = amount.minus((new Decimal(numNickelsDispensed)).mul(new Decimal(this.coinValue(Coin.Nickel))));

        let numPenniesDispensed = this.dispenseCoinInto(collection, Coin.Penny, amount.toNumber());
        amount = amount.minus((new Decimal(numPenniesDispensed)).mul(new Decimal(this.coinValue(Coin.Penny))));
    }

    count(coin: Coin): number {
        return this.coins.get(coin) || 0;
    }

    private coinValue(coin: Coin): number {
        return CoinAmounts[coin].value;
    }

    private dispenseCoinInto(collection: CoinCollection, coin: Coin, amount: number): number {
        const pEntiere = Math.floor(amount / this.coinValue(coin));
        const coinValue = this.count(coin);

        // We retrieve not more than the available coins inside the machine
        // Hence Math.min
        const numDispensed = Math.min(pEntiere, coinValue);
        collection.insert(coin, numDispensed);
        this.remove(coin, numDispensed);

        return numDispensed;
    }
}

