//Tests pour l'API E-commerce V0


const BASE_URL = 'http://localhost:3000';

// Fonction utilitaire pour faire des requêtes
async function request(method, path, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${path}`, options);
    const contentType = response.headers.get('content-type');
    let data = null;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    return { status: response.status, data };
  } catch (error) {
    throw new Error(`Erreur réseau: ${error.message}`);
  }
}

// Fonction d'assertion simple
function assert(condition, message) {
  if (!condition) {
    throw new Error(` ÉCHEC: ${message}`);
  }
  console.log(` ${message}`);
}

async function runTests() {
  console.log(' === TESTS API E-COMMERCE V0 ===\n');

  try {
    // Préparation: Vider le panier avant les tests
    console.log(' Préparation: Vidage du panier');
    await request('DELETE', '/cart');
    console.log('   Panier vidé pour commencer les tests\n');

    // Test 1: Route d'accueil
    console.log(' Test 1: Route d\'accueil');
    const home = await request('GET', '/');
    assert(home.status === 200, 'GET / retourne 200');
    assert(typeof home.data === 'string', 'GET / retourne du texte');
    console.log(`   Réponse: "${home.data}"\n`);

    // Test 2: GET /products
    console.log(' Test 2: Liste des produits');
    const products = await request('GET', '/products');
    assert(home.status === 200, 'GET /products retourne 200');
    assert(Array.isArray(products.data), 'GET /products retourne un tableau');
    assert(products.data.length >= 2, 'Au moins 2 produits dans le seed');
    assert(products.data[0].id <= products.data[1].id, 'Produits triés par id');
    console.log(`   ${products.data.length} produits trouvés\n`);

    // Test 3: GET /cart (vide initialement)
    console.log(' Test 3: Panier initial');
    const emptyCart = await request('GET', '/cart');
    assert(emptyCart.status === 200, 'GET /cart retourne 200');
    assert(Array.isArray(emptyCart.data), 'GET /cart retourne un tableau');
    console.log(`   Panier initial: ${emptyCart.data.length} items\n`);

    // Test 4: POST /cart (données valides)
    console.log(' Test 4: Ajout au panier (valide)');
    const addValid = await request('POST', '/cart', { productId: 1, quantity: 2 });
    assert(addValid.status === 200, 'POST /cart valide retourne 200');
    assert(addValid.data.message === 'Produit ajouté au panier', 'Message de succès correct');
    console.log(`   Ajout réussi\n`);

    // Test 5: POST /cart (données invalides)
    console.log(' Test 5: Ajout au panier (invalide)');
    const addInvalid = await request('POST', '/cart', { productId: -1 });
    assert(addInvalid.status === 400, 'POST /cart invalide retourne 400');
    assert(addInvalid.data.error === 'productId et quantity sont requis', 'Message d\'erreur correct');
    console.log(`   Validation fonctionnelle\n`);

    // Test 6: GET /cart (avec contenu)
    console.log(' Test 6: Panier avec contenu');
    const cartWithItems = await request('GET', '/cart');
    assert(cartWithItems.status === 200, 'GET /cart retourne 200');
    assert(cartWithItems.data.length > 0, 'Panier contient des items');
    assert(cartWithItems.data[0].productId === 1, 'ProductId correct');
    assert(cartWithItems.data[0].quantity === 2, 'Quantity correcte');
    console.log(`   ${cartWithItems.data.length} item(s) dans le panier\n`);

    // Test 7: GET /orders (vide initialement)
    console.log(' Test 7: Commandes initiales');
    const emptyOrders = await request('GET', '/orders');
    assert(emptyOrders.status === 200, 'GET /orders retourne 200');
    assert(Array.isArray(emptyOrders.data), 'GET /orders retourne un tableau');
    console.log(`   ${emptyOrders.data.length} commande(s) initiale(s)\n`);

    // Test 8: POST /orders
    console.log(' Test 8: Création de commande');
    const createOrder = await request('POST', '/orders');
    assert(createOrder.status === 200, 'POST /orders retourne 200');
    assert(typeof createOrder.data.id === 'number', 'ID de commande généré');
    assert(createOrder.data.status === 'PENDING', 'Status PENDING');
    assert(createOrder.data.createdAt, 'CreatedAt présent');
    console.log(`   Commande #${createOrder.data.id} créée\n`);

    // Test 9: Vérification que le panier n'est PAS vidé (douleur volontaire)
    console.log(' Test 9: Douleur volontaire (panier non vidé)');
    const cartAfterOrder = await request('GET', '/cart');
    assert(cartAfterOrder.data.length > 0, 'Panier non vidé après commande (douleur volontaire)');
    console.log(`   Panier toujours avec ${cartAfterOrder.data.length} item(s)\n`);

    // Test 10: DELETE /cart
    console.log(' Test 10: Vidage du panier');
    const clearCart = await request('DELETE', '/cart');
    assert(clearCart.status === 200, 'DELETE /cart retourne 200');
    assert(clearCart.data.message === 'Panier vidé', 'Message de vidage correct');
    
    const cartAfterClear = await request('GET', '/cart');
    assert(cartAfterClear.data.length === 0, 'Panier effectivement vidé');
    console.log(`   Panier vidé avec succès\n`);

    // Test 11: Route inexistante (404)
    console.log(' Test 11: Gestion 404');
    const notFound = await request('GET', '/inexistant');
    assert(notFound.status === 404, 'Route inexistante retourne 404');
    assert(notFound.data.error === 'Not Found', 'Message 404 correct');
    console.log(`   Gestion 404 fonctionnelle\n`);

    // Résumé final
    console.log(' === TOUS LES TESTS RÉUSSIS ===');
    console.log(' API conforme aux spécifications V0');
    console.log(' Endpoints fonctionnels');
    console.log(' Validation des données');
    console.log(' Codes de retour corrects');
    console.log(' Formats JSON respectés');
    console.log(' Douleur volontaire implémentée');

  } catch (error) {
    console.error('\n ERREUR:', error.message);
    process.exit(1);
  }
}

// Vérification que le serveur est démarré
async function checkServer() {
  try {
    await request('GET', '/');
    console.log(' Serveur détecté sur http://localhost:3000\n');
    return true;
  } catch (error) {
    console.error(' Serveur non accessible sur http://localhost:3000');
    console.error('   Démarrez le serveur avec: npm run dev');
    process.exit(1);
  }
}

// Exécution des tests
checkServer().then(runTests).catch(console.error);
