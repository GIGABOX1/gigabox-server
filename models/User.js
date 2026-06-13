const mongoose = require('mongoose');

// Sous-schéma pour l'historique des activités/achats
const ActionHistorySchema = new mongoose.Schema({
    titre: {
        type: String, // Ex: "Achat Pack Giga Max", "Téléchargement Pack Zip"
        required: true
    },
    impact: {
        type: String, // Ex: "+24 Go" ou "-2.4 Go"
        required: true
    },
    type: {
        type: String,
        enum: ['recharge', 'telechargement', 'bonus'],
        required: true
    },
    dateTexte: {
        type: String, // Ex: "À l'instant", "Hier". On pourra aussi utiliser des vraies dates
        default: "À l'instant"
    }
}, {
    timestamps: true
});

// Schéma Principal de l'utilisateur GigaBox
const UserSchema = new mongoose.Schema({
    telephone: {
        type: String,
        required: true,
        unique: true, // Évite qu'un numéro soit enregistré deux fois
        trim: true
    },
    // On stocke le volume en octets (bytes) au niveau du serveur pour faire des calculs précis, 
    // puis on fera la conversion en Go pour l'affichage sur le téléphone.
    volume_total_octets: {
        type: Number,
        default: 16106127360 // Correspond à 15 Go offerts à l'inscription (15 * 1024 * 1024 * 1024)
    },
    zone: {
        type: String,
        default: "Afrique de l'Ouest"
    },
    historique_achats: [ActionHistorySchema] // Liste des transactions de l'utilisateur
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);