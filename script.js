// Example trigger when game finishes
function gameOver(finalScore) {
    const pName = prompt("Game Over! Enter your name for the Global Leaderboard:");
    if (pName && typeof window.submitGlobalScore === "function") {
        window.submitGlobalScore(pName, finalScore);
    }
}
