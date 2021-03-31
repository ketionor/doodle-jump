const game = () => {
  const grid = document.querySelector(".grid");
  let isGameOver = false;
  let platformCount = 5;
  let platforms = [];
  let framerate = 30;
  let gameSpeed = 10;

  class Doodler {
    constructor(x, y) {
      this.visual = document.createElement("div");
      this.visual.classList.add("doodler");
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

      this.visual.style.left = this.position.x + "px";
      this.visual.style.bottom = this.position.y + "px";
    }

    updatePosition(direction) {
      if (!this.gridIsMoving) {
        this.position.y = this.position.y + this.doodlerSpeed * direction;
        this.visual.style.bottom = this.position.y + "px";
      }

      if (this.isMovingLeft === true) {
        this.position.x = this.position.x - this.doodlerSpeed;
        this.visual.style.left = this.position.x + "px";
      }

      if (this.isMovingRight === true) {
        this.position.x = this.position.x + this.doodlerSpeed;
        this.visual.style.left = this.position.x + "px";
      }
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
        if (this.position.y > 450 && this.isJumping) {
          let newPosition = platform.position.y - this.gridspeed;
          platform.position.y = newPosition;
          platform.bottom = newPosition + "px";
          this.gridIsMoving = true;
        } else {
          this.gridIsMoving = false;
        }

        //check for collision
        if (
          this.position.y >= platform.position.y &&
          this.position.y <= platform.position.y + 15 &&
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
        alert("Game over!");
      } else {
        requestAnimationFrame(this.gravity);
      }
    };
  }

  class Platform {
    constructor(newPlatBottom) {
      this.visual = document.createElement("div");
      this.visual.classList.add("platform");

      this.position = {
        x: Math.random() * (600 - 85),
        y: newPlatBottom,
      };
      this.width = 85;
      this.height = 15;

      this.visual.style.left = this.position.x + "px";
      this.visual.style.bottom = this.position.y + "px";
    }

    set bottom(y) {
      this.visual.style.bottom = y;
    }
  }

  const createPlatforms = (minY) => {
    const platformGrid = document.createElement("div");
    platformGrid.classList.add("platformSection");
    grid.insertBefore(platformGrid, grid.firstChild);

    const getRand = (min, max) => {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1) + min);
    };
    let platformCount = getRand(5, 15);
    for (let i = 0; i < platformCount; i++) {
      let platGap = 900 / platformCount;
      let newPlat = new Platform(minY + i * platGap);
      platformGrid.appendChild(newPlat.visual);
      platforms.push(newPlat);
    }

    if (grid.childElementCount > 4) {
      grid.removeChild(grid.childNodes[3]);
    }
  };

  const startGame = () => {
    createPlatforms(100);
    createPlatforms(900);
    let doodler = new Doodler(
      platforms[0].position.x,
      platforms[0].position.y + 30
    );

    grid.appendChild(doodler.visual);
    requestAnimationFrame(doodler.gravity);
  };

  startGame();
};

game();
