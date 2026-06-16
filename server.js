require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Remplace ton ancienne ligne const localDB = ... par ceci :
const dbURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gigabox_db';

mongoose.connect(dbURI)
    .then(() => console.log('✅ Connecté à MongoDB'))
    .catch(err => console.error('❌ Erreur de connexion :', err));

// Change aussi le port pour qu'il utilise celui de Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));

app.listen(3000, () => console.log('🚀 Serveur local lancé sur http://localhost:3000'));