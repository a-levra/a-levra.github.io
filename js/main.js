// js/main.js

import { loadFlashcards } from './data.js';
import { showNewCard, showAnswer, handleAnswerResult, showAdditionalInfo } from './ui.js';
import { setupEventListeners } from './events.js';

document.addEventListener('DOMContentLoaded', async () => {
    // État de l'application
    const appState = {
        textElement: document.getElementById('text'),
        flashcards: [],
        currentCard: {},
        isAnswerShown: false,
        randomIndex: 0,
        isOver: false,
    };

    try {
        appState.flashcards = await loadFlashcards('flashcards.csv');
    } catch (error) {
        appState.textElement.textContent = "Erreur de chargement des questions.";
        return;
    }

    // Fonctions de l'application
    function showNextCard() {
        if (appState.flashcards.length === 0) {
            appState.textElement.textContent = "Terminé !";
            appState.textElement.classList.add('finished');
            appState.isOver = true;
            return;
        }
        appState.randomIndex = Math.floor(Math.random() * appState.flashcards.length);
        appState.currentCard = appState.flashcards[appState.randomIndex];
        showNewCard(appState.currentCard, appState.textElement);
        appState.isAnswerShown = false;
    }

    function handleUserAnswer(isCorrect = false) {
        if (appState.isOver) return;

        if (appState.isAnswerShown) {
            if (isCorrect) {
                appState.flashcards.splice(appState.randomIndex, 1);
            }
            handleAnswerResult(isCorrect, appState.currentCard, appState.textElement, showNextCard);
        } else {
            showAnswer(appState.currentCard, appState.textElement);
            appState.isAnswerShown = true;
        }
    }

    function handleAdditionalInfo(show) {
        if (appState.isOver) return;
        showAdditionalInfo(appState.currentCard, appState.textElement, show);
    }
    
    // Initialise l'état et les événements
    showNextCard();
    setupEventListeners(appState, handleUserAnswer, handleAdditionalInfo);
});