require('dotenv').config(); // Charge tes variables d'environnement (clés secrètes)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// --- MIDDLEWARES ---
// Autorise ton application mobile à communiquer avec le serveur (CORS)
app.use(cors());
// Permet au serveur de comprendre les données au format JSON
app.use(express.json());

// --- CONNEXION À LA BASE DE DONNÉES ---
// On utilise la variable MONGO_URI configurée dans le tableau de bord de Render
const dbURI = process.env.MONGO_URI;

mongoose.connect(dbURI)
    .then(() => console.log('✅ Connecté avec succès à MongoDB !'))
    .catch((err) => console.error('❌ Erreur de connexion MongoDB :', err));

// --- ROUTES ---
// Route de test pour confirmer que le serveur répond bien
app.get('/', (req, res) => {
    res.status(200).send('Gigabox Server est opérationnel et connecté.');
});

// À cet endroit, tu ajouteras tes routes pour CinetPay et les forfaits
// Exemple : app.use('/api/paiement', require('./routes/paiement'));

// --- LANCEMENT DU SERVEUR ---
// Render définit le port dynamiquement, sinon on utilise 3000 par défaut
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré et en attente sur le port ${PORT}`);
});