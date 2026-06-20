require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Importation du modèle
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

// Connexion MongoDB
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connecté à MongoDB'))
    .catch(err => console.error('❌ Erreur MongoDB:', err));

// Route 1 : Connexion
app.post('/api/connexion', async (req, res) => {
    const { telephone } = req.body;
    try {
        const user = await User.findOne({ telephone });
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
        res.status(200).json({ utilisateur: user });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Route 2 : Inscription (Celle qui causait l'erreur 404)
app.post('/api/inscription', async (req, res) => {
    const { telephone } = req.body;
    try {
        const existant = await User.findOne({ telephone });
        if (existant) return res.status(400).json({ message: "Ce numéro existe déjà" });

        const nouveauUser = new User({ telephone });
        await nouveauUser.save();
        res.status(201).json({ message: "Inscription réussie", utilisateur: nouveauUser });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur actif sur le port ${PORT}`));