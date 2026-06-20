require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Importation des modèles
const User = require('./models/User');
const Forfait = require('./models/Forfait');

const app = express();
app.use(cors());
app.use(express.json());

// Connexion MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://adminGiga:1234@gigabox.bh34g7i.mongodb.net/?appName=GigaBox';
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connecté à MongoDB'))
    .catch(err => console.error('❌ Erreur:', err));

// 1. Auth
app.post('/api/auth/connexion', async (req, res) => {
    const { telephone } = req.body;
    try {
        let user = await User.findOne({ telephone });
        if (!user) user = await new User({ telephone }).save();
        res.status(200).json(user);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// 2. Liste des Forfaits
app.get('/api/forfaits', async (req, res) => {
    try {
        const forfaits = await Forfait.find();
        res.json(forfaits);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// 3. Achat (Ajout de volume)
app.post('/api/achat', async (req, res) => {
    const { telephone, forfaitId } = req.body;
    try {
        const user = await User.findOne({ telephone });
        const forfait = await Forfait.findById(forfaitId);

        if (!user || !forfait) return res.status(404).json({ message: "Erreur" });

        // Calcul simple (Exemple: 1 Go = 1073741824 octets)
        const ajout = forfait.volume.includes('Go') ? 1073741824 : 1048576;
        user.volume_total_octets += ajout;

        await user.save();
        res.json({ message: "Succès", volume: user.volume_total_octets });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// 4. Initialisation des forfaits (Visite une fois dans ton navigateur)
app.get('/api/forfaits/init', async (req, res) => {
    const count = await Forfait.countDocuments();
    if (count > 0) return res.json({ message: "Déjà en ligne" });
    await Forfait.insertMany([
        { nom: 'Pack Flash', volume: '1 Go', prix: '250 F', validite: '24h' },
        { nom: 'Pack Giga', volume: '10 Go', prix: '1000 F', validite: '7j' }
    ]);
    res.json({ message: "Forfaits créés" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur sur port ${PORT}`));
