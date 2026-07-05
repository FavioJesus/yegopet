import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PRODUCT_CATEGORIES, PRODUCTS, Product } from '../../data/products';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-store',
  imports: [RouterLink],
  templateUrl: './store.html',
  styleUrl: './store.css',
})
export class StoreComponent {
  readonly cart = inject(CartService);
  readonly categories = PRODUCT_CATEGORIES;
  readonly activeCategory = signal<string>('Todos');
  readonly selectedProduct = signal<Product | null>(null);
  readonly cartOpen = signal(false);
  readonly pendingProductId = signal<string | null>(null);
  readonly pendingQuantity = signal(1);

  readonly visibleProducts = computed(() => this.activeCategory() === 'Todos'
    ? PRODUCTS
    : PRODUCTS.filter((product) => product.category === this.activeCategory()));

  readonly checkoutHref = computed(() => {
    const lines = this.cart.lines();
    const body = lines.length
      ? `${lines.map((line) => `• ${line.product.name} x${line.quantity} — S/ ${(line.quantity * line.product.price).toFixed(2)}`).join('\n')}\nTotal: S/ ${this.cart.total().toFixed(2)}`
      : 'Quiero hacer un pedido en la tienda.';
    return `https://wa.me/51999999999?text=${encodeURIComponent(`Hola Yego Pet 🐾\n${body}`)}`;
  });

  selectCategory(category: string): void { this.activeCategory.set(category); }
  openSpecs(product: Product): void { this.selectedProduct.set(product); }
  closeSpecs(): void { this.selectedProduct.set(null); }

  startAdd(productId: string): void {
    this.pendingProductId.set(productId);
    this.pendingQuantity.set(1);
  }

  changePending(delta: number): void {
    this.pendingQuantity.update((quantity) => Math.max(1, quantity + delta));
  }

  confirmAdd(productId: string): void {
    this.cart.add(productId, this.pendingQuantity());
    this.pendingProductId.set(null);
    this.cartOpen.set(true);
  }
}
