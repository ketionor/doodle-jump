const game = () => {
  const GRID = document.querySelector(".grid");
  const gameOver = document.querySelector(".game-over");
  const canvas = document.querySelector("#dino");
  let ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  //Constants
  const gridWidth = 600;
  const gridHeight = 900;

  GRID.style.width = `${gridWidth}px`;
  GRID.style.height = `${gridHeight}px`;

  gameOver.style.width = `${gridWidth}px`;
  gameOver.style.height = `${gridHeight}px`;

  const scoreBoard = document.querySelector(".score-board");

  let platformCount = 5;
  let platforms = [];
  let gameSpeed = 10;
  let score = 0;

  class Doodler {
    constructor(x, y) {
      this.visual = document.createElement("div");
      GRID.appendChild(this.visual);
      this.visual.className = "doodler game-element";

      document.addEventListener("keydown", this.setMovement);
      document.addEventListener("keyup", this.stopMovement);

      this.isJumping = false;
      this.isMovingLeft = false;
      this.isMovingRight = false;
      this.doodlerSpeed = 10;
      this.gridspeed = 10;
      this.gridIsMoving = false;

      this.position = {
        x: x,
        y: y,
      };

      this.height = 85;
      this.width = 60;

      this.visual.style.left = this.position.x + "px";
      this.visual.style.bottom = this.position.y + "px";

      //Fetch the sprites!
      let spriteScale = 96;
      let vita = new Image();
      vita.src = "https://i.ibb.co/QJP837R/Dino-Sprites-vita.png";

      canvas.style.width = `${spriteScale}px`;
      canvas.style.height = `${spriteScale}px`;

      vita.onload = function () {
        init();
      };

      function init() {
        ctx.drawImage(vita, 0, 0, 24, 24, 0, 0, spriteScale, spriteScale);
      }
    }

    updatePosition(direction) {
      if (!this.gridIsMoving) {
        this.position.y += this.doodlerSpeed * direction;
        this.visual.style.bottom = `${this.position.y}px`;
      }

      if (this.isMovingLeft === true && this.position.x >= 0) {
        this.position.x -= this.doodlerSpeed;
        this.visual.style.left = `${this.position.x}px`;
      }

      if (
        this.isMovingRight === true &&
        this.position.x < gridWidth - this.width
      ) {
        this.position.x += this.doodlerSpeed;
        this.visual.style.left = this.position.x + "px";
      }

      canvas.style.left = `${this.position.x - 16}px`;
      canvas.style.bottom = `${this.position.y - 6}px`;
    }

    //the methods below have to be stated as arrow functions, or else they don't have access
    //to the class variables and methods. I am not sure at all why this works.
    setMovement = (e) => {
      if (e.key === "ArrowLeft") {
        this.isMovingLeft = true;
      } else if (e.key === "ArrowRight") {
        this.isMovingRight = true;
      }
    };

    stopMovement = () => {
      this.isMovingLeft = false;
      this.isMovingRight = false;
    };

    gravity = () => {
      platforms.forEach((platform) => {
        if (this.position.y > gridHeight / 2 && this.isJumping) {
          let newPosition = platform.position.y - this.gridspeed;
          platform.position.y = newPosition;
          platform.bottom = newPosition + "px";

          score += this.doodlerSpeed / 10;
          scoreBoard.innerHTML = `Score: ${score}`;

          this.gridIsMoving = true;
        } else {
          this.gridIsMoving = false;
        }

        //check for collision
        if (
          this.position.y >= platform.position.y &&
          this.position.y <= platform.position.y + platform.height &&
          this.position.x + platform.width >= platform.position.x &&
          this.position.x <= platform.position.x + platform.width &&
          this.isJumping === false
        ) {
          this.isJumping = true;
          setTimeout(() => {
            this.isJumping = false;
          }, 500);
        }
      });

      //Create a new section of platforms off screen to be used when the doodler moves up
      if (platforms[platforms.length - 1].position.y < 1000) {
        createPlatforms(platforms[platforms.length - 1].position.y);
      }

      //jump on collision, otherwise fall
      //isJumping ? this.updatePosition(1) : this.updatePosition(-1);
      if (!this.isJumping) {
        this.updatePosition(-1);
      } else if (this.isJumping) {
        this.updatePosition(1);
      }

      if (this.position.y <= 0) {
        handleGameOver();
      } else {
        requestAnimationFrame(this.gravity);
      }
    };
  }

  class Platform {
    constructor(newPlatBottom) {
      this.visual = document.createElement("div");
      this.visual.className = "platform";
      this.width = 85;
      this.height = 15;

      this.position = {
        x: Math.random() * (gridWidth - this.width),
        y: newPlatBottom,
      };

      this.visual.style.left = `${this.position.x}px`;
      this.visual.style.bottom = `${this.position.y}px`;
      this.visual.style.width = `${this.width}px`;
      this.visual.style.height = `${this.height}px`;
    }

    set bottom(y) {
      this.visual.style.bottom = y;
    }
  }

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
      let newPlat = new Platform(minY + i * platGap);
      platformSection.appendChild(newPlat.visual);
      platforms.push(newPlat);
    }

    if (GRID.childElementCount > 4) {
      GRID.removeChild(GRID.childNodes[3]);
    }
  };

  const handleGameOver = () => {
    gameOver.style.visibility = "visible";
  };

  const newGame = () => {
    gameOver.style.visibility = "hidden";
    const gameElement = document.querySelectorAll(".game-element");
    gameElement.forEach((element) => {
      console.log("removing: ", element);
      GRID.removeChild(element);
    });
    platforms = [];
    startGame();
  };

  const startGame = () => {
    createPlatforms(100);
    createPlatforms(gridHeight);
    let doodler = new Doodler(
      platforms[0].position.x,
      platforms[0].position.y + 30
    );

    GRID.appendChild(doodler.visual);
    requestAnimationFrame(doodler.gravity);
  };

  startGame();

  //New game button
  const newGameButton = document.querySelector(".new-game-button");
  newGameButton.addEventListener("click", newGame);
};

game();
