// js/ui.js

export function showNewCard(card, textElement) {
    textElement.classList.remove('correct', 'incorrect', 'additional-info', 'finished');
    textElement.textContent = card.question;
}

export function showAnswer(card, textElement) {
    textElement.innerHTML = card.answer;
}

export function handleAnswerResult(isCorrect, card, textElement, callback) {
    textElement.classList.add(isCorrect ? 'correct' : 'incorrect');
    setTimeout(() => {
        callback();
    }, 300);
}

export function showAdditionalInfo(card, textElement, show) {
    if (show && card.additionalInfo) {
        textElement.classList.add('additional-info');
        textElement.innerHTML = card.additionalInfo;
    } else {
        textElement.classList.remove('additional-info');
        textElement.innerHTML = card.answer;
    }
}