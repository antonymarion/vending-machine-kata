export class CoinWeights {
    static readonly Penny  = new CoinWeights('Penny', 0.025);
    static readonly Nickel  = new CoinWeights('Nickel', 0.05);
    static readonly Dime = new CoinWeights('Dime', 0.1);
    static readonly Quarter  = new CoinWeights('Quarter', 0.2);

    // private to disallow creating other instances of this type
    private constructor(private readonly key: string, public readonly value: any) {
    }

}
