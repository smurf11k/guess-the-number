let minValue = 1;
let maxValue = 100;
let secretNumber;
let attempts = 0;
let win = false;
let roundsPlayed = 0;
let consecutiveWins = 0;

const minInput = document.getElementById("minValue");
const maxInput = document.getElementById("maxValue");
const guessField = document.getElementById("guessField");
const guessButton = document.querySelector(".guessSubmit");
const restartButton = document.querySelector(".restart");
const attemptsDisplay = document.querySelector(".attempts");

let achievements;

window.addEventListener('DOMContentLoaded', () => {
    achievements = new AchievementSystem();
    populateAchievements();
    achievements.loadFromStorage();

    roundsPlayed = parseInt(localStorage.getItem('roundsPlayed')) || 0;
    consecutiveWins = parseInt(localStorage.getItem('consecutiveWins')) || 0;

    generateSecretNumber();

    guessButton.addEventListener("click", checkGuess);

    restartButton.addEventListener("click", () => {
        if (!win) {
            consecutiveWins = 0;
            localStorage.setItem('consecutiveWins', consecutiveWins);
        }
        generateSecretNumber();
    });
});

function generateSecretNumber() {
    secretNumber = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    attempts = 0;
    win = false;
    attemptsDisplay.textContent = "Input your guess:";
    guessField.value = "";
}

function checkGuess() {
    let userGuess = parseInt(guessField.value);
    if (isNaN(userGuess)) {
        alert("Please enter a valid number.");
        return;
    }
    attempts++;

    if (userGuess < secretNumber) {
        attemptsDisplay.textContent = `The number is higher than ${userGuess}.`;
    } else if (userGuess > secretNumber) {
        attemptsDisplay.textContent = `The number is lower than ${userGuess}.`;
    } else {
        attemptsDisplay.textContent = `Congratulations! You guessed it in ${attempts} attempts.`;
        win = true;

        roundsPlayed++;
        localStorage.setItem('roundsPlayed', roundsPlayed);

        consecutiveWins++;
        localStorage.setItem('consecutiveWins', consecutiveWins);
    }
    checkAchievements();
    guessField.value = "";
}

function checkAchievements() {
    if (attempts === 1 && !achievements.achievements['firstGuess'].unlocked) {
        achievements.unlock('firstGuess');
        console.log("First Guess achievement unlocked!");
    }
    if (win && !achievements.achievements['correctGuess'].unlocked) {
        achievements.unlock('correctGuess');
        console.log("Correct Guess achievement unlocked!");
    }
    if (attempts <= 5 && win && !achievements.achievements['fastThinker'].unlocked) {
        achievements.unlock('fastThinker');
        console.log("Fast Thinker achievement unlocked!");
    }
    if (attempts === 1 && win && !achievements.achievements['luckyShot'].unlocked) {
        achievements.unlock('luckyShot');
        console.log("Lucky Shot achievement unlocked!");
    }
    if (attempts <= 3 && win && !achievements.achievements['sniper'].unlocked) {
        achievements.unlock('sniper');
        console.log("Sniper achievement unlocked!");
    }
    if (attempts > 20 && win && !achievements.achievements['slowSteady'].unlocked) {
        achievements.unlock('slowSteady');
        console.log("Slow and Steady achievement unlocked!");
    }

    if (win) {
        if (consecutiveWins >= 3 && !achievements.achievements['consistentWinner'].unlocked) {
            achievements.unlock('consistentWinner');
            console.log("Consistent Winner achievement unlocked!");
        }
    } else {
        consecutiveWins = 0;
        localStorage.setItem('consecutiveWins', 0);
    }

    if (roundsPlayed >= 50 && !achievements.achievements['guessingVeteran'].unlocked) {
        achievements.unlock('guessingVeteran');
        console.log("Guessing Veteran achievement unlocked!");
    }
}

function resetRoundCounters() {
    localStorage.setItem('roundsPlayed', 0);
    localStorage.setItem('consecutiveWins', 0);
    roundsPlayed = 0;
    consecutiveWins = 0;
    console.log("Round counters reset");
}
