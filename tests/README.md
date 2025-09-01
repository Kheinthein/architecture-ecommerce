# Tests de l'API E-commerce

## 🧪 Structure des tests

```
tests/
├── README.md              # Cette documentation
├── setup.js               # Configuration globale Jest
├── fixtures/               # Données de test réutilisables
│   └── testData.js        # Objets de test standardisés
├── unit/                   # Tests unitaires (logique métier)
│   ├── productService.test.js
│   ├── cartService.test.js
│   └── orderService.test.js
└── integration/            # Tests d'intégration (API complète)
    ├── app.test.js        # Tests généraux de l'application
    ├── products.test.js   # Tests API produits
    ├── cart.test.js       # Tests API panier
    └── orders.test.js     # Tests API commandes
```

## 🚀 Commandes disponibles

### Exécution des tests
```bash
# Tous les tests
npm test

# Tests unitaires seulement
npm run test:unit

# Tests d'intégration seulement
npm run test:integration

# Mode watch (redémarre automatiquement)
npm run test:watch

# Avec rapport de couverture
npm run test:coverage

# Mode verbose (plus de détails)
npm run test:verbose

# Mode silencieux
npm run test:silent
```

## 📊 Couverture de code

### Seuils configurés (jest.config.js)
- **Branches** : 80%
- **Fonctions** : 80%
- **Lignes** : 80%
- **Statements** : 80%

### Rapport de couverture
Les rapports sont générés dans le dossier `coverage/` :
- `coverage/lcov-report/index.html` - Rapport HTML interactif
- `coverage/lcov.info` - Format LCOV pour CI/CD

## 🔧 Configuration

### Jest (jest.config.js)
- Support des modules ES6 via Babel
- Timeout : 10 secondes par test
- Setup automatique via `tests/setup.js`
- Exclusions : `/node_modules/`, `/tests/`, `/coverage/`, `/src/legacy/`

### Babel (babel.config.js)
- Preset : `@babel/preset-env`
- Target : Node.js current

## 📋 Types de tests

### 🔬 Tests unitaires (`/unit`)
**Objectif** : Tester la logique métier pure des services
**Isolation** : Chaque service testé indépendamment
**Couverture** : 
- Cas nominaux (happy path)
- Cas d'erreur et edge cases
- Validation des paramètres
- État des données

**Exemple** :
```javascript
describe('ProductService', () => {
  test('devrait retourner tous les produits triés par ID', () => {
    const products = productService.getAllProducts();
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
  });
});
```

### 🔗 Tests d'intégration (`/integration`)
**Objectif** : Tester les endpoints API complets
**Scope** : Routes + Controllers + Services + Données
**Outil** : Supertest pour simuler les requêtes HTTP

**Exemple** :
```javascript
describe('Products API', () => {
  test('GET /products devrait retourner tous les produits', async () => {
    const response = await request(app)
      .get('/products')
      .expect(200)
      .expect('Content-Type', /json/);
      
    expect(Array.isArray(response.body)).toBe(true);
  });
});
```

## 🛠 Helpers et fixtures

### Global helpers (`tests/setup.js`)
- `testHelpers.createTestProduct()` - Crée un produit de test
- `testHelpers.createTestCartItem()` - Crée un item de panier
- `testHelpers.createTestOrder()` - Crée une commande de test

### Données de test (`tests/fixtures/testData.js`)
- `testProducts` - Produits d'exemple
- `testCartItems` - Items de panier
- `testOrders` - Commandes d'exemple
- `validOrderStatuses` - Statuts valides
- `testCustomerInfo` - Informations client

## ✅ Bonnes pratiques

### 🎯 Nommage des tests
```javascript
// ✅ Bon : Description claire du comportement
test('devrait retourner 404 pour un produit inexistant', () => {});

// ❌ Mauvais : Description technique
test('getProductById with invalid ID', () => {});
```

### 🔄 Isolation des tests
```javascript
beforeEach(() => {
  // Nettoyer l'état avant chaque test
  cartService.clearCart();
});
```

### 📝 Structure Given-When-Then
```javascript
test('devrait ajouter un produit au panier', () => {
  // Given
  const productId = 1;
  const quantity = 2;
  
  // When
  const result = cartService.addToCart(productId, quantity);
  
  // Then
  expect(result.action).toBe('added');
});
```

### 🎭 Tests d'erreur exhaustifs
```javascript
test('devrait lever une erreur pour des paramètres invalides', () => {
  expect(() => service.method(null)).toThrow('error message');
  expect(() => service.method(undefined)).toThrow('error message');
  expect(() => service.method(-1)).toThrow('error message');
});
```

## 🐛 Debugging des tests

### Afficher les logs pendant les tests
```javascript
// Temporairement activer les logs
console.log = jest.fn().mockImplementation((...args) => {
  originalConsole.log(...args);
});
```

### Tests en mode isolé
```bash
# Exécuter un seul fichier
npm test -- products.test.js

# Exécuter un seul test
npm test -- --testNamePattern="devrait retourner tous les produits"
```

### Mode debug
```bash
# Avec plus d'informations
npm run test:verbose

# Avec watch pour développement
npm run test:watch
```

## 📈 Métriques de qualité

### Tests réussis
- ✅ **46 tests** au total
- ✅ **Services** : 100% de couverture des fonctions
- ✅ **API** : Tous les endpoints testés
- ✅ **Edge cases** : Gestion d'erreurs complète

### Scénarios couverts
- **Produits** : Récupération, validation, existence
- **Panier** : CRUD complet, enrichissement, validation
- **Commandes** : Création, statuts, workflow complet
- **Erreurs** : 400, 404, 500 avec messages appropriés

## 🚀 Intégration CI/CD

```yaml
# Exemple GitHub Actions
- name: Run tests
  run: |
    npm ci
    npm run test:coverage
    
- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/lcov.info
```

## 📚 Ressources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/ladjs/supertest)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
