// Image variables
const PIECE_IMAGE = new Image();
const QUEUE_IMAGE = new Image();
const BOARD_IMAGE = new Image();
const GHOST_IMAGE = new Image();
const HOLD_DISABLED_IMAGE = new Image();
const INDICATOR_IMAGE = new Image();
PIECE_IMAGE.src =
  "../../../../assets/skin" +
  JSON.parse(localStorage.getItem("Settings")).cosmetics.skin +
  "/piece.png";
QUEUE_IMAGE.src =
  "../../../../assets/skin" +
  JSON.parse(localStorage.getItem("Settings")).cosmetics.skin +
  "/queue.png";
BOARD_IMAGE.src =
  "../../../../assets/background" +
  JSON.parse(localStorage.getItem("Settings")).cosmetics.background +
  "/board.png";
GHOST_IMAGE.src =
  "../../../../assets/background" +
  JSON.parse(localStorage.getItem("Settings")).cosmetics.background +
  "/ghost.png";
HOLD_DISABLED_IMAGE.src =
  "../../../../assets/background" +
  JSON.parse(localStorage.getItem("Settings")).cosmetics.background +
  "/hold-disabled.png";
INDICATOR_IMAGE.src =
  "../../../../assets/background" +
  JSON.parse(localStorage.getItem("Settings")).cosmetics.background +
  "/indicator.png";

// Array to dynamically select style attribute for each background's size and canvas backdrop opacity
const BACKGROUND_LOOKUP = [
  // Default
  { size: "100%", opacity: "0.0" },
  // Night Sky
  { size: "cover", opacity: "0.5" },
  // Cosmos
  { size: "cover", opacity: "0.5" },
  // Gradient
  { size: "cover", opacity: "0.0" },
  // Light Beams
  { size: "cover", opacity: "0.75" },
];

// Canvas variables
const canvas = document.getElementById("playingField");
canvas.setAttribute(
  "style",
  "background-color: rgba(0, 0, 0, " +
    BACKGROUND_LOOKUP[
      JSON.parse(localStorage.getItem("Settings")).cosmetics.background - 1
    ].opacity +
    ");",
);
const ctx = canvas.getContext("2d");
canvas.width = 802;
canvas.height = 802;
ctx.fillStyle = "rgb(255, 255, 255)";

// Background image
let background = document.getElementById("game");
background.setAttribute(
  "style",
  "background-size: " +
    BACKGROUND_LOOKUP[
      JSON.parse(localStorage.getItem("Settings")).cosmetics.background - 1
    ].size +
    "; background-image: url(../../../../assets/background" +
    JSON.parse(localStorage.getItem("Settings")).cosmetics.background +
    "/background.png);",
);

// Pause screen
let pauseScreen = document.getElementById("pauseScreen");
let pauseButton = document.getElementById("pauseButton");

// Post-game screen
let postGameScreen = document.getElementById("postGameScreen");
let postGameMessage = document.getElementById("postGameMessage");
let summaryMessage = document.getElementById("summaryMessage");

// Game variables
let pieceRotationState = 0;
let pieceSpritePositionX = 3;
let pieceSpritePositionY = 0;
let pieceHeld = 7;
let lockResetCount = 0;
let queuePosition = 0;
let attemptHoldLimited = false;

let pieceTimer = 1;
let pieceLockTimer = 0;
let dasRateTimer = 1;
let preGameTimer = 299;
let gameTimer = 0;

let score = 0;
let linesCleared = 0;
let combo = -1;
let level = 1;
let spinActive = false;
let backToBackActive = false;
let backToBackCharged = false;
let perfectClear;

let gameStarted = false;
let gameCleared = false;
let gamePaused = false;

let holdImage;
let currentPieceImage = PIECE_IMAGE;

let indicatorSelectionLast = [0, 7];
let indicatorSelection = [0, 7];
let indicatorAnimTimer = -1;
let indicatorFadeoutTimer = -1;
let indicatorOpacityRatio = 1.0;
let fadeoutActive = true;

let plasticMode = false;
let plasticLinesCleared = 0;

let totalRotations = 0;
let totalPieceLocks = 0;

// Input variables
let rotateCwPressed = false;
let rotateCwLimited = false;

let rotateCcwPressed = false;
let rotateCcwLimited = false;

let moveRightPressed = false;
let moveRightLimited = false;
let moveRightTimer = 0;

let moveLeftPressed = false;
let moveLeftLimited = false;
let moveLeftTimer = 0;

let moveDownPressed = false;
let moveDownLimited = false;
let moveDownTimer = 0;

let hardDropPressed = false;
let hardDropLimited = false;

let holdPressed = false;
let holdLimited = false;

let pausePressed = false;
let pauseLimited = false;

const ROTATION_DATA = {
  // Internally stored positions of the blocks at each of their rotations
  positions: {
    // I piece block positions
    0: {
      rotation0: [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],

      rotation1: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],

      rotation2: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],

      rotation3: [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
    },

    // Z piece block positions
    1: {
      rotation0: [1, 1, 0, 0, 1, 1, 0, 0, 0],

      rotation1: [0, 0, 1, 0, 1, 1, 0, 1, 0],

      rotation2: [0, 0, 0, 1, 1, 0, 0, 1, 1],

      rotation3: [0, 1, 0, 1, 1, 0, 1, 0, 0],
    },

    // S piece block positions
    2: {
      rotation0: [0, 1, 1, 1, 1, 0, 0, 0, 0],

      rotation1: [0, 1, 0, 0, 1, 1, 0, 0, 1],

      rotation2: [0, 0, 0, 0, 1, 1, 1, 1, 0],

      rotation3: [1, 0, 0, 1, 1, 0, 0, 1, 0],
    },

    // J piece block positions
    3: {
      rotation0: [1, 0, 0, 1, 1, 1, 0, 0, 0],

      rotation1: [0, 1, 1, 0, 1, 0, 0, 1, 0],

      rotation2: [0, 0, 0, 1, 1, 1, 0, 0, 1],

      rotation3: [0, 1, 0, 0, 1, 0, 1, 1, 0],
    },

    // L piece block positions
    4: {
      rotation0: [0, 0, 1, 1, 1, 1, 0, 0, 0],

      rotation1: [0, 1, 0, 0, 1, 0, 0, 1, 1],

      rotation2: [0, 0, 0, 1, 1, 1, 1, 0, 0],

      rotation3: [1, 1, 0, 0, 1, 0, 0, 1, 0],
    },

    // T piece block positions
    5: {
      rotation0: [0, 1, 0, 1, 1, 1, 0, 0, 0],

      rotation1: [0, 1, 0, 0, 1, 1, 0, 1, 0],

      rotation2: [0, 0, 0, 1, 1, 1, 0, 1, 0],

      rotation3: [0, 1, 0, 1, 1, 0, 0, 1, 0],
    },

    // O piece block positions
    6: {
      rotation0: [0, 1, 1, 0, 1, 1, 0, 0, 0],

      rotation1: [0, 1, 1, 0, 1, 1, 0, 0, 0],

      rotation2: [0, 1, 1, 0, 1, 1, 0, 0, 0],

      rotation3: [0, 1, 1, 0, 1, 1, 0, 0, 0],
    },
  },

  // Internally stored testing data for kicks (SRS)
  kicks: {
    // Z, S, J, L, T and O tests
    0: {
      // Rotation state 0 -> 1
      "01": {
        test0: [0, 0],
        test1: [-1, 0],
        test2: [-1, 1],
        test3: [0, -2],
        test4: [-1, -2],
      },

      // Rotation state 1 -> 0
      10: {
        test0: [0, 0],
        test1: [1, 0],
        test2: [1, -1],
        test3: [0, 2],
        test4: [1, 2],
      },

      // Rotation state 1 -> 2
      12: {
        test0: [0, 0],
        test1: [1, 0],
        test2: [1, -1],
        test3: [0, 2],
        test4: [1, 2],
      },

      // Rotation state 2 -> 1
      21: {
        test0: [0, 0],
        test1: [-1, 0],
        test2: [-1, 1],
        test3: [0, -2],
        test4: [-1, -2],
      },

      // Rotation state 2 -> 3
      23: {
        test0: [0, 0],
        test1: [1, 0],
        test2: [1, 1],
        test3: [0, -2],
        test4: [1, -2],
      },

      // Rotation state 3 -> 2
      32: {
        test0: [0, 0],
        test1: [-1, 0],
        test2: [-1, -1],
        test3: [0, 2],
        test4: [-1, 2],
      },

      // Rotation state 3 -> 0
      30: {
        test0: [0, 0],
        test1: [-1, 0],
        test2: [-1, -1],
        test3: [0, 2],
        test4: [-1, 2],
      },

      // Rotation state 0 -> 3
      "03": {
        test0: [0, 0],
        test1: [1, 0],
        test2: [1, 1],
        test3: [0, -2],
        test4: [1, -2],
      },
    },

    // I piece tests
    1: {
      // Rotation state 0 -> 1
      "01": {
        test0: [0, 0],
        test1: [-2, 0],
        test2: [1, 0],
        test3: [-2, -1],
        test4: [1, 2],
      },

      // Rotation state 1 -> 0
      10: {
        test0: [0, 0],
        test1: [2, 0],
        test2: [-1, 0],
        test3: [2, 1],
        test4: [-1, -2],
      },

      // Rotation state 1 -> 2
      12: {
        test0: [0, 0],
        test1: [-1, 0],
        test2: [2, 0],
        test3: [-1, 2],
        test4: [2, -1],
      },

      // Rotation state 2 -> 1
      21: {
        test0: [0, 0],
        test1: [1, 0],
        test2: [-2, 0],
        test3: [1, -2],
        test4: [-2, 1],
      },

      // Rotation state 2 -> 3
      23: {
        test0: [0, 0],
        test1: [2, 0],
        test2: [-1, 0],
        test3: [2, 1],
        test4: [-1, -2],
      },

      // Rotation state 3 -> 2
      32: {
        test0: [0, 0],
        test1: [-2, 0],
        test2: [1, 0],
        test3: [-2, -1],
        test4: [1, 2],
      },

      // Rotation state 3 -> 0
      30: {
        test0: [0, 0],
        test1: [1, 0],
        test2: [-2, 0],
        test3: [1, -2],
        test4: [-2, 1],
      },

      // Rotation state 0 -> 3
      "03": {
        test0: [0, 0],
        test1: [-1, 0],
        test2: [2, 0],
        test3: [-1, 2],
        test4: [2, -1],
      },
    },
  },
};

// Object to store data for each level's gravity and the amount of lines to advance to the next level
const LEVEL_DATA = {
  // Level 1
  1: {
    gravity: 100,
    linesToClear: 10,
  },

  // Level 2
  2: {
    gravity: 85,
    linesToClear: 20,
  },

  // Level 3
  3: {
    gravity: 60,
    linesToClear: 30,
  },

  // Level 4
  4: {
    gravity: 50,
    linesToClear: 40,
  },

  // Level 5
  5: {
    gravity: 40,
    linesToClear: 50,
  },

  // Level 6
  6: {
    gravity: 30,
    linesToClear: 60,
  },

  // Level 7
  7: {
    gravity: 20,
    linesToClear: 70,
  },

  // Level 8
  8: {
    gravity: 10,
    linesToClear: 80,
  },

  // Level 9
  9: {
    gravity: 8,
    linesToClear: 90,
  },

  // Level 10
  10: {
    gravity: 6,
    linesToClear: 100,
  },

  // Level 11
  11: {
    gravity: 5,
    linesToClear: 120,
  },

  // Level 12
  12: {
    gravity: 4,
    linesToClear: 140,
  },

  // Level 13
  13: {
    gravity: 3,
    linesToClear: 160,
  },

  // Level 14
  14: {
    gravity: 2,
    linesToClear: 200,
  },

  // Level 15
  15: {
    gravity: 1,
    linesToClear: -1,
  },
};

// Collision map
let collisionMap = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// Listen for key presses
addEventListener("keydown", (event) => {
  actOnKeypress(event.code, true);
});

// Listen for key releases
addEventListener("keyup", (event) => {
  actOnKeypress(event.code, false);
});

// Function that does some cool maths to give us the values we need for the sensitivity to work properly
function splitSensitivityRate(rate, isTimer) {
  // If we want to get the timer from the base number
  if (isTimer) {
    if (rate >= 10) {
      return rate / 10;
    } else {
      return 1;
    }
  }

  // If we want to get the magnitude from the base number
  // Acceptable magnitudes are 1/10ms (<= 10 rate), 2/10ms (== 5 rate), 5/10ms (== 2 rate), and 20/10ms (== 0.5 rate)
  else {
    if (rate <= 10) {
      return 10 / rate;
    } else {
      return 1;
    }
  }
}

// Checks if a piece will go out of bounds due to a movement, returns true if it will
function checkMovementCollision(xDirection, yDirection) {
  // Loop through every row in the current piece's rotation
  for (
    let y = 0;
    y < Math.sqrt(ROTATION_DATA.positions[pieceCurrent].rotation0.length);
    y++
  ) {
    // Loop through every column in the current piece's rotation
    for (
      let x = 0;
      x < Math.sqrt(ROTATION_DATA.positions[pieceCurrent].rotation0.length);
      x++
    ) {
      // If the position we're analysing is a 1
      if (
        ROTATION_DATA.positions[pieceCurrent][
          "rotation" + (((pieceRotationState % 4) + 4) % 4)
        ][
          y *
            Math.sqrt(ROTATION_DATA.positions[pieceCurrent].rotation0.length) +
            x
        ] == 1 &&
        // AND If the border of the map is blocking the direction we're trying to move in (up/down)
        (pieceSpritePositionY + yDirection + y <= -1 ||
          pieceSpritePositionY + yDirection + y >= 20 ||
          // OR If the border of the map is blocking the direction we're trying to move in (left/right)
          pieceSpritePositionX + xDirection + x <= -1 ||
          pieceSpritePositionX + xDirection + x >= 10 ||
          // OR If there is a block on the collision map that's blocking the direction that we're trying to move in
          collisionMap[pieceSpritePositionY + yDirection + y][
            pieceSpritePositionX + xDirection + x
          ] > 0)
      ) {
        return true;
      }
    }
  }

  return false;
}

// Handles piece rotation
function attemptRotation(rotationDirection) {
  let offsetX;
  let offsetY;
  let colliding;
  let currentTest;

  // Loop through all 5 tests
  for (let i = 0; i < 5; i++) {
    offsetX =
      ROTATION_DATA.kicks[Math.round(1 / (10 * pieceCurrent + 1))][
        String(((pieceRotationState % 4) + 4) % 4) +
          String((((pieceRotationState + rotationDirection) % 4) + 4) % 4)
      ]["test" + i][0];
    offsetY =
      ROTATION_DATA.kicks[Math.round(1 / (10 * pieceCurrent + 1))][
        String(((pieceRotationState % 4) + 4) % 4) +
          String((((pieceRotationState + rotationDirection) % 4) + 4) % 4)
      ]["test" + i][1];

    colliding = false;
    currentTest = i;

    // Loop through every row in the current piece's rotation
    for (
      let y = 0;
      y < Math.sqrt(ROTATION_DATA.positions[pieceCurrent].rotation0.length) &&
      !colliding;
      y++
    ) {
      // Loop through every column in the current piece's rotation
      for (
        let x = 0;
        x < Math.sqrt(ROTATION_DATA.positions[pieceCurrent].rotation0.length) &&
        !colliding;
        x++
      ) {
        // If the position we're analysing is a 1
        if (
          ROTATION_DATA.positions[pieceCurrent][
            "rotation" +
              ((((pieceRotationState + rotationDirection) % 4) + 4) % 4)
          ][
            y *
              Math.sqrt(
                ROTATION_DATA.positions[pieceCurrent].rotation0.length,
              ) +
              x
          ] == 1 &&
          // AND If the border of the map is blocking the direction we're trying to move in (up/down)
          (pieceSpritePositionY - offsetY + y <= -1 ||
            pieceSpritePositionY - offsetY + y >= 20 ||
            // OR If the border of the map is blocking the direction we're trying to move in (left/right)
            pieceSpritePositionX + offsetX + x <= -1 ||
            pieceSpritePositionX + offsetX + x >= 10 ||
            // OR If there is a block on the collision map that's blocking the direction that we're trying to rotate in
            collisionMap[pieceSpritePositionY - offsetY + y][
              pieceSpritePositionX + offsetX + x
            ] > 0)
        ) {
          colliding = true;
        }
      }
    }

    // If the rotation succeeds
    if (!colliding) {
      attemptSoftDropReset();
      totalRotations++;

      pieceRotationState += rotationDirection;
      pieceSpritePositionX += offsetX;
      pieceSpritePositionY -= offsetY;

      spinActive = false;

      // Check for piece spin
      // If the current piece is anything other than the I or O piece, and it just did the required kick for one of these spins to occur
      if (
        currentTest == 4 &&
        pieceCurrent > 0 &&
        pieceCurrent < 6 &&
        (((pieceRotationState % 4) + 4) % 4 == 3 ||
          ((pieceRotationState % 4) + 4) % 4 == 1)
      ) {
        spinActive = true;
      }

      // Check for T-spin double
      // If the current piece is a T-piece and is on its 3rd rotation state
      if (
        pieceCurrent == 5 &&
        ((pieceRotationState % 4) + 4) % 4 == 2 &&
        // AND
        // If the piece has an overhang on the top left or top right corner on its grid
        (collisionMap[pieceSpritePositionY][pieceSpritePositionX] > 0 ||
          collisionMap[pieceSpritePositionY][pieceSpritePositionX + 2] > 0)
      ) {
        spinActive = true;
      }

      return;
    }
  }
}

// Generate a bag for the 7-bag algorithm
function generateBag() {
  // Start with an unshuffled bag
  let bag = [0, 1, 2, 3, 4, 5, 6];
  let randomIndex;
  let currentIndex = 7;

  // Shuffle the bag
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [bag[currentIndex], bag[randomIndex]] = [
      bag[randomIndex],
      bag[currentIndex],
    ];
  }
  return bag;
}

// Reset the piece variables (position, rotation, timers, etc.)
function resetPiece() {
  lockResetCount = 0;
  pieceSpritePositionX = 3;
  pieceSpritePositionY = 0;
  pieceRotationState = 0;
  pieceTimer = 1;
  pieceLockTimer = 0;
  spinActive = false;

  checkTopOut();
}

// Advances the piece queue
function advanceQueue() {
  queuePosition++;

  if (queuePosition == 7) {
    bag1 = bag2;
    bag2 = generateBag();
    pieceQueue = bag1.concat(bag2);
    queuePosition = 0;
  }

  pieceCurrent = pieceQueue[queuePosition];

  resetPiece();
}

// Clear lines that are currently full
function clearFullLines(potentialLines) {
  let lineFull;
  let currentLinesCleared = 0;
  let plasticMultiplier = 1;
  perfectClear = true;

  // Iterate 4 times for each possible column
  for (let y = 0; y < 4; y++) {
    lineFull = true;

    // Iterate through each block that could potentially cause a line clear
    for (let i = 0; i < 10; i++) {
      if (collisionMap[(potentialLines + y) % 20][i] == 0) {
        lineFull = false;
        break;
      }
    }

    if (lineFull) {
      if (collisionMap[(potentialLines + y) % 20].includes(8)) {
        plasticMultiplier += 0.5;
        plasticLinesCleared++;
      }

      // Clear the full line
      collisionMap.splice((potentialLines + y) % 20, 1);
      collisionMap.splice(0, 0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      currentLinesCleared++;
    }
  }

  if (plasticMode && currentLinesCleared > 0) {
    updatePlasticLines();
  }

  linesCleared += currentLinesCleared;

  // Set Back-to-back condition accordingly
  if (currentLinesCleared == 4 || (spinActive && currentLinesCleared > 0)) {
    if (backToBackCharged) {
      backToBackActive = true;
    }

    backToBackCharged = true;
  } else if (currentLinesCleared != 0) {
    backToBackCharged = false;
    backToBackActive = false;
  }

  // Check for a perfect clear
  for (y = 0; y < 20 && perfectClear; y++) {
    for (x = 0; x < 10; x++) {
      if (collisionMap[y][x] > 0) {
        perfectClear = false;
      }
    }
  }

  // If the line clear that just happened was a perfect clear
  if (perfectClear) {
    updateIndicator(0, false);
    score += (10000 + (combo + 1) * 50) * plasticMultiplier * level;
  }

  // If it wasn't
  else {
    switch (currentLinesCleared) {
      // If the player clears a single
      case 1:
        // Back-to-Back Spin Single
        if (spinActive && backToBackActive) {
          updateIndicator(1, true);
          score += (1200 + (combo + 1) * 50) * plasticMultiplier * level;
        }

        // Spin Single
        else if (spinActive) {
          updateIndicator(1, true);
          score += (800 + (combo + 1) * 50) * plasticMultiplier * level;
        }

        // Single
        else {
          updateIndicator(1, false);
          score += (100 + (combo + 1) * 50) * plasticMultiplier * level;
        }
        break;

      // If the player clears a double
      case 2:
        // Back-to-Back Spin Double
        if (spinActive && backToBackActive) {
          updateIndicator(2, true);
          score += (1800 + (combo + 1) * 50) * plasticMultiplier * level;
        }

        // Spin Double
        else if (spinActive) {
          updateIndicator(2, true);
          score += (1200 + (combo + 1) * 50) * plasticMultiplier * level;
        }

        // Double
        else {
          updateIndicator(2, false);
          score += (300 + (combo + 1) * 50) * plasticMultiplier * level;
        }
        break;

      // If the player clears a triple
      case 3:
        // Back-to-Back Spin Triple
        if (spinActive && backToBackActive) {
          updateIndicator(3, true);
          score += (2400 + (combo + 1) * 50) * plasticMultiplier * level;
        }

        // Spin Triple
        else if (spinActive) {
          updateIndicator(3, true);
          score += (1600 + (combo + 1) * 50) * plasticMultiplier * level;
        }

        // Triple
        else {
          updateIndicator(3, false);
          score += (500 + (combo + 1) * 50) * plasticMultiplier * level;
        }
        break;

      // If the player clears a Quad
      case 4:
        // Back-to-Back Quad
        if (backToBackActive) {
          updateIndicator(4, false);
          score += (1200 + (combo + 1) * 50) * plasticMultiplier * level;
        }

        // Quad
        else {
          updateIndicator(4, false);
          score += (800 + (combo + 1) * 50) * plasticMultiplier * level;
        }
        break;
    }
  }

  // Handle the combo correctly
  if (currentLinesCleared != 0) {
    combo++;
  } else {
    combo = -1;
  }
}

// Find the distance to the nearest collision only going downwards
function findLowestDistance(rate) {
  let distance;

  for (let i = 0; i < rate + 2; i++) {
    if (checkMovementCollision(0, i)) {
      distance = i;
      break;
    }

    distance = i;
  }

  return distance - 1;
}

// Find the distance to the nearest collision going left or right
function findFurthestDistance(rate, direction) {
  let distance;

  for (let i = 0; i < rate + 2; i++) {
    if (checkMovementCollision(i * direction, 0)) {
      distance = i * direction - direction;
      break;
    }

    distance = i * direction - direction;
  }

  return distance;
}

// Checks for top-outs
function checkTopOut() {
  // Loop through every y position of the blocks on the current piece
  for (
    let y = 0;
    y < Math.sqrt(ROTATION_DATA.positions[pieceCurrent].rotation0.length);
    y++
  ) {
    // Loop through every x position of the blocks on the current piece
    for (
      let x = 0;
      x < Math.sqrt(ROTATION_DATA.positions[pieceCurrent].rotation0.length);
      x++
    ) {
      // If the position we're analysing is a 1
      if (
        ROTATION_DATA.positions[pieceCurrent].rotation0[
          y *
            Math.sqrt(ROTATION_DATA.positions[pieceCurrent].rotation0.length) +
            x
        ] == 1 &&
        // AND That spot is already occupied on the collision map
        collisionMap[y][x + 3] > 0
      ) {
        gameCleared = true;
      }
    }
  }
}

// Resets timers related to piece locks
function attemptSoftDropReset() {
  if (lockResetCount < 30 && pieceLockTimer > 0) {
    pieceLockTimer = 0;
    lockResetCount++;
  }
}

// Lock the current piece to the lowest possible position (highest Y value) and same x position on the board
function lockCurrentPiece() {
  // Lock the piece to the lowest spot that doesn't intersect anything
  let lockedSpritePositionY = pieceSpritePositionY + findLowestDistance(20);

  // Set the piece in the collision map so that it is saved
  // Loop through every row in the current piece's rotation
  for (
    let y = 0;
    y < Math.sqrt(ROTATION_DATA.positions[pieceCurrent].rotation0.length);
    y++
  ) {
    // Loop through every column
    for (
      let x = 0;
      x < Math.sqrt(ROTATION_DATA.positions[pieceCurrent].rotation0.length);
      x++
    ) {
      // If the position we're analysing is a 1
      if (
        ROTATION_DATA.positions[pieceCurrent][
          "rotation" + (((pieceRotationState % 4) + 4) % 4)
        ][y * Math.sqrt(ROTATION_DATA.positions[pieceCurrent].rotation0.length) + x
        ] == 1
      ) {
        // Set the position in the collision map to be the value corresponding to our piece's color
        collisionMap[Math.abs(lockedSpritePositionY + y)][
          pieceSpritePositionX + x
        ] = pieceCurrent + 1;
      }
    }
  }

  totalPieceLocks++;
  attemptHoldLimited = false;
  clearFullLines(lockedSpritePositionY);
  advanceQueue();
}

// Acting on key presses
function actOnKeypress(key, isKeyPress) {
  pauseButton.blur();

  if (!isKeyPress) {
    dasRateTimer = 1;
  }

  keybinds = JSON.parse(localStorage.getItem("Settings")).keybinds;

  const input = keybinds.filter(function (event) {
    return event.trigger == key;
  });

  if (input.length != 0) {
    switch (input[0].event) {
      case "ROTATE_CW":
        if (isKeyPress) {
          rotateCwPressed = true;
        } else {
          rotateCwPressed = false;
          rotateCwLimited = false;
        }
        break;

      case "ROTATE_CCW":
        if (isKeyPress) {
          rotateCcwPressed = true;
        } else {
          rotateCcwPressed = false;
          rotateCcwLimited = false;
        }
        break;

      case "MOVE_RIGHT":
        if (isKeyPress) {
          moveRightPressed = true;
        } else {
          moveRightPressed = false;
          moveRightLimited = false;
          moveRightTimer = 0;
        }
        break;

      case "MOVE_LEFT":
        if (isKeyPress) {
          moveLeftPressed = true;
        } else {
          moveLeftPressed = false;
          moveLeftLimited = false;
          moveLeftTimer = 0;
        }
        break;

      case "MOVE_DOWN":
        if (isKeyPress) {
          moveDownPressed = true;
        } else {
          moveDownPressed = false;
          moveDownLimited = false;
          moveDownTimer = 0;
        }
        break;

      case "HARD_DROP":
        if (isKeyPress) {
          hardDropPressed = true;
        } else {
          hardDropPressed = false;
          hardDropLimited = false;
        }
        break;

      case "HOLD":
        if (isKeyPress) {
          holdPressed = true;
        } else {
          holdPressed = false;
          holdLimited = false;
        }
        break;

      case "PAUSE":
        if (isKeyPress) {
          pausePressed = true;
        } else {
          pausePressed = false;
          pauseLimited = false;
        }
        break;
    }
  }
}

// Updates the line clearing indicator
function updateIndicator(linesAmount, spin) {
  indicatorSelectionLast = indicatorSelection.slice();
  fadeoutActive = true;
  indicatorAnimTimer = 10;

  if (perfectClear) {
    indicatorSelection = [0, 6];
  } else {
    indicatorSelection[0] = linesAmount - 1;

    if (pieceCurrent == 0 || pieceCurrent == 6 || !spin) {
      indicatorSelection[1] = 0;
    } else {
      indicatorSelection[1] = pieceCurrent;
    }
  }
}

// Draws everything
function drawScreen(drawPieces, drawInfo) {
  // Set the hold image accordingly
  if (attemptHoldLimited) {
    holdImage = HOLD_DISABLED_IMAGE;
  } else {
    holdImage = QUEUE_IMAGE;
  }

  const BOARD_ORIGIN = [200, 0];

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the text labels
  ctx.font = "35px Ubuntu";
  ctx.textAlign = "center";
  ctx.fillText("Held", 102, 38);
  ctx.fillText("Next", 702, 38);

  // Draw the held piece
  ctx.drawImage(holdImage, 0, pieceHeld * 200, 200, 200, 0, 0, 200, 200);

  // Draw the piece queue
  for (let i = 0; i < 4; i++) {
    ctx.drawImage(
      QUEUE_IMAGE,
      0,
      pieceQueue[queuePosition + 1 + i] * 200,
      200,
      200,
      602,
      i * 200,
      200,
      200,
    );
  }

  // Draw the board
  ctx.drawImage(BOARD_IMAGE, BOARD_ORIGIN[0], BOARD_ORIGIN[1], 402, 802);

  if (drawPieces) {
    // Draw the locked pieces
    // Loop through every Y position on the collision map
    for (let y = 0; y < 20; y++) {
      // Loop through every X position on the collision map
      for (let x = 0; x < 10; x++) {
        // If its higher than 0, draw block with respective color
        if (collisionMap[y][x] > 0) {
          ctx.drawImage(
            currentPieceImage,
            600,
            160 + (collisionMap[y][x] - 1) * 40,
            40,
            40,
            x * 40 + BOARD_ORIGIN[0] + 1,
            y * 40 + BOARD_ORIGIN[1] + 1,
            40,
            40,
          );
        }
      }
    }

    // Draw the ghost piece
    ctx.drawImage(
      GHOST_IMAGE,
      (((pieceRotationState % 4) + 4) % 4) * 160,
      (160 + (pieceCurrent - 1) * 120) *
        (1 - Math.round(1 / (10 * pieceCurrent + 1))),
      Math.sqrt(ROTATION_DATA.positions[pieceCurrent].rotation0.length) * 40,
      Math.sqrt(ROTATION_DATA.positions[pieceCurrent].rotation0.length) * 40,
      pieceSpritePositionX * 40 + BOARD_ORIGIN[0] + 1,
      (pieceSpritePositionY + findLowestDistance(20)) * 40 +
        BOARD_ORIGIN[1] +
        1,
      Math.sqrt(ROTATION_DATA.positions[pieceCurrent].rotation0.length) * 40,
      Math.sqrt(ROTATION_DATA.positions[pieceCurrent].rotation0.length) * 40,
    );

    // Draw the current piece
    ctx.drawImage(
      currentPieceImage,
      (((pieceRotationState % 4) + 4) % 4) * 160,
      (160 + (pieceCurrent - 1) * 120) *
        (1 - Math.round(1 / (10 * pieceCurrent + 1))),
      Math.sqrt(ROTATION_DATA.positions[pieceCurrent].rotation0.length) * 40,
      Math.sqrt(ROTATION_DATA.positions[pieceCurrent].rotation0.length) * 40,
      pieceSpritePositionX * 40 + BOARD_ORIGIN[0] + 1,
      pieceSpritePositionY * 40 + BOARD_ORIGIN[1] + 1,
      Math.sqrt(ROTATION_DATA.positions[pieceCurrent].rotation0.length) * 40,
      Math.sqrt(ROTATION_DATA.positions[pieceCurrent].rotation0.length) * 40,
    );
  }

  if (drawInfo) {
    // Handling animations for the indicator
    if (!gamePaused) {
      if (indicatorAnimTimer > 0) {
        indicatorOpacityRatio = indicatorAnimTimer * 0.1;
        indicatorAnimTimer--;
      } else if (indicatorAnimTimer == 0) {
        indicatorAnimTimer--;
        indicatorSelectionLast = indicatorSelection.slice();
        indicatorOpacityRatio = 1.0;

        if (fadeoutActive) {
          indicatorFadeoutTimer = 300;
          fadeoutActive = false;
        }
      }

      if (indicatorFadeoutTimer > 0) {
        indicatorFadeoutTimer--;
      } else if (indicatorFadeoutTimer == 0) {
        indicatorFadeoutTimer--;

        indicatorSelectionLast = indicatorSelection.slice();
        indicatorAnimTimer = 10;
        indicatorSelection = [0, 7];
      }
    }

    // Draw indicator
    ctx.globalAlpha = indicatorOpacityRatio;
    ctx.drawImage(
      INDICATOR_IMAGE,
      indicatorSelectionLast[0] * 185,
      indicatorSelectionLast[1] * 122,
      185,
      122,
      0,
      680,
      185,
      122,
    );
    ctx.globalAlpha = 1.0 - indicatorOpacityRatio;
    ctx.drawImage(
      INDICATOR_IMAGE,
      indicatorSelection[0] * 185,
      indicatorSelection[1] * 122,
      185,
      122,
      0,
      680,
      185,
      122,
    );

    ctx.globalAlpha = 1.0;
    if (backToBackActive) {
      ctx.font = "15px Ubuntu";
      ctx.textAlign = "start";
      ctx.fillText("Back-to-back!", 8, 793);
    }

    // Draw combo
    if (combo > 0) {
      ctx.font = "15px Ubuntu";
      ctx.textAlign = "end";
      ctx.fillText("Combo: " + combo, 178, 793);
    }

    drawTextInfo();
  }
}

function runGame() {
  // Handle pause input
  if (pausePressed && !pauseLimited) {
    if (!gamePaused) {
      gamePaused = true;
      pauseScreen.classList.add("active");
      pauseButton.classList.remove("active");
    } else {
      gamePaused = false;
      pauseScreen.classList.remove("active");
      pauseButton.classList.add("active");
    }

    pauseLimited = true;
  }

  if (!gamePaused) {
    // PRE-GAME SCREEN
    if (preGameTimer > 0) {
      drawScreen(true, true);
      ctx.font = "400px Ubuntu";
      ctx.textAlign = "center";
      ctx.fillText(String(Math.floor(preGameTimer * 0.01) + 1), 401, 501);
      preGameTimer--;
    } else {
      gameStarted = true;
    }

    // GAME RUNNING
    if (gameStarted) {
      updateGameState();
    }

    // INPUT HANDLING
    // ROTATE CW
    if (rotateCwPressed && !rotateCwLimited && gameStarted) {
      rotateCwLimited = true;
      attemptRotation(1);
    }

    // ROTATE CCW
    if (rotateCcwPressed && !rotateCcwLimited && gameStarted) {
      rotateCcwLimited = true;
      attemptRotation(-1);
    }

    // MOVE RIGHT
    if (moveRightPressed) {
      // Let the piece move once before DAS is charged
      if (!moveRightLimited && !checkMovementCollision(1, 0) && gameStarted) {
        moveRightLimited = true;
        attemptSoftDropReset();
        pieceSpritePositionX++;
      }

      // If DAS is charged and we aren't holding the other direction
      if (
        moveRightTimer >
          JSON.parse(localStorage.getItem("Settings")).sensitivity.DAS &&
        !moveLeftPressed
      ) {
        if (
          dasRateTimer %
            splitSensitivityRate(
              JSON.parse(localStorage.getItem("Settings")).sensitivity.ARR,
              true,
            ) ==
            0 &&
          gameStarted
        ) {
          // Distance for the piece to move based on ARR
          d = findFurthestDistance(
            splitSensitivityRate(
              JSON.parse(localStorage.getItem("Settings")).sensitivity.ARR,
              false,
            ),
            1,
          );

          if (d > 0) {
            attemptSoftDropReset();
            pieceSpritePositionX += d;
          }
        }
      }
      moveRightTimer++;
      dasRateTimer++;
    }

    // MOVE LEFT
    if (moveLeftPressed) {
      // Let the piece move once before DAS is charged
      if (!moveLeftLimited && !checkMovementCollision(-1, 0) && gameStarted) {
        moveLeftLimited = true;
        attemptSoftDropReset();
        pieceSpritePositionX--;
      }

      // If DAS is charged and we aren't holding the other direction
      if (
        moveLeftTimer >
          JSON.parse(localStorage.getItem("Settings")).sensitivity.DAS &&
        !moveRightPressed
      ) {
        if (
          dasRateTimer %
            splitSensitivityRate(
              JSON.parse(localStorage.getItem("Settings")).sensitivity.ARR,
              true,
            ) ==
            0 &&
          gameStarted
        ) {
          // Distance for the piece to move based on ARR
          d = findFurthestDistance(
            splitSensitivityRate(
              JSON.parse(localStorage.getItem("Settings")).sensitivity.ARR,
              false,
            ),
            -1,
          );

          if (d < 0) {
            attemptSoftDropReset();
            pieceSpritePositionX += d;
          }
        }
      }
      moveLeftTimer++;
      dasRateTimer++;
    }

    // MOVE DOWN
    if (moveDownPressed) {
      // Let the piece move once before DAS is charged
      if (!moveDownLimited && !checkMovementCollision(0, 1) && gameStarted) {
        moveDownLimited = true;

        // Increment score for every x position passed during a soft drop
        score += 1;

        pieceSpritePositionY++;
      }

      // If DAS is charged
      if (
        moveDownTimer >
        JSON.parse(localStorage.getItem("Settings")).sensitivity.SD_DAS
      ) {
        if (
          dasRateTimer %
            splitSensitivityRate(
              JSON.parse(localStorage.getItem("Settings")).sensitivity.SDR,
              true,
            ) ==
            0 &&
          gameStarted
        ) {
          // Increment score for every x position passed during a soft drop
          score += findLowestDistance(
            splitSensitivityRate(
              JSON.parse(localStorage.getItem("Settings")).sensitivity.SDR,
              false,
            ),
          );

          // Move piece however many blocks down dependant on SDR
          pieceSpritePositionY += findLowestDistance(
            splitSensitivityRate(
              JSON.parse(localStorage.getItem("Settings")).sensitivity.SDR,
              false,
            ),
          );
        }
      }
      moveDownTimer++;
      dasRateTimer++;
    }

    // HARD DROP
    if (hardDropPressed && !hardDropLimited && gameStarted) {
      // Increment score by 2 for every x position passed during a hard drop
      score += findLowestDistance(20) * 2;

      hardDropLimited = true;
      lockCurrentPiece();
    }

    // HOLD
    if (holdPressed && !holdLimited && gameStarted) {
      holdLimited = true;

      // Only allow one hold until another piece lock occurs
      if (!attemptHoldLimited) {
        // If there is currently no held piece
        if (pieceHeld == 7) {
          pieceHeld = pieceCurrent;
          advanceQueue();
        }

        // If there is currently a held piece
        else {
          pieceCurrent = pieceHeld;
          pieceHeld = pieceQueue[queuePosition];
          resetPiece();
        }

        attemptHoldLimited = true;
      }
    }
  }

  // GAME PAUSED
  else {
    drawScreen(false, true);
  }
}

// Set up our queue the first time
let bag1 = generateBag();
let bag2 = generateBag();

let pieceQueue = bag1.concat(bag2);

// Set our piece to the first one in the queue
let pieceCurrent = pieceQueue[queuePosition];

const gameInterval = setInterval(runGame, 10);