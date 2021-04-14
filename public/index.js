const game = () => {
  const GRID = document.querySelector(".grid");
  const SCOREBOARD = document.querySelector(".score-board");
  const SCORE = document.querySelector("#score");
  const HISCORE = document.querySelector("#hiScore");
  const gameOver = document.querySelector(".game-over");

  //Constants

  //const gridWidth = 600;
  //const gridHeight = 900;

  const gridStyles = window.getComputedStyle(GRID);
  const gridWidth = parseInt(gridStyles.getPropertyValue("width"), 10);
  const gridHeight = parseInt(gridStyles.getPropertyValue("height"), 10);

  GRID.style.width = `${gridWidth}px`;
  GRID.style.height = `${gridHeight}px`;

  gameOver.style.width = `${gridWidth}px`;
  gameOver.style.height = `${gridHeight}px`;

  let platformCount = 5;
  let platforms = [];
  let gameSpeed = 10;
  let score = 0;
  let hiScore = 0;

  let doodler = new Doodler(GRID, gridHeight, gridWidth);
  document.addEventListener("keydown", (e) => doodler.setMovement(e));
  document.addEventListener("keyup", (e) => doodler.stopMovement(e));

  //Sprite
  const CANVAS = document.querySelector("#dino");
  const CTX = CANVAS.getContext("2d");
  CTX.imageSmoothingEnabled = false;

  //let spriteScale = this.height;
  let sprite = new Image();
  sprite.src = "https://i.ibb.co/QJP837R/Dino-Sprites-vita.png";

  CANVAS.style.width = `${gridHeight / 12}px`;
  CANVAS.style.height = `${gridHeight / 12}px`;

  CTX.imageSmoothingEnabled = false;

  sprite.onload = () => {
    init(0);
  };

  const init = (spriteNumber) => {
    CTX.clearRect(0, 0, gridHeight / 12, gridHeight / 12);
    CTX.drawImage(
      sprite,
      0 + spriteNumber * 24,
      0,
      24,
      24,
      0,
      0,
      gridHeight / 12,
      gridHeight / 12
    );
    console.log("sprite update", spriteNumber);
  };

  const startGame = () => {
    createPlatforms(100);
    createPlatforms(gridHeight);
    doodler.position.x = platforms[0].position.x + 25;
    doodler.position.y = platforms[0].position.y + 15;
    doodler.hitBox.style.left = `${doodler.position.x}px`;
    doodler.hitBox.style.bottom = `${doodler.position.y}px`;

    requestAnimationFrame(render);
  };

  render = () => {
    platforms.forEach((platform) => {
      if (doodler.position.y > gridHeight / 2 && doodler.isJumping) {
        let newPosition = platform.position.y - doodler.gridspeed;
        platform.position.y = newPosition;
        platform.visual.style.bottom = `${newPosition}px`;

        score += doodler.doodlerSpeed / 10;
        SCORE.innerHTML = `Score: ${score}`;

        doodler.gridIsMoving = true;
      } else {
        doodler.gridIsMoving = false;
      }

      //check for collision
      if (
        doodler.position.y >= platform.position.y &&
        doodler.position.y <= platform.position.y + platform.height &&
        doodler.position.x + doodler.width >= platform.position.x &&
        doodler.position.x <= platform.position.x + platform.width &&
        doodler.isJumping === false
      ) {
        console.log("colission at: ", doodler.position);
        doodler.isJumping = true;
        init(1);
        setTimeout(() => {
          doodler.isJumping = false;
          init(0);
        }, 500);
      }
    });

    //Create a new section of platforms off screen to be used when the doodler moves up
    if (platforms[platforms.length - 1].position.y < 1000) {
      createPlatforms(platforms[platforms.length - 1].position.y);
    }

    //jump on collision, otherwise fall
    //isJumping ? this.updatePosition(1) : this.updatePosition(-1);
    if (!doodler.isJumping) {
      doodler.updatePosition(-1, gridWidth, CANVAS);
    } else if (doodler.isJumping) {
      doodler.updatePosition(1, gridWidth, CANVAS);
    }

    if (doodler.position.y <= 0) {
      handleGameOver();
    } else {
      requestAnimationFrame(render);
    }
  };

  const createPlatforms = (minY) => {
    const platformSection = document.createElement("div");
    platformSection.className = "platformSection game-element";

    platformSection.style.width = `${gridWidth}px`;
    platformSection.style.height = `${gridHeight}px`;
    GRID.insertBefore(platformSection, GRID.firstChild);

    const getRand = (min, max) => {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1) + min);
    };

    let platformCount = getRand(5, 15);

    for (let i = 0; i < platformCount; i++) {
      let platGap = gridHeight / platformCount;
      let newPlat = new Platform(minY + i * platGap, gridWidth, gridHeight);
      platformSection.appendChild(newPlat.visual);
      platforms.push(newPlat);
    }

    if (GRID.childElementCount > 7) {
      let list = document.querySelectorAll(".platformSection");
      GRID.removeChild(list[list.length - 1]);
      //GRID.removeChild(GRID.childNodes[3]);
    }
  };

  const handleGameOver = () => {
    score > hiScore ? (hiScore = score) : score;
    HISCORE.innerHTML = `Hi Score: ${hiScore}`;
    gameOver.style.visibility = "visible";
  };

  const newGame = () => {
    gameOver.style.visibility = "hidden";
    score = 0;
    SCORE.innerHTML = "Score: 0";
    const gameElement = document.querySelectorAll(".game-element");
    gameElement.forEach((element) => {
      console.log("removing: ", element);
      GRID.removeChild(element);
    });
    platforms = [];
    startGame();
  };

  startGame();

  //New game button
  const newGameButton = document.querySelector(".new-game-button");
  newGameButton.addEventListener("click", newGame);
};

game();
