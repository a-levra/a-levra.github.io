document.addEventListener('DOMContentLoaded', () => {
    const questionsContainer = document.getElementById('questions-container');
    const addQuestionBtn = document.getElementById('add-question-btn');
    const rmQuestionBtn = document.getElementById('rm-question-btn');
    let questionCount = 1;

    addQuestionBtn.addEventListener('click', () => {
        questionCount++;
        const newQuestionPair = document.createElement('div');
        newQuestionPair.classList.add('question-pair');
        
        newQuestionPair.innerHTML = `
            <hr>
            <label for="question-${questionCount}">Question ${questionCount} :</label>
            <textarea class="textarea-question" id="question-${questionCount}" name="question"></textarea>
            <br>
            <label for="answer-${questionCount}">Réponse ${questionCount} :</label>
            <textarea class="textarea-answer" id="answer-${questionCount}" name="answer"></textarea>
            <br>
            <label for="additional-info-${questionCount}">Complément de réponse ${questionCount} :</label>
            <textarea class="textarea-additional-info" id="additional-info-${questionCount}" name="additional-info"></textarea>
            <br>
        `;
        
        questionsContainer.appendChild(newQuestionPair);
    });

    rmQuestionBtn.addEventListener('click', () => {
        if (questionCount > 1) {
            questionsContainer.removeChild(questionsContainer.lastElementChild);
            questionCount--;
        }
    });


    // Logique de soumission du formulaire
    const form = document.getElementById('create-pack-form');
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Empêche le rechargement de la page par défaut

        const packName = document.getElementById('pack-name').value;
        const questions = document.querySelectorAll('.question-pair');
        
        let csvContent = "question,answer,additionalInfo\n"; // En-têtes du fichier CSV

        questions.forEach(questionPair => {
            const questionText = questionPair.querySelector('.textarea-question').value.replace(/"/g, '""');
            const answerText = questionPair.querySelector('.textarea-answer').value.replace(/"/g, '""');
            const additionalInfoText = questionPair.querySelector('.textarea-additional-info').value.replace(/"/g, '""');

            // Formater la ligne pour le CSV en gérant les sauts de ligne et les guillemets
            csvContent += `"${questionText}","${answerText}","${additionalInfoText}"\n`;
        });
        
        console.log("CSV Content:", csvContent); // Pour débogage


        fetch('/api/save-pack', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ packName, csvData: csvContent }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur de sauvegarde du pack.');
            }
            return response.json();
        })
        .then(data => {
            console.log('Pack sauvegardé avec succès:', data);
            alert('Pack "' + packName + '" créé avec succès !');
            // Optionnel : rediriger l'utilisateur vers une autre page
            window.location.href = 'chooseFlashcards.html';
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Échec de la création du pack. Veuillez réessayer.');
        });
    });

});