/* =========================================
   ROADQUEST
   PHASE 5
   Runner Movement + Swipe Controls
========================================= */

const player = document.getElementById("player");

const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");

const coinCount = document.getElementById("coinCount");
const balloonCount = document.getElementById("balloonCount");
const giftCount = document.getElementById("giftCount");


/* =========================================
   GAME STATE
========================================= */

let gameStarted = false;
let isJumping = false;


/* =========================================
   PLAYER LANES
========================================= */

/*
    0 = LEFT
    1 = CENTER
    2 = RIGHT
*/

let currentLane = 1;


/*
    These percentages determine
    the horizontal position of
    the runner.

    We will fine-tune these later
    after seeing the actual road.
*/

const lanes = [
    38,
    50,
    62
];


/* =========================================
   INITIAL PLAYER POSITION
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

    if (isJumping) {
        return;
    }

    isJumping = true;

    player.classList.add("jumping");


    /*
        Jump animation duration.
    */

    setTimeout(() => {

        player.classList.remove("jumping");

        isJumping = false;

    }, 550);

}


/* =========================================
   SWIPE CONTROL
========================================= */

let touchStartX = 0;
let touchStartY = 0;

let touchEndX = 0;
let touchEndY = 0;


/*
    Minimum distance required
    for a swipe to be detected.
*/

const SWIPE_THRESHOLD = 40;


/* =========================================
   TOUCH START
========================================= */

document.addEventListener(
    "touchstart",
    function(event) {

        if (!gameStarted) {
            return;
        }

        const touch = event.changedTouches[0];

        touchStartX = touch.screenX;
        touchStartY = touch.screenY;

    },
    {
        passive: true
    }
);


/* =========================================
   TOUCH END
========================================= */

document.addEventListener(
    "touchend",
    function(event) {

        if (!gameStarted) {
            return;
        }

        const touch = event.changedTouches[0];

        touchEndX = touch.screenX;
        touchEndY = touch.screenY;

        handleSwipe();

    },
    {
        passive: true
    }
);


/* =========================================
   PROCESS SWIPE
========================================= */

function handleSwipe() {

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);


    /*
        Ignore very small finger movements.
    */

    if (
        absX < SWIPE_THRESHOLD &&
        absY < SWIPE_THRESHOLD
    ) {
        return;
    }


    /*
        Horizontal swipe
        is stronger than vertical.
    */

    if (absX > absY) {

        if (deltaX < 0) {

            // Swipe LEFT
            moveLeft();

        } else {

            // Swipe RIGHT
            moveRight();

        }

    }


    /*
        Vertical swipe
    */

    else {

        if (deltaY < 0) {

            // Swipe UP
            jump();

        }

        /*
            Swipe DOWN intentionally
            does nothing for now.
        */

    }

}


/* =========================================
   START GAME
========================================= */

function startGame() {

    gameStarted = true;

    startScreen.style.display = "none";

    document.getElementById("game").classList.add("running");

    currentLane = 1;

    updatePlayerLane();

}
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

        /*
            LEFT
        */

        if (
            event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a"
        ) {

            moveLeft();

        }


        /*
            RIGHT
        */

        if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {

            moveRight();

        }


        /*
            JUMP
        */

        if (
            event.key === "ArrowUp" ||
            event.key === " "
        ) {

            event.preventDefault();

            jump();

        }

    }
);


/* =========================================
   INITIALIZATION
========================================= */

updatePlayerLane();
