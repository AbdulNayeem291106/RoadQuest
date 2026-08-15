/* =========================================
   ROADQUEST
   Phase 4 - Basic Game Foundation
========================================= */

const player = document.getElementById("player");

const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");

const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const jumpButton = document.getElementById("jumpButton");

const coinCount = document.getElementById("coinCount");
const balloonCount = document.getElementById("balloonCount");
const giftCount = document.getElementById("giftCount");

let gameStarted = false;

/* =========================================
   PLAYER LANES
========================================= */

/*
   0 = Left lane
   1 = Center lane
   2 = Right lane
*/

let currentLane = 1;

const lanes = [
    38,
    50,
    62
];

/* =========================================
   PLAYER MOVEMENT
========================================= */

function updatePlayerLane() {

    player.style.left = lanes[currentLane] + "%";

}


/* =========================================
   MOVE LEFT
========================================= */

function moveLeft() {

    if (!gameStarted) {
        return;
    }

    if (currentLane > 0) {

        currentLane--;

        updatePlayerLane();

    }

}


/* =========================================
   MOVE RIGHT
========================================= */

function moveRight() {

    if (!gameStarted) {
        return;
    }

    if (currentLane < 2) {

        currentLane++;

        updatePlayerLane();

    }

}


/* =========================================
   JUMP
========================================= */

function jump() {

    if (!gameStarted) {
        return;
    }

    player.style.bottom = "24vh";

    setTimeout(() => {

        player.style.bottom = "9vh";

    }, 500);

}


/* =========================================
   START GAME
========================================= */

function startGame() {

    gameStarted = true;

    startScreen.style.display = "none";

    currentLane = 1;

    updatePlayerLane();

}


/* =========================================
   TOUCH CONTROLS
========================================= */

leftButton.addEventListener(
    "pointerdown",
    moveLeft
);

rightButton.addEventListener(
    "pointerdown",
    moveRight
);

jumpButton.addEventListener(
    "pointerdown",
    jump
);


/* =========================================
   START BUTTON
========================================= */

startButton.addEventListener(
    "click",
    startGame
);


/* =========================================
   KEYBOARD CONTROLS
========================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a") {

            moveLeft();

        }

        if (event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d") {

            moveRight();

        }

        if (event.key === "ArrowUp" ||
            event.key === " ") {

            event.preventDefault();

            jump();

        }

    }
);


/* =========================================
   INITIAL POSITION
========================================= */

updatePlayerLane();
