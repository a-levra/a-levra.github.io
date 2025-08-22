// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json()); // Permet de lire les corps de requêtes JSON
app.use(express.static('public')); // Servez les fichiers statiques (votre HTML, CSS, JS)

// Définissez le point d'entrée de l'API pour sauvegarder le fichier CSV
app.post('/api/save-pack', (req, res) => {
    const { packName, csvData } = req.body;
    if (!packName || !csvData) {
        return res.status(400).json({ error: 'Pack name and CSV data are required.' });
    }

    const fileName = packName.toLowerCase().replace(/ /g, '-') + '.csv';
    const filePath = path.join(__dirname, 'public/flashcards', fileName);

    fs.writeFile(filePath, csvData, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to save the file.' });
        }
        res.status(200).json({ message: 'File saved successfully.', fileName });
    });
});

app.get('/api/get-packs/', (req, res) => {
    const directoryPath = path.join(__dirname, 'public/flashcards');
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to read directory.' });
        }
        const packs = files.filter(file => file.endsWith('.csv')).map(file => ({
            name: file.replace('.csv', '').replace(/-/g, ' '),
            fileName: file
        }));
        res.status(200).json(packs);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});