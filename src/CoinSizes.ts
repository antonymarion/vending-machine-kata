export class CoinSizes {
    static readonly Penny  = new CoinSizes('Penny', 1);
    static readonly Nickel  = new CoinSizes('Nickel', 2);
    static readonly Dime = new CoinSizes('Dime', 3);
    static readonly Quarter  = new CoinSizes('Quarter', 4);

    // private to disallow creating other instances of this type
    private constructor(private readonly key: string, public readonly value: any) {
    }

}
