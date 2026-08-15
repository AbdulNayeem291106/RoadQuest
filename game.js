/* =========================================
   ROADQUEST
   PHASE 6
   Perspective + Moving Obstacles
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const game = document.getElementById("game");

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
let gameOver = false;

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
    The runner's position at the
    bottom of the road.

    These values correspond much
    better to the visible three
    road lanes.
*/

const playerLaneX = [
    17,
    50,
    83
];


/* =========================================
   PLAYER POSITION
========================================= */

function updatePlayerLane() {

    player.style.left =
        playerLaneX[currentLane] + "%";

}


/* =========================================
   MOVE LEFT
========================================= */

function moveLeft() {

    if (!gameStarted || gameOver) {
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

    if (!gameStarted || gameOver) {
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

    if (!gameStarted || gameOver) {
        return;
    }

    if (isJumping) {
        return;
    }

    isJumping = true;

    player.classList.add("jumping");


    setTimeout(() => {

        player.classList.remove("jumping");

        isJumping = false;

    }, 550);

}


/* =========================================
   OBSTACLE SYSTEM
========================================= */

let obstacles = [];

let obstacleTimer = null;

let lastObstacleTime = 0;


/*
    Minimum time between obstacle
    spawns.

    We start relatively slowly
    so the game is easy to test.
*/

const OBSTACLE_INTERVAL = 1300;


/*
    Obstacle speed.

    Higher number = faster.
*/

const OBSTACLE_SPEED = 0.00038;


/*
    Starting depth.

    0 = far distance

    1 = player position
*/

const START_DEPTH = 0;


/*
    Collision depth.

    When obstacle reaches this
    depth, it is close enough to
    collide with the runner.
*/

const COLLISION_DEPTH = 0.88;


/* =========================================
   LANE PERSPECTIVE
========================================= */

/*
    Lane separation at the player's
    position.

    The road converges toward the
    center as objects move farther
    away.
*/

const laneOffset = [
    -33,
    0,
    33
];


/*
    Calculate horizontal position
    according to perspective.
*/

function getLaneX(lane, depth) {

    const offset =
        laneOffset[lane] * depth;

    return 50 + offset;

}


/* =========================================
   DEPTH → SCREEN POSITION
========================================= */

function getObstacleY(depth) {

    /*
        The obstacle begins near the
        horizon and moves toward the
        bottom of the screen.
    */

    const horizonY = 30;

    const playerY = 82;

    return horizonY +
        ((playerY - horizonY) * depth);

}


/* =========================================
   OBSTACLE SCALE
========================================= */

function getObstacleScale(depth) {

    /*
        Small when far away.
        Large near player.
    */

    return 0.15 + (depth * 1.05);

}


/* =========================================
   CREATE OBSTACLE
========================================= */

function createObstacle() {

    if (!gameStarted || gameOver) {
        return;
    }


    /*
        Random lane.
    */

    const lane =
        Math.floor(Math.random() * 3);


    /*
        Random obstacle.

        50% car
        50% barricade
    */

    const type =
        Math.random() < 0.5
            ? "car"
            : "barricade";


    const obstacle =
        document.createElement("img");


    obstacle.classList.add(
        "obstacle"
    );


    if (type === "car") {

        obstacle.src = "car.png";

        obstacle.classList.add(
            "car-obstacle"
        );

    } else {

        obstacle.src =
            "barricade.png";

        obstacle.classList.add(
            "barricade-obstacle"
        );

    }


    obstacle.alt = "";


    /*
        Store obstacle information.
    */

    const obstacleData = {

        element: obstacle,

        lane: lane,

        depth: START_DEPTH,

        type: type,

        active: true

    };


    obstacles.push(obstacleData);


    game.appendChild(obstacle);


    updateObstaclePosition(
        obstacleData
    );

}


/* =========================================
   UPDATE OBSTACLE POSITION
========================================= */

function updateObstaclePosition(
    obstacle
) {

    const depth =
        obstacle.depth;


    const x =
        getLaneX(
            obstacle.lane,
            depth
        );


    const y =
        getObstacleY(depth);


    const scale =
        getObstacleScale(depth);


    obstacle.element.style.left =
        x + "%";


    obstacle.element.style.top =
        y + "%";


    obstacle.element.style.transform =
        `translate(-50%, -50%) scale(${scale})`;


    /*
        Obstacles farther away should
        appear behind nearby objects.
    */

    obstacle.element.style.zIndex =
        Math.floor(
            10 + depth * 20
        );

}


/* =========================================
   COLLISION DETECTION
========================================= */

function checkCollision(
    obstacle
) {

    /*
        Only check when the obstacle
        is close to the player.
    */

    if (
        obstacle.depth <
        COLLISION_DEPTH
    ) {

        return false;

    }


    /*
        Different lane = no collision.
    */

    if (
        obstacle.lane !==
        currentLane
    ) {

        return false;

    }


    /*
        If the player is jumping,
        the barricade can be avoided.

        Cars remain dangerous even
        while jumping in this phase.
    */

    if (
        obstacle.type ===
        "barricade" &&
        isJumping
    ) {

        return false;

    }


    return true;

}


/* =========================================
   REMOVE OBSTACLE
========================================= */

function removeObstacle(
    obstacle
) {

    obstacle.active = false;


    if (
        obstacle.element &&
        obstacle.element.parentNode
    ) {

        obstacle.element.parentNode
            .removeChild(
                obstacle.element
            );

    }

}


/* =========================================
   GAME LOOP
========================================= */

let lastFrameTime = 0;


function gameLoop(
    timestamp
) {

    if (!gameStarted) {

        requestAnimationFrame(
            gameLoop
        );

        return;

    }


    if (gameOver) {

        return;

    }


    /*
        Calculate frame time.
    */

    if (!lastFrameTime) {

        lastFrameTime =
            timestamp;

    }


    const deltaTime =
        timestamp -
        lastFrameTime;


    lastFrameTime =
        timestamp;


    /*
        Create obstacles
        periodically.
    */

    if (
        timestamp -
        lastObstacleTime
        >=
        OBSTACLE_INTERVAL
    ) {

        createObstacle();

        lastObstacleTime =
            timestamp;

    }


    /*
        Move all obstacles.
    */

    for (
        let i = obstacles.length - 1;
        i >= 0;
        i--
    ) {

        const obstacle =
            obstacles[i];


        if (!obstacle.active) {

            continue;

        }


        /*
            Move toward player.
        */

        obstacle.depth +=
            OBSTACLE_SPEED *
            deltaTime;


        /*
            Update visual position.
        */

        updateObstaclePosition(
            obstacle
        );


        /*
            Check collision.
        */

        if (
            checkCollision(
                obstacle
            )
        ) {

            endGame();

            return;

        }


        /*
            Remove after passing
            the player.
        */

        if (
            obstacle.depth > 1.15
        ) {

            removeObstacle(
                obstacle
            );

            obstacles.splice(
                i,
                1
            );

        }

    }


    requestAnimationFrame(
        gameLoop
    );

}


/* =========================================
   START GAME
========================================= */

function startGame() {

    gameStarted = true;

    gameOver = false;

    isJumping = false;


    startScreen.style.display =
        "none";


    game.classList.add(
        "running"
    );


    currentLane = 1;

    updatePlayerLane();


    /*
        Reset obstacle system.
    */

    obstacles = [];

    lastObstacleTime =
        performance.now();


    lastFrameTime = 0;


    /*
        Remove any old obstacles.
    */

    document
        .querySelectorAll(
            ".obstacle"
        )
        .forEach(
            obstacle => obstacle.remove()
        );


    requestAnimationFrame(
        gameLoop
    );

}


/* =========================================
   GAME OVER
========================================= */

function endGame() {

    gameOver = true;

    gameStarted = false;


    game.classList.remove(
        "running"
    );


    /*
        Stop all obstacles.
    */

    obstacles.forEach(
        obstacle => {

            removeObstacle(
                obstacle
            );

        }
    );


    obstacles = [];


    /*
        Show Game Over screen.
    */

    showGameOver();

}


/* =========================================
   GAME OVER SCREEN
========================================= */

function showGameOver() {

    startScreen.style.display =
        "block";


    startScreen.innerHTML = `

        <h1>Game Over</h1>

        <p>
            You hit an obstacle!
        </p>

        <button id="restartButton">
            PLAY AGAIN
        </button>

    `;


    document
        .getElementById(
            "restartButton"
        )
        .addEventListener(
            "click",
            restartGame
        );

}


/* =========================================
   RESTART GAME
========================================= */

function restartGame() {

    /*
        Reset counters for now.
    */

    coinCount.textContent =
        "0";

    balloonCount.textContent =
        "0";

    giftCount.textContent =
        "0";


    /*
        Restore start screen.
    */

    startScreen.innerHTML = `

        <h1>RoadQuest</h1>

        <p>
            Run • Dodge • Collect
        </p>

        <button id="startButton">
            START GAME
        </button>

    `;


    /*
        Reconnect start button.
    */

    document
        .getElementById(
            "startButton"
        )
        .addEventListener(
            "click",
            startGame
        );


    startScreen.style.display =
        "block";


    gameOver = false;

}


/* =========================================
   SWIPE CONTROLS
========================================= */

let touchStartX = 0;
let touchStartY = 0;

let touchEndX = 0;
let touchEndY = 0;


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


        const touch =
            event.changedTouches[0];


        touchStartX =
            touch.screenX;


        touchStartY =
            touch.screenY;

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


        const touch =
            event.changedTouches[0];


        touchEndX =
            touch.screenX;


        touchEndY =
            touch.screenY;


        handleSwipe();

    },
    {
        passive: true
    }
);


/* =========================================
   HANDLE SWIPE
========================================= */

function handleSwipe() {

    const deltaX =
        touchEndX -
        touchStartX;


    const deltaY =
        touchEndY -
        touchStartY;


    const absX =
        Math.abs(deltaX);


    const absY =
        Math.abs(deltaY);


    /*
        Ignore tiny movements.
    */

    if (
        absX < SWIPE_THRESHOLD &&
        absY < SWIPE_THRESHOLD
    ) {

        return;

    }


    /*
        Horizontal swipe.
    */

    if (absX > absY) {

        if (deltaX < 0) {

            moveLeft();

        } else {

            moveRight();

        }

    }


    /*
        Vertical swipe.
    */

    else {

        if (deltaY < 0) {

            jump();

        }

    }

}


/* =========================================
   KEYBOARD CONTROLS
========================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a"
        ) {

            moveLeft();

        }


        if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {

            moveRight();

        }


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
   INITIAL POSITION
========================================= */

updatePlayerLane();
