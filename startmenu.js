let playerQuit = false;

function showStartMenu() {
    const endScore = document.getElementById('endScore');
    endScore.textContent = '';

    playerQuit = false;

    const startMenu = document.querySelector('.start-menu');
    startMenu.style.opacity = 1;
    startMenu.style.pointerEvents = 'auto';

    document.querySelector('.menu-buttons').style.display = 'none';

    const submenu = document.createElement('div');
    submenu.classList.add('submenu');
    submenu.innerHTML = `
        <button onclick="resetGameStatus(); bb_startGame();" id="startGame" class="submenu-button w3-green">Balls Clicker - Start</button>
        <button class="submenu-button">Game 2</button>
        <button class="submenu-button">Game 3</button>
        <button class="back-button" onclick="hideSubMenu()">Back</button>
    `;

    startMenu.appendChild(submenu);
}

function showHelpMenu() {
    document.querySelector('.menu-buttons').style.display = 'none';

    const helpMenu = document.createElement('div');
    helpMenu.classList.add('submenu');
    helpMenu.innerHTML = `
        <p>This is the Help menu.</p>
        <button class="back-button" onclick="hideSubMenu()">Back</button>
    `;

    document.querySelector('.start-menu').appendChild(helpMenu);
}

function showCreditsMenu() {
    document.querySelector('.menu-buttons').style.display = 'none';

    const creditsMenu = document.createElement('div');
    creditsMenu.classList.add('submenu');
    creditsMenu.innerHTML = `
        <p>Credits: Jake</p>
        <button class="back-button" onclick="hideSubMenu()">Back</button>
    `;

    document.querySelector('.start-menu').appendChild(creditsMenu);
}

function hideSubMenu() {
    const submenu = document.querySelector('.submenu');
    submenu.parentNode.removeChild(submenu);
    document.querySelector('.menu-buttons').style.display = 'flex';
}

function resetGameStatus() {
    const endScore = document.getElementById('endScore');
    endScore.textContent = '';

    playerQuit = false;

    const startMenu = document.querySelector('.start-menu');
    startMenu.style.opacity = 0; 
    startMenu.style.pointerEvents = 'none';
}

function handleGameOver(score) {
    const gameOverMessage = document.querySelector('.game-over-message');
    if (playerQuit) {
        gameOverMessage.textContent = 'Game Over - You Quit!';
    } else {
        if (score !== undefined) {
            gameOverMessage.textContent = 'Game Over - Score: ' + score;
        } else {
            gameOverMessage.textContent = '';
        }
    }

    gameOverMessage.style.display = 'block';

    const menuButtons = document.querySelector('.menu-buttons');
    menuButtons.style.display = 'none';

    const startMenu = document.querySelector('.start-menu');
    startMenu.style.opacity = 1;
    startMenu.style.pointerEvents = 'auto';
}

function handleEnd() {
    playerQuit = true;

    const gameOverMessage = document.querySelector('.game-over-message');
    gameOverMessage.textContent = 'Game Over - You Quit!';

    gameOverMessage.style.display = 'block';

    const menuButtons = document.querySelector('.menu-buttons');
    menuButtons.style.display = 'none';

    const startMenu = document.querySelector('.start-menu');
    startMenu.style.opacity = 1;
    startMenu.style.pointerEvents = 'auto';
}