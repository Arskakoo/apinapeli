let container = document.getElementById('fullscreen-container');
let monkeySize = 70;
let startTime;
let gameRunning = false;

function startGame() {
    if (gameRunning) {
        return;
    }

    let levelSelect = document.getElementById('level');
    let monkeyCount = parseInt(levelSelect.value);

    hideMonkeys();

    let bananaMonkey = document.querySelector('.start-img');
    bananaMonkey.style.display = 'none';

    let header = document.getElementById('hide');
    header.style.visibility = 'hidden';

    for (let i = 0; i < monkeyCount; i++) {
        createMonkeyImage('assets/img/monkey.png');
    }

    createMonkeyImage('assets/img/banana-monkey.png');
    startTime = new Date();
    gameRunning = true;

    let startText = document.querySelector('.start-text');
    startText.classList.add('start-hidden');
}

function createMonkeyImage(imageSrc) {
    let image = document.createElement('img');
    image.src = imageSrc;
    image.classList.add('fullscreen-image');
    image.addEventListener('click', checkGameOver);

    let x = Math.random() * (window.innerWidth - monkeySize);
    let y = Math.random() * (window.innerHeight - monkeySize);

    image.style.width = `${monkeySize}px`;
    image.style.height = `${monkeySize}px`;
    image.style.left = `${x}px`;
    image.style.top = `${y}px`;

    container.appendChild(image);
}

function hideMonkeys() {
    let monkeys = document.querySelectorAll('.fullscreen-image');
    monkeys.forEach(monkey => {
        monkey.style.visibility = 'hidden';
    });
}

function showMonkeys() {
    let monkeys = document.querySelectorAll('.fullscreen-image');
    monkeys.forEach(monkey => {
        monkey.style.visibility = 'visible';
    });
}

function checkGameOver() {
    if (this.src.includes('banana-monkey.png')) {
        let endTime = new Date();
        let elapsedTime = (endTime - startTime) / 1000;
        alert(`Hienoa löysit eläintarhan banaaneja syövän apinan. Aikasi oli ${elapsedTime.toFixed(2)} sekunttia.`);

        let header = document.getElementById('hide');
        header.style.visibility = 'visible';

        let startText = document.querySelector('.start-text');
        startText.classList.remove('start-hidden');

        hideMonkeys();

        let levelSelect = document.getElementById('level');
        let selectedLevel = levelSelect.value;

        let highScores = JSON.parse(localStorage.getItem('highScores')) || [];

        highScores.push({ level: getLevelName(selectedLevel), time: elapsedTime.toFixed(2) });

        highScores.sort((a, b) => a.time - b.time);

        highScores = highScores.slice(0, 5);

        localStorage.setItem('highScores', JSON.stringify(highScores));

        showHighScores(highScores);

        gameRunning = false;

        setTimeout(function () {
            window.location.reload();
        }, 1);
    }
}

window.onload = function () {
    loadHighScores();
}

function loadHighScores() {
    let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    showHighScores(highScores);
}

function showHighScores(highScores) {
    let highScoreContainer = document.getElementById('highscore-container');
    highScoreContainer.innerHTML = '';

    let highScoreParagraph = document.createElement('p');
    highScoreParagraph.innerHTML = "<strong>Top 5 huippupisteet:</strong><br>";

    let topScores = highScores.slice(0, 5);

    topScores.forEach((score, index) => {
        highScoreParagraph.innerHTML += `${index + 1}. Taso: ${score.level}, Aika: ${score.time} sekunttia<br>`;
    });

    highScoreContainer.appendChild(highScoreParagraph);
}

function getLevelName(levelValue) {
    if (levelValue === '500') {
        return 'Helppo';
    } else if (levelValue === '700') {
        return 'Normaali';
    } else if (levelValue === '900') {
        return 'Vaikea';
    } else if (levelValue === '1000') {
        return 'Erittäin vaikea';
    } else {
        return 'Unknown';
    }
}
