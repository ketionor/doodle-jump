class Doodler {
  constructor(parent, gridHeight, gridWidth) {
    this.isJumping = false;
    this.isMovingLeft = false;
    this.isMovingRight = false;
    this.doodlerSpeed = 10;
    this.gridspeed = 10;
    this.gridIsMoving = false;

    this.position = {
      x: 0,
      y: 0,
    };

    this.height = gridHeight / 12;
    this.width = this.height / 2;

    //create the hit box, set its position
    this.hitBox = document.createElement("div");
    parent.appendChild(this.hitBox);
    this.hitBox.className = "doodler";

    this.hitBox.style.width = `${this.width}px`;
    this.hitBox.style.height = `${this.height}px`;
  }

  updatePosition(direction, gridWidth, sprite, gridHeight) {
    if (!this.gridIsMoving) {
      this.position.y += this.doodlerSpeed * direction;
      this.hitBox.style.bottom = `${this.position.y}px`;
    }

    if (this.isMovingLeft === true && this.position.x >= 0) {
      this.position.x -= this.doodlerSpeed;
      this.hitBox.style.left = `${this.position.x}px`;
    }

    if (
      this.isMovingRight === true &&
      this.position.x < gridWidth - this.width
    ) {
      this.position.x += this.doodlerSpeed;
      this.hitBox.style.left = this.position.x + "px";
    }

    sprite.style.left = `${this.position.x - gridHeight / 60}px`;
    sprite.style.bottom = `${this.position.y}px`;
  }

  setMovement(e) {
    if (e.key === "ArrowLeft") {
      this.isMovingLeft = true;
    } else if (e.key === "ArrowRight") {
      this.isMovingRight = true;
    }
  }

  stopMovement() {
    this.isMovingLeft = false;
    this.isMovingRight = false;
  }
}

class Platform {
  constructor(newPlatBottom, gridWidth, gridHeight) {
    this.visual = document.createElement("div");
    this.visual.className = "platform";
    this.width = gridWidth / 7;
    this.height = gridHeight / 60;

    this.position = {
      x: Math.random() * (gridWidth - this.width),
      y: newPlatBottom,
    };

    this.visual.style.left = `${this.position.x}px`;
    this.visual.style.bottom = `${this.position.y}px`;
    this.visual.style.width = `${this.width}px`;
    this.visual.style.height = `${this.height}px`;
  }
}
