require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connexion locale (vérifie que ta base locale tourne sur ton PC)
// Remplace 'gigabox_db' par le nom de ta base
const localDB = 'mongodb://127.0.0.1:27017/gigabox_db';

mongoose.connect(localDB)
    .then(() => console.log('✅ Connecté à MongoDB Local'))
    .catch(err => console.error('❌ Erreur :', err));

app.get('/', (req, res) => res.send('Serveur local actif !'));

app.listen(3000, () => console.log('🚀 Serveur local lancé sur http://localhost:3000'));