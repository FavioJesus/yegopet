import { Injectable, computed, signal } from '@angular/core';
import { PRODUCTS } from '../data/products';

export interface CartLine {
  product: (typeof PRODUCTS)[number];
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly storageKey = 'yegopet-cart-v1';
  private readonly quantities = signal<Record<string, number>>(this.load());

  readonly lines = computed<CartLine[]>(() => Object.entries(this.quantities())
    .map(([id, quantity]) => ({ product: PRODUCTS.find((product) => product.id === id), quantity }))
    .filter((line): line is CartLine => Boolean(line.product)));
  readonly count = computed(() => this.lines().reduce((sum, line) => sum + line.quantity, 0));
  readonly total = computed(() => this.lines().reduce((sum, line) => sum + line.quantity * line.product.price, 0));

  add(productId: string, quantity = 1): void {
    this.update(productId, (this.quantities()[productId] ?? 0) + quantity);
  }

  increment(productId: string): void { this.add(productId); }

  decrement(productId: string): void {
    this.update(productId, (this.quantities()[productId] ?? 0) - 1);
  }

  remove(productId: string): void { this.update(productId, 0); }

  private update(productId: string, quantity: number): void {
    const next = { ...this.quantities() };
    if (quantity > 0) next[productId] = quantity;
    else delete next[productId];
    this.quantities.set(next);
    if (typeof localStorage !== 'undefined') localStorage.setItem(this.storageKey, JSON.stringify(next));
  }

  private load(): Record<string, number> {
    if (typeof localStorage === 'undefined') return {};
    try { return JSON.parse(localStorage.getItem(this.storageKey) ?? '{}'); }
    catch { return {}; }
  }
}
