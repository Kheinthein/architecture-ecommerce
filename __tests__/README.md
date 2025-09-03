# Tests E-commerce DDD

Cette structure de tests suit la pyramide de tests et l'architecture DDD.

## 🏗️ Structure

```
__tests__/
├─ unit/                    # Tests unitaires (70% des tests)
│  ├─ products/             # Tests domaine Products
│  ├─ cart/                 # Tests domaine Cart
│  ├─ orders/               # Tests domaine Orders (à venir)
│  └─ shared-kernel/        # Tests Value Objects communs
├─ integration/             # Tests d'intégration (20% des tests)
├─ functional/              # Tests fonctionnels HTTP (8% des tests)
└─ e2e/                     # Tests bout-à-bout (2% des tests)
```

## 📋 Types de tests

### 🔬 Tests Unitaires (`unit/`)
- **Scope**: Entités, Value Objects, Use Cases purs (sans I/O)
- **Isolation**: Aucune dépendance externe
- **Vitesse**: < 1ms par test
- **Couverture**: Logique métier pure

**Exemples**:
- `Product.reduceStock()` avec différents scénarios
- `Money.add()` avec devises différentes
- `AddToCartUseCase` avec mocks de repositories

### 🔗 Tests d'Intégration (`integration/`)
- **Scope**: Implémentations concrètes via contrats
- **Base**: In-Memory ET SQLite repositories
- **Vitesse**: < 100ms par test
- **Couverture**: Contrats repository, transformations domaine ↔ infrastructure

**Exemples**:
- `ProductRepositoryInMemory` vs `ProductRepositorySqlite`
- Persistance et récupération de `Cart` avec items
- Cohérence données entre domaines

### 🌐 Tests Fonctionnels (`functional/`)
- **Scope**: Routes HTTP + Contrôleurs
- **Infrastructure**: Express réel, repositories test
- **Vitesse**: < 500ms par test
- **Couverture**: API endpoints, sérialisation, codes erreur

**Exemples**:
- `GET /api/products` retourne JSON valide
- `POST /api/cart/:id/items` avec validation
- Gestion erreurs 400/404/409 selon `DomainError`

### 🚀 Tests E2E (`e2e/`)
- **Scope**: Parcours utilisateur complets
- **Infrastructure**: API + Base réelle
- **Vitesse**: < 5s par scenario
- **Couverture**: Workflows métier end-to-end

**Exemples**:
- Parcours achat complet : produits → panier → commande
- Gestion stock insuffisant
- Gestion devise/prix

## 🧪 Conventions de nommage

### Fichiers
```
ProductEntity.test.js        # Tests entité Product
MoneyValueObject.test.js     # Tests Value Object Money
ListProductsUseCase.test.js  # Tests Use Case
ProductRepository.integration.test.js  # Tests intégration
ProductsApi.functional.test.js         # Tests API
CheckoutFlow.e2e.test.js               # Tests E2E
```

### Structure des tests
```javascript
describe('ProductEntity', () => {
  describe('Constructor', () => {
    it('should create valid product with positive values', () => {
      // Given - When - Then
    });
    
    it('should throw ValidationError for negative price', () => {
      // Arrange - Act - Assert
    });
  });

  describe('Business Rules', () => {
    it('should reduce stock when quantity is available', () => {
      // Given - When - Then
    });
  });
});
```

## 🏃 Commandes

```bash
# Tous les tests
npm test

# Par type
npm run test:unit          # Tests unitaires uniquement
npm run test:integration   # Tests d'intégration
npm run test:functional    # Tests fonctionnels
npm run test:e2e          # Tests E2E

# Par domaine
npm run test:products     # Tests domaine Products
npm run test:cart         # Tests domaine Cart

# Avec couverture
npm run test:coverage

# Mode watch
npm run test:watch
```

## 📊 Objectifs de couverture

- **Entités**: 100% (logique métier critique)
- **Value Objects**: 100% (validation fondamentale)
- **Use Cases**: 95% (orchestration métier)
- **Controllers**: 90% (transformation HTTP)
- **Repositories**: 85% (infrastructure)

## 🚨 Règles importantes

1. **Isolation**: Chaque test doit être indépendant
2. **Déterminisme**: Pas de `Math.random()` ou `Date.now()`
3. **Nommage**: Tests en anglais, noms explicites
4. **Données**: Utiliser des fixtures cohérentes
5. **Assertions**: Une seule chose testée par test
6. **Mocks**: Uniquement pour dépendances externes aux Use Cases

## 🔧 Configuration Jest

Configuration dans `jest.config.cjs` pour support ES modules et structure DDD.
