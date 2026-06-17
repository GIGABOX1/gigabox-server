const mongoose = require('mongoose');
// Importation du modèle (assure-toi que le chemin './forfait' est correct)
const Forfait = require('./models/Forfait');

const ForfaitSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        trim: true
    },
    volume: {
        type: String, // Ex: "1 Go", "24 Go"
        required: true
    },
    prix: {
        type: String, // Ex: "250 F CFA", "5 000 F CFA"
        required: true
    },
    validite: {
        type: String, // Ex: "4 jours", "30 jours"
        required: true
    },
    icone: {
        type: String, // Ex: "bolt", "flame-outline"
        required: true,
        default: "cube-outline"
    },
    couleur: {
        type: String, // Ex: "#2ecc71"
        required: true,
        default: "#4d6ef2"
    },
    badge: {
        type: String, // Ex: "Éclair", "Meilleur Prix"
        default: null
    }
}, {
    timestamps: true // Crée automatiquement createdAt et updatedAt
});

module.exports = mongoose.model('Forfait', ForfaitSchema);