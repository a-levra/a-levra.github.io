document.addEventListener('DOMContentLoaded', () => {
    const textElement = document.getElementById('text');
    randomIndex = 0;
    isOver = false;

    flashcards = [
    ];

    let currentCard = {};
    let isAnswerShown = false;

    function showNewCard() {
        if (flashcards.length === 0) {
            textElement.textContent = "Terminé !";
            textElement.classList.add('finished');
            isOver = true;
            return;
        }
        randomIndex = Math.floor(Math.random() * flashcards.length);
        currentCard = flashcards[randomIndex];
        textElement.classList.remove('correct', 'incorrect', 'additional-info', 'finished');
        textElement.textContent = currentCard.question;
        isAnswerShown = false;
    }

    function handleClick(isCorrect = false) {
        if (isAnswerShown) {
            textElement.classList.add(isCorrect ? 'correct' : 'incorrect');
            if (isCorrect) {
                flashcards.splice(randomIndex, 1);
            }
            setTimeout(showNewCard, 300);
        } else {
            textElement.innerHTML = currentCard.answer;
            isAnswerShown = true;
        }
    }

    function showAdditionalInfo(show) {
        if (show && currentCard.additionalInfo) {
            textElement.classList.add('additional-info');
            textElement.innerHTML = currentCard.additionalInfo;
        } else {
            textElement.classList.remove('additional-info');
            textElement.innerHTML = currentCard.answer;
        }
    }


    fetch('flashcards.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur de chargement du fichier CSV');
            }
            return response.text();
        })
        .then(csvText => {
            const lines = csvText.trim().split('\n');
            const headers = lines.shift().split(',');
            
            flashcards = lines.map(line => {
                const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // Divise par virgule, en gérant les guillemets
                return {
                    [headers[0]]: values[0].replace(/"/g, ''), // Retirez les guillemets
                    [headers[1]]: values[1].replace(/"/g, ''),
                    [headers[2]]: values[2] ? values[2].replace(/"/g, '') : '' // Retirez les guillemets, gère le cas où il n'y a pas d'info supplémentaire
                };
            });
            
            showNewCard();
        })
        .catch(error => {
            console.error(error);
            textElement.textContent = "Erreur de chargement des questions.";
        });
    

    window.addEventListener('keydown', function(event){
        if(isOver) return;
        if(event.key === 'ArrowLeft' && isAnswerShown){
            event.preventDefault();
            handleClick(false);
        }
        else if(event.key === 'ArrowRight' && isAnswerShown){
            event.preventDefault();
            handleClick(true);
        }
        else if(event.key === 'ArrowDown' && isAnswerShown){
            event.preventDefault();
            showAdditionalInfo(true);
        }
        else if(event.key === 'ArrowUp' && isAnswerShown){
            event.preventDefault();
            showAdditionalInfo(false);
        }
        else if(event.key === ' ' && !isAnswerShown ){
            event.preventDefault();
            handleClick();
        }
    })
    textElement.addEventListener('click', () => {
        if (isOver) return;
        if (!isAnswerShown) {
            handleClick();
        }
    });

    let touchstartX = 0;
    let touchendX = 0;
    const swipeThreshold = 50;

    const body = document.body;
    body.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
    });

    body.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        handleGesture();
    });

    function handleGesture() {
        const distance = touchendX - touchstartX;
        
        if (Math.abs(distance) > swipeThreshold) {
            if (distance > 0) {
                console.log("Swipe vers la droite !");
                // Le swipe à droite correspond à "réussi" dans votre logique
                if (isAnswerShown) {
                    handleClick(true);
                }
            } else {
                console.log("Swipe vers la gauche !");
                // Le swipe à gauche correspond à "échoué"
                if (isAnswerShown) {
                    handleClick(false);
                }
            }
        } else {
            // Touch simple : le comportement est le même qu'un clic
            handleClick();
        }
    }

});

