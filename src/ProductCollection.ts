import {Product} from "./interfaces/Product";

export class ProductCollection {
    private products: Map<Product, number>;

    constructor() {
        this.products = new Map<Product, number>();
    }

    insert(product: Product, num: number): void {
        if (this.products.has(product)) {
            this.products.set(product, this.products.get(product)! + num);
        } else {
            this.products.set(product, num);
        }
    }

    dispense(product: Product): void {
        const count = this.count(product);
        if (count >= 0) {
            this.products.set(product, count - 1);
        }
    }

    count(product: Product): number {
        return this.products.get(product) || 0;
    }
}
