require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const User = require('./models/User');
const Forfait = require('./models/Forfait');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connecté à MongoDB'))
    .catch(err => console.error('❌ Erreur MongoDB:', err));

// Route de Connexion
app.post('/api/connexion', async (req, res) => {
    const { telephone } = req.body;
    try {
        const user = await User.findOne({ telephone });
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
        res.json({ utilisateur: user });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur actif sur le port ${PORT}`));