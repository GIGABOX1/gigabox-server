const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 1. LE FIL DE CONNEXION : On importe le modèle Forfait
// (Si ton fichier Forfait.js est dans un dossier "models", écris : './models/Forfait')
const Forfait = require('./forfait'); // minuscule ici !

const app = express();
app.use(cors());
app.use(express.json());

// 2. Connexion à la base de données
const dbURI = process.env.MONGO_URI;
mongoose.connect(dbURI)
    .then(() => console.log('✅ Connecté à MongoDB'))
    .catch(err => console.error('❌ Erreur de connexion Mongoose :', err));

// 3. Route pour récupérer les forfaits
app.get('/api/forfaits', async (req, res) => {
    try {
        const forfaits = await Forfait.find({});
        res.json(forfaits); // Renvoie les données au format JSON
    } catch (error) {
        console.error("Erreur sur la route /api/forfaits :", error);
        res.status(500).json({ error: error.message });
    }
});

// 4. Configuration du Port pour Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Serveur lancé sur le port ${PORT}`);
});