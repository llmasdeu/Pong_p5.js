/*
 *  JavaScript file with the graphics and logic elements of the game.
 *  ==================================================================
 *  Author: Lluís Masdeu
 *  Date: August 3rd, 2020
 *  ==================================================================
 */
// Parameters used throughout the game.
let canvasWidth = 1080,   // Width of the canvas
    canvasHeight = 720;   // Height of the canvas
var started = false,      // Has the game begun?
    paused = false;       // Is the game paused?

/**
 * Class in charge of defining the properties and the controls of a player.
 */
class Player {
  /**
   * Constructor function of the class.
   * @param {int} width           Width of the slider.
   * @param {int} height          Height of the slider.
   * @param {int} x               X coordinate of the slider.
   * @param {int} y               Y coordinate of the slider.
   * @param {int} topPadding      Top padding of the canvas.
   * @param {int} lateralPadding  Lateral padding of the canvas.
   */
  constructor(width, height, x, y, topPadding, lateralPadding) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.topPadding = topPadding;
    this.lateralPadding = lateralPadding;
    this.sliderSpeed = 5;
    this.usableHeight = canvasHeight - this.height - this.topPadding - 2 * this.lateralPadding;
    this.score = 0;
  }

  /**
   * Function in charge of moving up the slider.
   */
  upSlider() {
    this.y -= this.sliderSpeed;
    this.y = (this.y < 0 ? 0 : this.y);
  }

  /**
   * Function in charge of moving down the slider.
   */
  downSlider() {
    this.y += this.sliderSpeed;
    this.y = (this.y >= this.usableHeight ? this.usableHeight : this.y);
  }

  /**
   * Function in charge of drawing the slider on the canvas.
   */
  drawSlider() {
    let c = color(255, 255, 255);
    fill(c);
    noStroke();
    rect(this.x, this.y + this.topPadding + this.lateralPadding, this.width, this.height, 1, 1, 1, 1);
  }

  /**
   * Function in charge of increasing the score of the player.
   */
  increaseScore() {
    this.score++;
  }

  /**
   * Function in charge of returning the current coordinates and dimensions of the slider.
   * @return {int} X & Y coordinates of the slider + dimensions of the slider.
   */
  getCoordinates() {
    return [this.x, this.y + this.topPadding + this.lateralPadding, this.width, this.height];
  }
}

/**
 * Class in charge of defining the properties and the controls of the ball.
 */
class Ball {
  /**
   * Constructor function of the class.
   * @param {int} topPadding     Top padding of the canvas.
   * @param {int} lateralPadding Lateral padding of the canvas.
   */
  constructor(topPadding, lateralPadding) {
    this.x = 0;
    this.y = 0;
    this.radius = 10;
    this.ballSpeed = 0.01;
    this.directionX = 0;
    this.directionY = 0;
    this.topPadding = topPadding;
    this.lateralPadding = lateralPadding;
    this.resetPosition();
  }

  /**
   * Function in charge of drawing the ball on the board.
   */
  drawBall() {
    fill('#FFFFFF');
    circle(this.x, this.y, 2 * this.radius);
  }

  /**
   * Function in charge of moving the ball.
   */
  moveBall() {
    this.x += (this.ballSpeed * this.directionX);
    this.y += (this.ballSpeed * this.directionY);
  }

  /**
   * Function in charge of returning the current coordinates and dimensions of the ball.
   * @return {int} X & Y coordinates of the ball + radius of the ball.
   */
  getCoordinates() {
    return [this.x, this.y, this.radius];
  }

  /**
   * Function in charge of bouncing the ball with a wall.
   */
  wallBounce() {
    this.directionY = -this.directionY;
  }

  /**
   * Function in charge of bouncing the ball with a slider.
   */
  sliderBounce() {
    this.directionX = -this.directionX;
  }

  /**
   * Function in charge of resetting the position of the ball.
   */
  resetPosition() {
    this.x = Math.random() * (235 - 120) + 120;
    this.y = Math.random() * (600 - 350) + 350;
    this.directionX = Math.random() * (450 - 0) + 0;
    this.directionY = Math.random() * (300 - (-300)) + (-300);
  }

  /**
   * Function in charge of increasing the ball speed.
   */
  increaseBallSpeed() {
    this.ballSpeed += 0.001;
  }
}

/**
 * Class in charge of defining the data and the controls of the game.
 */
class GameData {
  constructor() {
    this.width = 25;
    this.height = 105;
    this.wallSize = 9;
    this.topPadding = 50;
    this.lateralPadding = 20;
    this.ball = new Ball(this.topPadding, this.lateralPadding);
    this.player1 = new Player(this.width, this.height, this.lateralPadding + 20, 0, this.topPadding, this.lateralPadding);
    this.player2 = new Player(this.width, this.height, canvasWidth - this.lateralPadding - 2 * 20, canvasHeight - this.height - this.topPadding - 2 * this.lateralPadding, this.topPadding, this.lateralPadding);
  }

  /**
   * Function in charge of drawing on the board the elements of the game.
   */
  drawElements() {
    // Draws the title of the game
    this.drawTitle();

    // Draws the walls of game's board
    this.drawWalls();

    if (started && !paused) {
      // Draws the players' score
      this.drawPlayersScore();

      // Draws the ball on the board
      this.ball.drawBall();

      // Draws the sliders of the players
      this.player1.drawSlider();
      this.player2.drawSlider();
    } else if (!started) {
      fill(255, 255, 255);
      textFont('Helvetica', 40);
      text('PRESS SPACE BAR TO START', 270, 400);
    } else {
      fill(255, 255, 255);
      textFont('Helvetica', 40);
      text('PAUSED', 475, 350);
      textFont('Helvetica', 28);
      text('PRESS SPACE BAR TO RESUME', 345, 400);
    }
  }

  /**
   * Function in charge of drawing the title of the game.
   */
  drawTitle() {
    fill(255, 255, 255);
    textFont('Helvetica', 30);
    text('PONG', canvasWidth / 2 - 27, 38);
  }

  /**
   * Function in charge of drawing the board's walls.
   */
  drawWalls() {
    for (var i = 0; i < canvasWidth; i = i + 12) {
      square(i, this.topPadding + this.lateralPadding - 10, this.wallSize, 1, 1, 1, 1);
      square(i, canvasHeight - this.lateralPadding + 1, this.wallSize, 1, 1, 1, 1);
    }
  }

  /**
   * Function in charge of drawing the players' score in the board.
   */
  drawPlayersScore() {
    fill('#BDBDBD');
    textFont('Helvetica', 28);
    text(this.player1.score, 4 * this.lateralPadding, 40);
    text(this.player2.score, canvasWidth - 4 * this.lateralPadding - 10, 40);
  }

  /**
   * Function in charge of checking the player's controls.
   */
  playerControls() {
    if (keyIsDown(UP_ARROW)) {            // Moves up the slider
      this.player1.upSlider();
    } else if (keyIsDown(DOWN_ARROW)) {   // Moves down the slider
      this.player1.downSlider();
    }
  }

  /**
   * Function in charge of executing the game.
   */
  playGame() {
    // If the game has started, and it's not paused...
    if (started && !paused) {
      // Controls the player moves
      this.playerControls();

      // The ball moves in the board
      this.ball.moveBall();

      // Checks if the ball has bounced
      this.checkBallBounce();

      // Checks if the ball is out of board
      if (this.isBallOutOfBoard()) {
        this.ball.increaseBallSpeed();
        this.ball.resetPosition();
      }
    }
  }

  /**
   * Function in charge of checking if the ball has bounced.
   */
  checkBallBounce() {
    var ballCoords = this.ball.getCoordinates();
    var sliderCoords = [this.player1.getCoordinates(), this.player2.getCoordinates()];

    // Checks if the ball has bounced with a slider
    this.checkBallSliderBounce(ballCoords, sliderCoords[0]);
    this.checkBallSliderBounce(ballCoords, sliderCoords[1]);

    // Checks if the ball has bounced with a wall
    this.checkBallWallBounce(ballCoords);
  }

  /**
   * Function in charge of checking if the ball has bounce with a wall.
   * @param  {int} ballCoords X & Y coordinates of the ball + radius of the ball.
   */
  checkBallWallBounce(ballCoords) {
    var ballTop = ballCoords[1] - ballCoords[2],
        ballBottom = ballCoords[1] + ballCoords[2],
        topWall = this.topPadding + this.lateralPadding - 10 + this.wallSize,
        bottomWall = canvasHeight - this.lateralPadding + 1;

    if (ballTop <= topWall || ballBottom >= bottomWall)
      this.ball.wallBounce();
  }

  /**
   * Function in charge of checking of the ball has bounced with a slider.
   * @param  {int} ballCoords   X & Y coordinates of the ball + radius of the ball.
   * @param  {int} sliderCoords X & Y coordinates of the slider + dimensions of the slider.
   */
  checkBallSliderBounce(ballCoords, sliderCoords) {
    var sliderTop = sliderCoords[0],
        sliderBottom = sliderCoords[0] + sliderCoords[2];

    if (this.intersects(ballCoords, sliderCoords)) {
      this.ball.sliderBounce();
    }
  }

  /**
   * Function in charge of checking if the ball and the slider intersect.
   * @param  {int} ballCoords   X & Y coordinates of the ball + radius of the ball.
   * @param  {int} sliderCoords X & Y coordinates of the slider + dimensions of the slider.
   * @return {Boolean}          TRUE if there is an intersection. FALSE otherwise.
   */
  intersects(ballCoords, sliderCoords) {
    var closestX = this.computeClosest(ballCoords[0], sliderCoords[0], sliderCoords[0] + sliderCoords[2]),
        closestY = this.computeClosest(ballCoords[1], sliderCoords[1], sliderCoords[1] + sliderCoords[3]),
        distanceX = ballCoords[0] - closestX,
        distanceY = ballCoords[1] - closestY,
        distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);

    return distanceSquared < (ballCoords[2] * ballCoords[2]);
  }

  /**
   * Function in charge of computing the closest coordinate.
   * @param  {int} val Threshold.
   * @param  {int} min Minimum value.
   * @param  {int} max Maximum value
   * @return {int}     Closest coordinate.
   */
  computeClosest(val, min, max) {
    return Math.max(min, Math.min(max, val))
  }

  /**
   * Function in charge of checking if the ball is out of range.
   * @return {Boolean} TRUE if it's out of range. FALSE otherwise.
   */
  isBallOutOfBoard() {
    if (this.ball.x + this.ball.radius < 0) {
      this.player2.increaseScore();

      return true;
    } else if (this.ball.x - this.ball.radius > canvasWidth) {
      this.player1.increaseScore();

      return true;
    }

    return false;
  }
}

// Creates the variable which will handle the logic of the game
var gameData = new GameData();

/**
 * Function in charge of setting up the canvas for the game.
 */
function setup() {
  // Creates the canvas with the desired dimensions
  createCanvas(canvasWidth, canvasHeight);
}

/**
 * Function in charge of drawing and controling the elements throughtout the game.
 */
function draw() {
  // Sets the parameters of the canvas
  background(0);

  // Draws the game elements
  gameData.drawElements();

  // Executes the game
  gameData.playGame();
}

/**
 * Function in charge of controling the keys pressed down.
 */
function keyPressed() {
  switch (keyCode) {
    // Space Bar
    case 32:
      if (!started) {
        started = true;
      } else {
        paused = !paused;
      }
      break;
  }
}
