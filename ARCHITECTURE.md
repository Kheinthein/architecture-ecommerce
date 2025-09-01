# Architecture de l'API E-commerce

## 🏗️ Structure du projet

L'API a été refactorisée selon une architecture en couches séparées pour améliorer la maintenabilité et la séparation des responsabilités.

```
src/
├── index.js                 # Point d'entrée principal
├── routes/                  # Définition des endpoints
│   ├── productRoutes.js     # Routes pour les produits
│   ├── cartRoutes.js        # Routes pour le panier
│   └── orderRoutes.js       # Routes pour les commandes
├── controllers/             # Gestion des requêtes HTTP
│   ├── productController.js # Controller des produits
│   ├── cartController.js    # Controller du panier
│   └── orderController.js   # Controller des commandes
├── services/                # Logique métier pure
│   ├── productService.js    # Service des produits
│   ├── cartService.js       # Service du panier
│   └── orderService.js      # Service des commandes
└── legacy/                  # Anciens fichiers (sauvegarde)
    ├── products.js
    ├── cart.js
    └── orders.js
```

## 📋 Responsabilités par couche

### 🛣️ Routes (`/routes`)
- **Responsabilité** : Définition des endpoints et validation des paramètres d'URL
- **Contenu** : Déclaration des routes Express et délégation aux controllers
- **Exemple** : `GET /products/:id` → `productController.getProductById`

### 🎛️ Controllers (`/controllers`)
- **Responsabilité** : Orchestration des services et gestion des réponses HTTP
- **Contenu** : Validation des données, appels aux services, formatting des réponses
- **Gestion** : Codes de statut HTTP, messages d'erreur, structure des réponses JSON

### ⚙️ Services (`/services`)
- **Responsabilité** : Logique métier pure et gestion des données
- **Contenu** : Algorithmes business, manipulation des données, validation métier
- **Indépendance** : Aucune dépendance HTTP/Express, 100% réutilisable

## 🚀 Endpoints disponibles

### Produits
- `GET /products` - Liste tous les produits
- `GET /products/:id` - Récupère un produit par ID

### Panier
- `GET /cart` - Affiche le contenu du panier (enrichi avec détails produits)
- `POST /cart` - Ajoute un produit au panier
- `PUT /cart/:productId` - Met à jour la quantité d'un produit
- `DELETE /cart/:productId` - Supprime un produit du panier
- `DELETE /cart` - Vide complètement le panier

### Commandes
- `GET /orders` - Liste toutes les commandes (avec filtre optionnel `?status=`)
- `GET /orders/:id` - Récupère une commande par ID (enrichie avec totaux)
- `POST /orders` - Crée une commande à partir du panier actuel
- `PUT /orders/:id/status` - Met à jour le statut d'une commande

## ✨ Améliorations apportées

### 🔒 Validation robuste
- Validation des types et valeurs dans les controllers
- Messages d'erreur détaillés et cohérents
- Gestion d'erreurs centralisée avec try/catch

### 📊 Enrichissement des données
- Panier enrichi avec informations produits et sous-totaux
- Commandes avec calcul automatique des totaux
- Réponses structurées avec métadonnées utiles

### 🏷️ Gestion avancée des statuts
- Statuts de commandes : `PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`
- Validation des transitions de statuts
- Timestamps automatiques (`createdAt`, `updatedAt`)

### 💡 Fonctionnalités ajoutées
- Filtrage des commandes par statut
- Calcul automatique des totaux panier/commandes
- Gestion des quantités avec mise à jour/suppression automatique
- Vérification de l'existence des produits avant ajout au panier

## 🧪 Comment tester

1. **Démarrer le serveur** :
   ```bash
   npm run dev
   ```

2. **Tester les endpoints** avec curl, Postman ou tout client HTTP :
   ```bash
   # Récupérer les produits
   GET http://localhost:3000/products
   
   # Ajouter au panier
   POST http://localhost:3000/cart
   Content-Type: application/json
   {"productId": 1, "quantity": 2}
   
   # Créer une commande
   POST http://localhost:3000/orders
   Content-Type: application/json
   {"customerInfo": {"name": "John Doe", "email": "john@example.com"}}
   ```

## 🔄 Avantages de cette architecture

1. **Séparation des responsabilités** : Chaque couche a un rôle bien défini
2. **Maintenabilité** : Code plus facile à comprendre et modifier
3. **Testabilité** : Services purement fonctionnels, faciles à tester
4. **Scalabilité** : Structure prête pour ajout de nouvelles fonctionnalités
5. **Réutilisabilité** : Services utilisables dans d'autres contextes
6. **Gestion d'erreurs** : Centralisation et cohérence des erreurs

## 📈 Prochaines étapes suggérées

- [ ] Ajouter une base de données (MongoDB/PostgreSQL)
- [ ] Implémenter l'authentification JWT
- [ ] Ajouter des tests unitaires et d'intégration
- [ ] Mettre en place la validation avec Joi/Zod
- [ ] Ajouter la pagination pour les listes
- [ ] Implémenter le logging structuré
- [ ] Ajouter la documentation Swagger/OpenAPI

