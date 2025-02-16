import { Game } from './Classes/Game.js';

let selectedCharacters = [];
let gameStarted = false;

let firstCharacter = null;
let secondCharacter = null;

function selectCharacter(element, character) {
    if (firstCharacter === character) {
        firstCharacter = null;
        element.classList.remove('selected');
        element.removeAttribute('data-role');
    } 
    else if (secondCharacter === character) {
        secondCharacter = null;
        element.classList.remove('selected');
        element.removeAttribute('data-role'); 
    } 
    else if (firstCharacter === null) {
        firstCharacter = character;
        element.classList.add('selected');
        element.setAttribute('data-role', 'First Character');
    } 
    else if (secondCharacter === null) {
        secondCharacter = character;
        element.classList.add('selected');
        element.setAttribute('data-role', 'Second Character');
    }

    updateCharacterRoles();
}

function updateCharacterRoles() {
    document.querySelectorAll('.character').forEach(char => {
        const roleText = char.getAttribute('data-role');
        char.querySelector('.role-info')?.remove();

        if (roleText) {
            const roleInfo = document.createElement('p');
            roleInfo.classList.add('role-info');
            roleInfo.textContent = roleText;
            char.appendChild(roleInfo);
        }
    });
}



function startAnim() {
    if (firstCharacter == null || secondCharacter == null) {  
        alert("Please select 2 characters first!");
        return;
    }
    selectedCharacters = [firstCharacter,secondCharacter];

    document.querySelector('.character-container').style.display = 'none';
    document.querySelector('.buttons').style.display = 'none';

    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');

    if (gameStarted) return; 
    gameStarted = true; 

    const game = new Game(canvas.width, canvas.height);
    setTimeout(startGame, 6050);

    const slices = [];
    const numSlices = 20;
    const batchSize = 2;
    const waitTime = 1000; 

    let step = 0;
    const middleIndex = Math.floor(numSlices / 2);

    const crackSound = new Audio("./assets/sounds/crack.mp3"); 
    crackSound.volume = 0.7; // Adjust volume

    for (let i = 1; i <= numSlices; i++) {
        const img = new Image();
        img.src = `./assets/slices/slice_${i}.png`;
        slices.push(img);
    }

    function drawSlices() {
        if (crackSound.ended) return;

        game.background.draw(ctx, true);

        for (let i = 0; i <= step; i++) {
            let upperIndex = middleIndex - i;
            let lowerIndex = middleIndex + i;

            if (upperIndex >= 0) {
                ctx.drawImage(slices[upperIndex], 0, (canvas.height / numSlices) * upperIndex);
            }
            if (lowerIndex < numSlices) {
                ctx.drawImage(slices[lowerIndex], 0, (canvas.height / numSlices) * lowerIndex);
            }
        }

        step += batchSize;
        setTimeout(drawSlices, waitTime);
    }

    slices[numSlices - 1].onload = function () {
        if (slices[0].width && slices[0].height) {
            canvas.width = 1500;
            canvas.height = slices[0].height * numSlices;
        }

        document.getElementById('canvas1').style.display = 'block'; 

        crackSound.play();
        drawSlices();
    };

    game.background.draw(ctx, true);
}

function startGame() {
    //canvas setup
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1500;
    canvas.height = 500;
    const game = new Game(canvas.width, canvas.height);
        for (let i = 0; i < selectedCharacters.length; i++) {
            const element = selectedCharacters[i];
            if (element == 'Eli') {
                game['player' + (i + 1)].image = document.getElementById('eli');
                game['player' + (i + 1)].width = 77;
                game['player' + (i + 1)].height = 160;
                game['player' + (i + 1)].frameInterval = 150;
                game['player' + (i + 1)].id = 1;
                game['player' + (i + 1)].shootingSound = new Audio('./assets/sounds/swordSound.mp3');
                game['player' + (i + 1)].winningImage.src = './assets/winningImages/winningImageEli.png';

            }
            else if (element == 'Shai'){
                game['player' + (i + 1)].image = document.getElementById('shai');
                game['player' + (i + 1)].width = 100;
                game['player' + (i + 1)].height = 190;
                game['player' + (i + 1)].maxFrame = 5;
                game['player' + (i + 1)].frameInterval = 125;
                game['player' + (i + 1)].id = 2;
                game['player' + (i + 1)].shootingSound = new Audio('./assets/sounds/shatzSound.m4a');
                game['player' + (i + 1)].winningImage.src = './assets/winningImages/winningImageShai.png';
                game['player' + (i + 1)].winningSound = new Audio('./assets/sounds/winningSoundShai.mp3');

            }
            else if (element == 'Ron'){
                game['player' + (i + 1)].image = document.getElementById('ron');
                game['player' + (i + 1)].width = 94;
                game['player' + (i + 1)].height = 180;
                game['player' + (i + 1)].maxFrame = 4;
                game['player' + (i + 1)].frameInterval = 125;
                game['player' + (i + 1)].id = 3;
                game['player' + (i + 1)].shootingSound = new Audio('./assets/sounds/bootSound.mp3');
                game['player' + (i + 1)].winningImage.src = './assets/winningImages/winningImageRon.png';

            } else {
                game['player' + (i + 1)].image = document.getElementById('master');
                game['player' + (i + 1)].width = 114;
                game['player' + (i + 1)].height = 185;
                game['player' + (i + 1)].maxFrame = 9;
                game['player' + (i + 1)].frameInterval = 100;
                game['player' + (i + 1)].id = 4;
                game['player' + (i + 1)].shootingSound = new Audio('./assets/sounds/cardThrowSound.mp3');
                game['player' + (i + 1)].winningImage.src = './assets/winningImages/winningImageCard.png';
            }
        }

    game.gameTime = 0; 
    let lastTime = performance.now(); 
    //animation loops
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        if (game.gameTime <= game.timeLimit) requestAnimationFrame(animate);
        else startReverseAnim(game, ctx, canvas, lastTime);
    }
    animate(lastTime);
}

function startReverseAnim(game, ctx, canvas, lastTime) {
    setTimeout(endGame, 6250, game, ctx, canvas, lastTime);

    canvas.width = 1500;
    canvas.height = 500;

    const slices = [];
    const numSlices = 20; // Total slices
    const batchSize = 4; // Number of slices removed per step (2 from top, 2 from bottom)
    const quickTime = 625; // 0.625 seconds
    const waitTime = 1000; // 1 second

    for (let i = 1; i <= numSlices; i++) {
        const img = new Image();
        img.src = `./assets/slices/slice_${i}.png`; 
        slices.push(img);
    }

    let topIndex = 0; 
    let bottomIndex = numSlices - 1; 

    function drawSlices() {
        game.background.draw(ctx, true);

        for (let i = 0; i < numSlices; i++) {
            if (i >= topIndex && i <= bottomIndex) {
                ctx.drawImage(slices[i], 0, (canvas.height / numSlices) * i);
            }
        }

        topIndex += 2;
        bottomIndex -= 2;

        if (topIndex === 8 && bottomIndex === 11) {
            topIndex += 1;
            bottomIndex -= 1; 
        }

        if (topIndex >= bottomIndex) {
            setTimeout(() => {
                game.background.draw(ctx, true); 

            }, quickTime);
            return;
        }

        let nextDelay = (topIndex < bottomIndex) ? waitTime : quickTime;
        setTimeout(drawSlices, nextDelay);
    }

    // Start animation when images are loaded
    slices[numSlices - 1].onload = function () {
        canvas.width = 1500;
        canvas.height = slices[0].height * numSlices;
        drawSlices();
    };
}

function endGame(game, ctx, canvas, lastTime){
    game.player1.lives += Math.floor((game.player1.score / 2));
    game.player2.lives += Math.floor((game.player2.score / 2));
    if (game.player1.lives < 10) game.player1.lives = 10;
    if (game.player2.lives < 10) game.player2.lives = 10;
    game.player1.isEnd = true;
    game.player2.isEnd = true;
    game.background.isBeginAnim = true;
    game.player1.projectiles = [];
    game.player2.projectiles = [];
    game.particles = [];

    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate(lastTime);
}

function showInstructions() {
    const modal = document.getElementById('instruction-modal');
    modal.style.visibility = 'visible'; // Ensure the modal is interactable
    modal.style.opacity = '1'; // Ensure full opacity
    modal.classList.add('show'); // Trigger slide-up animation
}

function closeInstructions() {
    const modal = document.getElementById('instruction-modal');

    // Trigger slide-down animation
    modal.classList.remove('show');

    // Wait for the transition to finish, then hide the modal
    modal.addEventListener('transitionend', function handleTransitionEnd() {
        modal.style.visibility = 'hidden'; // Prevent interaction
        modal.style.opacity = '0'; // Reset opacity for next time
        modal.removeEventListener('transitionend', handleTransitionEnd); // Clean up event listener
    });
}

window.selectCharacter = selectCharacter;
window.startAnim = startAnim;
window.startGame = startGame;
window.showInstructions = showInstructions;
window.closeInstructions = closeInstructions;