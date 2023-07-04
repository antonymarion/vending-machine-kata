export class CoinAmounts {
    static readonly Penny  = new CoinAmounts('Penny', 0.01);
    static readonly Nickel  = new CoinAmounts('Nickel', 0.05);
    static readonly Dime = new CoinAmounts('Dime', 0.10);
    static readonly Quarter  = new CoinAmounts('Quarter', 0.25);

    // private to disallow creating other instances of this type
    private constructor(private readonly key: string, public readonly value: any) {
    }

}
