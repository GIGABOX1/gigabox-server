const mongoose = require('mongoose');

// Sous-schéma pour l'historique
const ActionHistorySchema = new mongoose.Schema({
    titre: { type: String, required: true },
    impact: { type: String, required: true },
    type: { type: String, enum: ['recharge', 'telechargement', 'bonus'], required: true },
    dateTexte: { type: String, default: "À l'instant" }
}, { timestamps: true });

// Schéma Principal
const UserSchema = new mongoose.Schema({
    telephone: { type: String, required: true, unique: true, trim: true },
    volume_total_octets: { type: Number, default: 16106127360 }, // 15 Go par défaut
    zone: { type: String, default: "Afrique de l'Ouest" },
    historique_achats: [ActionHistorySchema]
}, { timestamps: true });

// Exportation simple
module.exports = mongoose.model('User', UserSchema);
