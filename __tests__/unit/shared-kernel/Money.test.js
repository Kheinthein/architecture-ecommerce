/**
 * Tests unitaires - Money Value Object
 * Tests de la logique métier monétaire
 */
import { ValidationError } from '../../../src/shared-kernel/errors/DomainError.js';
import { Money } from '../../../src/shared-kernel/value-objects/Money.js';

describe('Money Value Object', () => {
  describe('Constructor', () => {
    it('should create valid money with positive amount', () => {
      const money = new Money(100, 'EUR');
      
      expect(money.amount).toBe(100);
      expect(money.currency).toBe('EUR');
      expect(money.toString()).toBe('100.00 EUR');
    });

    it('should create money with zero amount', () => {
      const money = Money.zero('USD');
      
      expect(money.amount).toBe(0);
      expect(money.currency).toBe('USD');
      expect(money.isZero()).toBe(true);
    });

    it('should throw ValidationError for negative amount', () => {
      expect(() => new Money(-10, 'EUR'))
        .toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid currency', () => {
      expect(() => new Money(100, 'INVALID'))
        .toThrow(ValidationError);
    });

    it('should throw ValidationError for non-numeric amount', () => {
      expect(() => new Money('abc', 'EUR'))
        .toThrow(ValidationError);
    });
  });

  describe('Arithmetic Operations', () => {
    const money1 = new Money(100, 'EUR');
    const money2 = new Money(50, 'EUR');
    const moneyUSD = new Money(100, 'USD');

    it('should add money with same currency', () => {
      const result = money1.add(money2);
      
      expect(result.amount).toBe(150);
      expect(result.currency).toBe('EUR');
    });

    it('should subtract money with same currency', () => {
      const result = money1.subtract(money2);
      
      expect(result.amount).toBe(50);
      expect(result.currency).toBe('EUR');
    });

    it('should multiply by number', () => {
      const result = money1.multiply(2.5);
      
      expect(result.amount).toBe(250);
      expect(result.currency).toBe('EUR');
    });

    it('should throw error when adding different currencies', () => {
      expect(() => money1.add(moneyUSD))
        .toThrow(ValidationError);
    });

    it('should throw error when subtracting different currencies', () => {
      expect(() => money1.subtract(moneyUSD))
        .toThrow(ValidationError);
    });

    it('should throw error when multiplying by negative number', () => {
      expect(() => money1.multiply(-1))
        .toThrow(ValidationError);
    });
  });

  describe('Comparison Operations', () => {
    const money1 = new Money(100, 'EUR');
    const money2 = new Money(50, 'EUR');
    const money3 = new Money(100, 'EUR');
    const moneyUSD = new Money(100, 'USD');

    it('should check equality correctly', () => {
      expect(money1.equals(money3)).toBe(true);
      expect(money1.equals(money2)).toBe(false);
      expect(money1.equals(moneyUSD)).toBe(false);
    });

    it('should compare amounts with same currency', () => {
      expect(money1.isGreaterThan(money2)).toBe(true);
      expect(money2.isLessThan(money1)).toBe(true);
      expect(money1.isGreaterThanOrEqual(money3)).toBe(true);
      expect(money1.isLessThanOrEqual(money3)).toBe(true);
    });

    it('should throw error when comparing different currencies', () => {
      expect(() => money1.isGreaterThan(moneyUSD))
        .toThrow(ValidationError);
    });
  });

  describe('Factory Methods', () => {
    it('should create EUR money', () => {
      const money = Money.euro(99.99);
      
      expect(money.amount).toBe(99.99);
      expect(money.currency).toBe('EUR');
    });

    it('should create USD money', () => {
      const money = Money.usd(150);
      
      expect(money.amount).toBe(150);
      expect(money.currency).toBe('USD');
    });

    it('should create zero money', () => {
      const money = Money.zero('EUR');
      
      expect(money.amount).toBe(0);
      expect(money.isZero()).toBe(true);
    });
  });

  describe('Formatting', () => {
    it('should format EUR correctly', () => {
      const money = new Money(1234.56, 'EUR');
      
      expect(money.toString()).toBe('1234.56 EUR');
      expect(money.toDisplay()).toBe('1 234,56 €');
    });

    it('should format USD correctly', () => {
      const money = new Money(1234.56, 'USD');
      
      expect(money.toString()).toBe('1234.56 USD');
      expect(money.toDisplay()).toBe('$1,234.56');
    });

    it('should handle zero formatting', () => {
      const money = Money.zero('EUR');
      
      expect(money.toString()).toBe('0.00 EUR');
      expect(money.toDisplay()).toBe('0,00 €');
    });
  });

  describe('JSON Serialization', () => {
    it('should serialize to JSON correctly', () => {
      const money = new Money(99.99, 'EUR');
      const json = money.toJSON();
      
      expect(json).toEqual({
        amount: 99.99,
        currency: 'EUR',
        display: '99,99 €'
      });
    });

    it('should be immutable', () => {
      const money = new Money(100, 'EUR');
      
      expect(() => {
        money.amount = 200;
      }).toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very small amounts', () => {
      const money = new Money(0.01, 'EUR');
      
      expect(money.amount).toBe(0.01);
      expect(money.toString()).toBe('0.01 EUR');
    });

    it('should handle large amounts', () => {
      const money = new Money(999999.99, 'EUR');
      
      expect(money.amount).toBe(999999.99);
      expect(money.toString()).toBe('999999.99 EUR');
    });

    it('should handle precision correctly', () => {
      const money1 = new Money(10.10, 'EUR');
      const money2 = new Money(20.20, 'EUR');
      const result = money1.add(money2);
      
      expect(result.amount).toBe(30.30);
    });
  });
});
