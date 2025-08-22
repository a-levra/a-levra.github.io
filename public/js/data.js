// js/data.js

// L'expression régulière pour le parsing du CSV
const CSV_DELIMITER = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;

export async function loadFlashcards(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Erreur de chargement du fichier ${filePath}`);
        }
        const csvText = await response.text();
        const lines = csvText.trim().split('\n');
        const headers = lines.shift().split(',');
        
        return lines.map(line => {
            const values = line.split(CSV_DELIMITER);
            return {
                [headers[0]]: values[0].replace(/"/g, ''),
                [headers[1]]: values[1].replace(/"/g, ''),
                [headers[2]]: values[2] ? values[2].replace(/"/g, '') : ''
            };
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
}