// game.js
let container = document.getElementById('fullscreen-container');
let monkeySize = 70;
let startTime;
let gameRunning = false;

function startGame() {
    if (gameRunning) {
        // Pelissä jo käynnissä, estä uusi aloitus
        return;
    }

    let levelSelect = document.getElementById('level');
    let monkeyCount = parseInt(levelSelect.value);

    // Piilota apinat
    hideMonkeys();

    // Piilota banana-monkey kuva
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

    // Piilota .start-text
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

        // Näytä header uudelleen
        let header = document.getElementById('hide');
        header.style.visibility = 'visible';

        // Näytä .start-text uudelleen
        let startText = document.querySelector('.start-text');
        startText.classList.remove('start-hidden');

        // Piilota apinat
        hideMonkeys();

        // Tallenna aika ja taso local storageen
        let levelSelect = document.getElementById('level');
        let selectedLevel = levelSelect.value;

        // Hae aiemmat tulokset tai alusta taulukko
        let highScores = JSON.parse(localStorage.getItem('highScores')) || [];

        // Lisää uusi tulos
        highScores.push({ level: getLevelName(selectedLevel), time: elapsedTime.toFixed(2) });

        // Lajittele tulokset ajan mukaan nousevassa järjestyksessä
        highScores.sort((a, b) => a.time - b.time);

        // Säilytä vain parhaat 5 tulosta
        highScores = highScores.slice(0, 5);

        // Tallenna tulokset local storageen
        localStorage.setItem('highScores', JSON.stringify(highScores));

        // Näytä parhaat tulokset
        showHighScores(highScores);

        gameRunning = false;

        // Päivitä sivu automaattisesti
        setTimeout(function () {
            window.location.reload();
        }, 1); // Voit säätää odotusaikaa tarvittaessa
    }
}

window.onload = function () {
    // Lataa highscore näkymä
    loadHighScores();

    // Muut koodit tässä...
}

function loadHighScores() {
    // Hae aiemmat tulokset tai alusta taulukko
    let highScores = JSON.parse(localStorage.getItem('highScores')) || [];

    // Näytä highscore
    showHighScores(highScores);
}

// Päivitetty showHighScores-funktio
function showHighScores(highScores) {
    // Tyhjennä aiempi näyttö
    let highScoreContainer = document.getElementById('highscore-container');
    highScoreContainer.innerHTML = '';

    // Näytä parhaat tulokset
    let highScoreParagraph = document.createElement('p');
    highScoreParagraph.innerHTML = "<strong>Top 5 huippupisteet:</strong><br>";

    // Näytä enintään viisi parasta tulosta
    let topScores = highScores.slice(0, 5);

    topScores.forEach((score, index) => {
        highScoreParagraph.innerHTML += `${index + 1}. Taso: ${score.level}, Aika: ${score.time} sekunttia<br>`;
    });

    highScoreContainer.appendChild(highScoreParagraph);
}

// Uusi funktio levelin nimen hakemiseen
function getLevelName(levelValue) {
    if (levelValue === '500') {
        return 'Helppo';
    } else if (levelValue === '700') {
        return 'Normaali';
    } else if (levelValue === '900') {
        return 'Vaikea';
    } else if (levelValue === '1100') {
        return 'Erittäin vaikea';
    } else {
        return 'Unknown'; // Oletus, jos levelin nimiä ei ole määritetty kaikille arvoille
    }
}
