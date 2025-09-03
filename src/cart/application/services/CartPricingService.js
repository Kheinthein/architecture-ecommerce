/**
 * Cart Application - Service de calcul des prix
 * Service métier pour calculer les totaux du panier (line total, cart total)
 */
import { BusinessRuleError } from '../../../shared-kernel/errors/DomainError.js';
import { Money } from '../../../shared-kernel/value-objects/Money.js';

export class CartPricingService {
  /**
   * Calcule le total d'une ligne de panier (produit × quantité)
   */
  calculateLineTotal(product, quantity) {
    if (!product || !quantity) {
      throw new BusinessRuleError('Product and quantity are required for line total calculation');
    }

    return product.price.multiply(quantity.value);
  }

  /**
   * Calcule le total du panier avec détails par ligne
   */
  calculateCartTotals(cart, products) {
    if (cart.isEmpty()) {
      return {
        lines: [],
        subtotal: Money.zero(),
        total: Money.zero(),
        summary: {
          itemCount: 0,
          totalItems: 0
        }
      };
    }

    const lines = cart.items.map(item => {
      const product = products.find(p => p.id.equals(item.productId));
      
      if (!product) {
        throw new BusinessRuleError(
          `Product not found for line calculation: ${item.productId.value}`,
          'PRODUCT_NOT_FOUND'
        );
      }

      const lineTotal = this.calculateLineTotal(product, item.quantity);

      return {
        productId: item.productId.value,
        productName: product.name,
        quantity: item.quantity.value,
        unitPrice: product.price,
        lineTotal: lineTotal,
        metadata: {
          available: product.isAvailable(),
          hasStock: product.hasStock(item.quantity)
        }
      };
    });

    // Calculer le sous-total (somme des lignes)
    const subtotal = lines.reduce(
      (total, line) => total.add(line.lineTotal),
      Money.zero()
    );

    // Pour l'instant, total = subtotal (pas de taxes/frais)
    const total = subtotal;

    return {
      lines,
      subtotal,
      total,
      summary: {
        itemCount: cart.items.length,
        totalItems: cart.getTotalItems().value,
        currency: subtotal.currency
      }
    };
  }

  /**
   * Calcule les totaux avec application de taxes
   */
  calculateCartTotalsWithTax(cart, products, taxRate = 0.20) {
    const basicTotals = this.calculateCartTotals(cart, products);
    
    if (basicTotals.subtotal.isZero()) {
      return {
        ...basicTotals,
        tax: Money.zero(),
        totalWithTax: Money.zero()
      };
    }

    const taxAmount = basicTotals.subtotal.multiply(taxRate);
    const totalWithTax = basicTotals.subtotal.add(taxAmount);

    return {
      ...basicTotals,
      tax: {
        rate: taxRate,
        amount: taxAmount
      },
      totalWithTax
    };
  }

  /**
   * Vérifie si tous les produits du panier sont disponibles avec stock suffisant
   */
  validateCartAvailability(cart, products) {
    const issues = [];

    for (const item of cart.items) {
      const product = products.find(p => p.id.equals(item.productId));
      
      if (!product) {
        issues.push({
          type: 'PRODUCT_NOT_FOUND',
          productId: item.productId.value,
          message: `Produit ${item.productId.value} non trouvé`
        });
        continue;
      }

      if (!product.isAvailable()) {
        issues.push({
          type: 'PRODUCT_UNAVAILABLE',
          productId: item.productId.value,
          productName: product.name,
          message: `Produit ${product.name} non disponible`
        });
      }

      if (!product.hasStock(item.quantity)) {
        issues.push({
          type: 'INSUFFICIENT_STOCK',
          productId: item.productId.value,
          productName: product.name,
          requested: item.quantity.value,
          available: product.stock.value,
          message: `Stock insuffisant pour ${product.name}. Disponible: ${product.stock.value}, demandé: ${item.quantity.value}`
        });
      }
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  /**
   * Calcule une estimation de livraison (logique métier exemple)
   */
  calculateShippingEstimate(cart, products) {
    const totals = this.calculateCartTotals(cart, products);
    
    // Logique métier exemple : livraison gratuite au-dessus de 50€
    const freeShippingThreshold = Money.euro(50);
    const standardShippingCost = Money.euro(5.99);

    const shippingCost = totals.total.isGreaterThan(freeShippingThreshold)
      ? Money.zero()
      : standardShippingCost;

    const finalTotal = totals.total.add(shippingCost);

    return {
      ...totals,
      shipping: {
        cost: shippingCost,
        isFree: shippingCost.isZero(),
        freeShippingThreshold,
        remainingForFreeShipping: shippingCost.isZero() 
          ? Money.zero() 
          : freeShippingThreshold.subtract(totals.total)
      },
      finalTotal
    };
  }
}
