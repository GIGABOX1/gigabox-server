const mongoose = require('mongoose');

const ForfaitSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    volume: { type: String, required: true },
    prix: { type: String, required: true },
    validite: { type: String, required: true },
    icone: { type: String }, // Ex: 'bolt' pour ionicons
    couleur: { type: String } // Ex: '#2ecc71'
});

module.exports = mongoose.model('Forfait', ForfaitSchema);
