require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connexion MongoDB réussie'))
    .catch(err => console.error('❌ Erreur MongoDB :', err));

app.get('/', (req, res) => res.send('Serveur Gigabox en ligne'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur le port ${PORT}`));