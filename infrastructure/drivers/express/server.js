/**
 * Infrastructure Express - Serveur HTTP
 * Lance le serveur Express avec injection de dépendances
 */
import { createExpressApp } from './app.js';

export function startServer(diContainer, port = 3000) {
  const app = createExpressApp(diContainer);

  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
      console.log(`🏗️ Architecture: DDD + Clean Architecture`);
      console.log(`📦 Bounded Contexts: Products ✅, Cart ✅`);
      console.log(`💾 Persistance: MEMORY`);
      console.log(`🏥 Health check: http://localhost:${port}/health`);
      console.log(`📚 API Endpoints:`);
      console.log(`   GET    /api/products              - Liste des produits`);
      console.log(`   GET    /api/cart/:cartId          - Récupérer un panier`);
      console.log(`   POST   /api/cart/:cartId/items    - Ajouter au panier`);
      
      resolve(server);
    });
  });
}
