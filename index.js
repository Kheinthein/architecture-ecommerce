// Point d'entrée principal de l'application
import app from './src/presentation/http/app.js';

const PORT = process.env.PORT || 3000;

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
