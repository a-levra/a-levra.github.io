// js/events.js

export function setupEventListeners(appState, onAnswer, onShowInfo) {

    console.log("appState:", appState);

    // Événements de clavier
    window.addEventListener('keydown', (event) => {
        event.preventDefault();
        if (appState.isOver) return;

        if (event.key === 'ArrowRight' && appState.isAnswerShown) {
            onAnswer(true);
        } else if (event.key === 'ArrowLeft' && appState.isAnswerShown) {
            onAnswer(false);
        } else if (event.key === 'ArrowDown' && appState.isAnswerShown) {
            onShowInfo(false);
        } else if (event.key === 'ArrowUp' && appState.isAnswerShown) {
            onShowInfo(true);
        } else if (event.key === ' ' && !appState.isAnswerShown) {
            onAnswer();
        }
    });

    // Événements de souris/touch
    let touchstartX = 0;
    let touchstartY = 0;
    let touchendY = 0;
    let touchendX = 0;
    const swipeThreshold = 50;
    const body = document.body;

    body.addEventListener('touchstart', e => {
        e.preventDefault();
        touchstartX = e.changedTouches[0].screenX;
        touchstartY = e.changedTouches[0].screenY;
    }, { passive: false });

    body.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        touchendY = e.changedTouches[0].screenY;
        const distanceX = touchendX - touchstartX;
        const distanceY = touchendY - touchstartY;
        
        if (Math.abs(distanceX) > swipeThreshold) {
            if (distanceX > 0) {
                if (appState.isAnswerShown) onAnswer(true);
            } else {
                if (appState.isAnswerShown) onAnswer(false);
            }
        } 
        else if (Math.abs(distanceY) > swipeThreshold) {
            if (distanceY > 0) {
                if (appState.isAnswerShown) onShowInfo(false);
            } else {
                if (appState.isAnswerShown) onShowInfo(true);
            }
        }
        else {
            if (!appState.isAnswerShown) {
                console.log("touch detected, answer is not shown yet, showing answer");
                onAnswer();
            }
        }
    });
}