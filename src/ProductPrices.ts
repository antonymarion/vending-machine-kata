export class ProductPrices {
    static readonly Cola  = new ProductPrices('Cola', 1.00);
    static readonly Chips  = new ProductPrices('Chips', 0.50);
    static readonly Candy = new ProductPrices('Candy', 0.65);

    // private to disallow creating other instances of this type
    private constructor(private readonly key: string, public readonly value: any) {
    }

    toString() {
        return this.key;
    }
}
