import { loadFlashcards } from './data.js';

const cards = document.querySelectorAll('.card');
for (const card of cards) {

card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * -15;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    card.style.setProperty('--glare-x', `${glareX}%`);
    card.style.setProperty('--glare-y', `${glareY}%`);

});

card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    card.style.setProperty('--glare-x', `50%`);
    card.style.setProperty('--glare-y', `50%`);
});

card.addEventListener('click', () => {
    card.classList.add('swipe-off');
});

}
const choosedFlashcardsPack = localStorage.getItem('choosedFlashcardsPack');
let flashcardsPack = choosedFlashcardsPack ? choosedFlashcardsPack : 'flashcards.csv';


try {
    const flashcards = await loadFlashcards(`flashcards/${flashcardsPack}`);
    console.log(flashcards);
    
} catch (error) {
    appState.textElement.textContent = "Erreur de chargement des questions.";
}
