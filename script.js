import { Game } from './Classes/Game.js';

let selectedCharacters = [];
let gameStarted = false;

function selectCharacter(element, character) {
    
    // If selected then remove
    if (selectedCharacters.includes(character)) {
        selectedCharacters = selectedCharacters.filter(c => c !== character);
        element.classList.remove('selected');
    } 
    // Max 2 selections
    else if (selectedCharacters.length < 2) {
        selectedCharacters.push(character);
        element.classList.add('selected');
    }
}

function startAnim() {
    if (selectedCharacters.length !== 2) {  
        alert("Please select 2 characters first!");
        return;
    }

    // Hide character selection and show game canvas
    document.querySelector('.character-container').style.display = 'none';
    document.querySelector('.buttons').style.display = 'none';

    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    const gameContainer = document.body; // Shake screen

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
                ctx.clearRect(0, 0, canvas.width, canvas.height);
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
    game.player1.lives += Math.floor(game.player1.lives * (game.player1.score / 200));
    game.player2.lives += Math.floor(game.player2.lives * game.player2.score / 200);
    if (game.player1.lives < 10) game.player1.lives = 10;
    if (game.player2.lives < 10) game.player2.lives = 10;
    game.player1.isEnd = true;
    game.player2.isEnd = true;
    game.background.isBeginAnim = true;
    game.player1.projectiles = [];
    game.player2.projectiles = [];

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
    alert("Use arrow keys to move your character and spacebar to jump. Avoid obstacles and reach the finish line!");
}
window.selectCharacter = selectCharacter;
window.startAnim = startAnim;
window.startGame = startGame;
window.showInstructions = showInstructions;