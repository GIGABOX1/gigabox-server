require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Importation des Schémas Mongoose
const User = require('./models/User');
const Forfait = require('./models/Forfait');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// 🔌 Connexion à MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gigabox';
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connecté avec succès à MongoDB !'))
    .catch(err => console.error('❌ Erreur de connexion MongoDB :', err));

// 🛠️ ROUTE : INITIALISER LE CATALOGUE (À visiter une fois sur ton navigateur)
app.get('/api/forfaits/init', async (req, res) => {
    try {
        const total = await Forfait.countDocuments();
        if (total > 0) {
            return res.status(400).json({ message: 'Le catalogue contient déjà des forfaits.' });
        }

        const initialForfaits = [
            { nom: 'Pack Flash Mini', volume: '1 Go', prix: '250 F CFA', validite: '4 jours', icone: 'bolt', couleur: '#2ecc71', badge: 'Éclair' },
            { nom: 'Pack Giga Light', volume: '2 Go', prix: '500 F CFA', validite: '4 jours', icone: 'speedometer-outline', couleur: '#3498db', badge: 'Éco' },
            { nom: 'Pack Giga Standard', volume: '4 Go', prix: '1 000 F CFA', validite: '7 jours', icone: 'flash-outline', couleur: '#e67e22', badge: 'Populaire' },
            { nom: 'Pack Giga Plus', volume: '5 Go', prix: '1 500 F CFA', validite: '7 jours', icone: 'star-outline', couleur: '#9b59b6', badge: 'Bonus' },
            { nom: 'Pack Giga Super', volume: '7 Go', prix: '2 000 F CFA', validite: '15 jours', icone: 'gift-outline', couleur: '#2c3e50', badge: 'Avantage' },
            { nom: 'Pack Giga Medium', volume: '10 Go', prix: '3 000 F CFA', validite: '15 jours', icone: 'ribbon-outline', couleur: '#16a085', badge: 'Top' },
            { nom: 'Pack Giga Pro', volume: '15 Go', prix: '4 000 F CFA', validite: '30 jours', icone: 'briefcase-outline', couleur: '#2980b9', badge: 'Professionnel' },
            { nom: 'Pack Giga Max', volume: '24 Go', prix: '5 000 F CFA', validite: '30 jours', icone: 'flame-outline', couleur: '#e74c3c', badge: 'Meilleur Prix' },
            { nom: 'Mega Pack Silver', volume: '50 Go', prix: '10 000 F CFA', validite: '30 jours', icone: 'trophy-outline', couleur: '#7f8c8d', badge: 'Gros Volume' },
            { nom: 'Mega Pack Gold', volume: '100 Go', prix: '15 000 F CFA', validite: '30 jours', icone: 'shield-checkmark-outline', couleur: '#f1c40f', badge: 'Premium' },
            { nom: 'Ultra Pack VIP', volume: '150 Go', prix: '20 000 F CFA', validite: '30 jours', icone: 'diamond-outline', couleur: '#8e44ad', badge: 'Elite' },
            { nom: 'Ultra Pack GigaBox', volume: '200 Go', prix: '30 000 F CFA', validite: '30 jours', icone: 'cloud-done-outline', couleur: '#d35400', badge: 'Maximum' }
        ];

        await Forfait.insertMany(initialForfaits);
        res.status(201).json({ message: 'Les 12 forfaits ont été enregistrés avec succès dans MongoDB !' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📡 ROUTE : RÉCUPÉRER LE CATALOGUE DES FORFAITS
app.get('/api/forfaits', async (req, res) => {
    try {
        const forfaits = await Forfait.find({});
        res.json(forfaits);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🔐 ROUTE : CONNEXION / INSCRIPTION AUTOMATIQUE
app.post('/api/auth/connexion', async (req, res) => {
    const { telephone } = req.body;
    if (!telephone) return res.status(400).json({ message: 'Téléphone requis.' });

    try {
        let user = await User.findOne({ telephone });
        if (!user) {
            user = new User({
                telephone: telephone,
                historique_achats: [
                    { titre: "Création de compte GigaBox", impact: "+15.0 Go", type: "bonus", dateTexte: "À l'instant" }
                ]
            });
            await user.save();
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 💳 ROUTE : ENREGISTRER UN ACHAT DE FORFAIT DANS MONGODB
app.post('/api/forfaits/acheter', async (req, res) => {
    const { telephone, forfaitId, operateur, numeroPaiement } = req.body;

    if (!telephone || !forfaitId || !numeroPaiement) {
        return res.status(400).json({ message: 'Données manquantes.' });
    }

    try {
        const forfait = await Forfait.findById(forfaitId);
        const user = await User.findOne({ telephone });

        if (!forfait || !user) {
            return res.status(404).json({ message: 'Forfait ou Utilisateur introuvable.' });
        }

        // Calcul du volume à ajouter
        const volumeStr = forfait.volume;
        let octetsGagnes = 0;
        if (volumeStr.includes('Go')) {
            octetsGagnes = parseFloat(volumeStr) * 1024 * 1024 * 1024;
        } else if (volumeStr.includes('Mo')) {
            octetsGagnes = parseFloat(volumeStr) * 1024 * 1024;
        }

        user.volume_total_octets += octetsGagnes;

        let nomOperateur = operateur === 'moov' ? 'Moov Money' : operateur === 'wave' ? 'Wave' : 'Orange Money';

        user.historique_achats.unshift({
            titre: `Achat ${forfait.nom}`,
            impact: `+${forfait.volume}`,
            type: 'recharge',
            dateTexte: "À l'instant"
        });

        await user.save();

        res.status(200).json({
            success: true,
            message: `Achat approuvé via ${nomOperateur} sur le ${numeroPaiement}`,
            user: user
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ouverture sur tout le réseau local grâce à '0.0.0.0'
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Serveur actif sur le réseau local !`);
});