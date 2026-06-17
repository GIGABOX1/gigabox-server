const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Forfait = require('./models/Forfait');

const app = express();
app.use(cors());
app.use(express.json());

// Connexion MongoDB sécurisée via variable d'environnement
const dbURI = process.env.MONGO_URI;

mongoose.connect(dbURI)
    .then(() => console.log('✅ Connecté à MongoDB'))
    .catch(err => console.error('❌ Erreur de connexion :', err));

// Route : RÉCUPÉRER LE CATALOGUE DES FORFAITS
app.get('/api/forfaits', async (req, res) => {
    try {
        const forfaits = await Forfait.find({});
        res.json(forfaits);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route : CONNEXION
app.post('/api/auth/connexion', async (req, res) => {
    const { telephone } = req.body;
    if (!telephone) return res.status(400).json({ message: 'Téléphone requis' });
    try {
        const user = await User.findOne({ telephone });
        // Logique d'authentification...
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Port dynamique pour Render
// Remplace ton app.listen(3000, ...) actuel par celui-ci :
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Serveur lancé sur le port ${PORT}`);
});