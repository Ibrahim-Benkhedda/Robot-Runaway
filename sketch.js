/*
FINAL GAME PROJECT - IBRAHIM BENKHEDDA
Hello, I hope you're enjoying playing my game


Extensions that I added:
  for sounds,  I added background music that loops through the whole game, I also added game over, level complete,
  and collectible sound effects that have an 8-bit video games theme.
  I also added Images and a small sign menu that shows the player how to control the movement of the game character.
  I created platforms with different sizes & enemies with different range movements to make the game more difficult
  Finally, I managed to host my game on GitHub with a live server which you can check out
  https://

The bits that I struggled with:
  I struggled with debugging method functions
The bits that I enjoyed:
  I really enjoyed creating & drawing enemies and the game character, I also had fun designing the world of this game and adding scenery
  to it to make it feel alive
Skills that I learned:
  I learned how to use arrays and complex objects & methods, I also learned how to use factory patterns and constructor functions which I found really helpful.

overall, I really enjoyed the game project Idea.

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

// scenery
var mountains;
var clouds;
var trees_x;
var canyons;
var collectables;

var game_score;
var lives;
var flagpole;

// sounds
var jumpSound;
var powerOnSound;
var gameOverSound;
var objectCollectedSound;
var backgroundSound;
var winGameSound;

// platforms
var platforms;
var onPlatform; // checks if the player is in contact with platform position

// enemies mechanics
var enemies;
var isDead; // global bolean to check if the character has died

//images
var spaceImg;
var arrowsImg;

function preload()
{
    soundFormats('mp3','wav');

    //load your sounds here
    jumpSound = loadSound('assets/Sounds/jump.wav');
    jumpSound.setVolume(0.1);

    powerOnSound = loadSound('assets/Sounds/robotPowerOn.wav');
    powerOnSound.setVolume(0.1);

    gameOverSound = loadSound('assets/Sounds/gameOver.wav');
    gameOverSound.setVolume(0.1);

    objectCollectedSound = loadSound('assets/Sounds/objectCollect.wav');
    objectCollectedSound.setVolume(0.2);

    backgroundSound = loadSound('assets/Sounds/background.wav');
    backgroundSound.setVolume(0.1);

    winGameSound = loadSound('assets/Sounds/gameWin.wav');
    winGameSound.setVolume(0.2);

    // Load Images
    spaceImg = loadImage('assets/Images/space.png');
    arrowsImg = loadImage('assets/Images/arrows.png');
}


function setup()
{
	createCanvas(1024, 576);
  floorPos_y = height * 3/4;

  lives = 3;
  startGame();
}

// ---------------------------------
// start game function
// ---------------------------------

function startGame() {
	gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the behaviour of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
  isDead = false;
  onPlatform = false;

	// Initialise arrays of scenery objects.
	trees_x = [-1100, -1000, -900, -430, -330, 100, 250, 480, 590, 1000, 1450, 1775, 1900, 2000, 2125, 2840, 2920, 3750, 3850, 3950, 4200, 4275];

	mountains = [
    {x_pos: -940, y_pos: 300},
		{x_pos: 0, y_pos: 300},
		{x_pos: 600, y_pos: 300},
		{x_pos: 1050, y_pos: 300},
		{x_pos: 2200, y_pos: 300},
		{x_pos: 2500, y_pos: 300},
    {x_pos: 3900, y_pos: 300},
    {x_pos: 3520, y_pos: 300}
	];

	clouds = [
    {x_pos: -1200, y_pos: 100},
    {x_pos: -1000, y_pos: 200},
    {x_pos: -800, y_pos: 100},
    {x_pos: -700, y_pos: 200},
    {x_pos: -300, y_pos: 100},
		{x_pos: 200, y_pos: 150},
		{x_pos: 600, y_pos: 200},
		{x_pos: 800, y_pos: 120},
		{x_pos: 1200, y_pos: 120},
		{x_pos: 1400, y_pos: 180},
		{x_pos: 1800, y_pos: 180},
    {x_pos: 2000, y_pos: 180},
    {x_pos: 2300, y_pos: 100},
    {x_pos: 2500, y_pos: 170},
    {x_pos: 2900, y_pos: 100},
    {x_pos: 3200, y_pos: 80},
    {x_pos: 3400, y_pos: 180},
    {x_pos: 3800, y_pos: 180},
    {x_pos: 4100, y_pos: 140}

	];

	collectables = [
    {x_pos: - 850, y_pos: floorPos_y - 310, size: 50, isFound: false},
    {x_pos: - 550, y_pos: floorPos_y - 325, size: 50, isFound: false},
    {x_pos: - 440, y_pos: floorPos_y - 325, size: 50, isFound: false},
    {x_pos: - 405, y_pos: floorPos_y - 25, size: 45, isFound: false},
    {x_pos: - 330, y_pos: floorPos_y - 325, size: 50, isFound: false},
    {x_pos: - 180, y_pos: floorPos_y - 300, size: 50, isFound: false},
    {x_pos: - 340, y_pos: floorPos_y - 235, size: 50, isFound: false},
    {x_pos: - 140, y_pos: floorPos_y - 160, size: 50, isFound: false},
    {x_pos: - 1040,y_pos: floorPos_y - 25, size: 50, isFound: false},
    {x_pos: - 940, y_pos: floorPos_y - 25, size: 50, isFound: false},
    {x_pos: - 840, y_pos: floorPos_y - 25, size: 50, isFound: false},
    {x_pos: - 740, y_pos: floorPos_y - 25, size: 50, isFound: false},
		{x_pos: 150,   y_pos: floorPos_y - 25,  size: 50 , isFound: false},
		{x_pos: 550,   y_pos: floorPos_y - 75, size: 50 , isFound: false},
		{x_pos: 715,   y_pos: floorPos_y - 25,  size: 40 , isFound: false},
		{x_pos: 1160,  y_pos: floorPos_y - 75, size: 45 , isFound: false},
		{x_pos: 1350,  y_pos: floorPos_y - 25,  size: 55 , isFound: false},
		{x_pos: 1610,  y_pos: floorPos_y - 75, size: 50 , isFound: false},
		{x_pos: 1960,  y_pos: floorPos_y - 75, size: 50 , isFound: false},
    {x_pos: 2500,  y_pos: floorPos_y - 85,  size: 50 , isFound: false},
    {x_pos: 3075,  y_pos: floorPos_y - 280,  size: 50 , isFound: false}
	];

	canyons = [
    {x_pos: - 1500, width: 300},
    {x_pos: - 650, width: 150},
    {x_pos: - 300, width: 110},
		{x_pos: 300, width: 100},
		{x_pos: 890, width: 50},
		{x_pos: 1500, width: 100},
    {x_pos: 3000, width: 500}
	];

  platforms = [];
  // creats platforms and push it to the platforms array
  platforms.push(createPlatforms(-930, floorPos_y - 240, 280));
  platforms.push(createPlatforms(-960, floorPos_y - 180, 300));
  platforms.push(createPlatforms(-750, floorPos_y - 300, 500));
  platforms.push(createPlatforms(-710, floorPos_y - 90, 280));
  platforms.push(createPlatforms(-410, floorPos_y - 210, 150));

  platforms.push(createPlatforms(820,  floorPos_y - 80, 100));
  platforms.push(createPlatforms(2450, floorPos_y - 60, 100));
  platforms.push(createPlatforms(2950, floorPos_y - 50, 250));
  platforms.push(createPlatforms(3000, floorPos_y - 260, 260));
  platforms.push(createPlatforms(3100, floorPos_y - 125, 180));
  platforms.push(createPlatforms(3280, floorPos_y - 180, 170));

  enemies = [];
  // push enemies to the enemies array
  enemies.push(new Enemy(-1000, floorPos_y - 10, 300));
  enemies.push(new Enemy(-600, floorPos_y - 310, 300));
  enemies.push(new Enemy(100, floorPos_y - 10, 175));
  enemies.push(new Enemy(1050, floorPos_y - 10, 100));
  enemies.push(new Enemy(2200, floorPos_y - 10, 75));
  enemies.push(new Enemy(1800, floorPos_y - 10, 100));
  enemies.push(new Enemy(2500, floorPos_y - 10, 300));
  enemies.push(new Enemy(3000, floorPos_y - 270, 210));
  enemies.push(new Enemy(3500, floorPos_y - 10, 200));



	// Initialise game mechanics
	game_score = 0;

	flagpole = {
		isReached: false,
		x_pos: 4050
	};

  // play sounds
  backgroundSound.loop();
  powerOnSound.play();

  // text font
  textFont('Monospace');



}

function draw()
{
	background(161, 204, 182); // fill the sky blue

  stroke(42, 140, 142)
  fill(42, 140, 142);
	rect(0, floorPos_y, width, height/4);
  fill(52, 111, 105);
  rect(0, floorPos_y + 7.5, width, height/4); // draw some green ground
  fill(15, 48, 51)
  rect(0, floorPos_y + 12, width, height/4);
  noStroke();


	push();
	translate(scrollPos, 0);
	// Draw clouds.
	drawClouds();
	// Draw mountains.
	drawMountains();
	// Draw trees.
	drawTrees();
  // Draws Sign
  drawSign();

  // Draw Platforms
  for (var i = 0; i < platforms.length; i++) {
    platforms[i].draw();
  }

	// Draw canyons.
	for (var i = 0; i < canyons.length; i++) {
		drawCanyon(canyons[i]);
		checkCanyon(canyons[i]);
	}

	// Draw collectable items.
	for (var i = 0; i < collectables.length; i++) {
		if (collectables[i].isFound == false) {
			drawCollectable(collectables[i]);
			checkCollectable(collectables[i]);
		}
	}

	// Draw flag
	renderFlagpole();

  // Draw Enemies
  for (var i = 0; i < enemies.length; i++) {
    enemies[i].draw();

    var isContact = enemies[i].checkContact(gameChar_world_x, gameChar_y);
    if (isContact == true) {
      backgroundSound.stop();
      if (lives > 1) {
        lives--;
        startGame();
        break;
      }
      // if there's one life left
      else if (lives == 1) {
        isDead = true; // for checkPlayerDie function
        break;
      }
    }
  }

	pop();

	// Draw game character.
	drawGameChar();
	// Draw current game score
	drawGameScore();
	// Draw life tokens
	drawLifeTokens(900, 85);
	// checks if gameChar has fallen
	checkPlayerDie();

	// Game statue text display.
	if (lives < 1) {
		fill(168,46,46);
		textSize(38);
		text("GAME OVER",  width/2 - 110, height/2 - 75);
		text("Press space to restart...",  width/2 - 245, height/2);
		return;


	}
	if (flagpole.isReached) {
		fill(240, 173, 78);
		textSize(38);
		text("Level complete. Press space to restart...", 100, height/2);
		return;
	}


	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
	if (gameChar_y < floorPos_y) {
    var isContact = false; //default position
    onPlatform = false;
    for (var i = 0; i < platforms.length; i++) {
      if (platforms[i].checkContact(gameChar_world_x, gameChar_y) == true) {
        isContact = true;
        onPlatform = true;
        isFalling = false;
        break; // break loop when there's only one platform detected
      }
    }
    if (isContact == false) {
      gameChar_y += 3;
  		isFalling = true;
    }
	}
	else {
		isFalling = false;
	}

	// check flagpole if it's reached
	if (flagpole.isReached == false) {
		checkFlagpole();
	}


	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed(){
	// if statements to control the animation of the character when
	if (keyCode == 37) {
		// LEFT
		isLeft = true;
	}
	else if(keyCode == 39) {
		// RIGHT
		isRight = true;
	}
    // JUMP
	if (keyCode == 32 && (gameChar_y >= floorPos_y - 2 && gameChar_y <= floorPos_y + 2) || (keyCode == 32 && onPlatform == true) ) {
		gameChar_y -= 100;
    jumpSound.play();
	}

  if ( keyCode == 32 && (lives == 0 || flagpole.isReached == true)) {
    lives = 3;
    startGame();
  }

}

function keyReleased()
{
	// if statements to control the animation of the character when
	if (keyCode == 37) {
		// LEFT
		isLeft = false;
	}
	else if(keyCode == 39) {
		// RIGHT
		isRight = false;
	}

}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// DRAW GAME CHARACTER
	if(isLeft && isFalling)
	{
		// add your jumping-left code
		fill(80, 196, 255);
		stroke(0, 100, 255, 20);
		beginShape();
			vertex(gameChar_x - 9, gameChar_y - 20);
			vertex(gameChar_x - 5, gameChar_y - 11);
			vertex(gameChar_x - 3, gameChar_y - 12);
			vertex(gameChar_x, gameChar_y - 5);
			vertex(gameChar_x + 6, gameChar_y - 15);
			vertex(gameChar_x + 7, gameChar_y -  12);
			vertex(gameChar_x + 11.2, gameChar_y - 19.8);
		endShape();
		stroke(0);
		fill(51 ,77, 92);
		rect(gameChar_x - 9.5, gameChar_y - 53, 20, 33);
		rect(gameChar_x + 2, gameChar_y - 52, 10, 20);
		// Character Head
		fill(213, 213, 213);
		ellipse(gameChar_x, gameChar_y - 60, 28);
		noStroke();
		// Character Eyes
		fill(90, 214, 255);
		ellipse(gameChar_x - 6, gameChar_y - 57, 11, 7);
		fill(213, 213, 213);
		triangle(gameChar_x - 12, gameChar_y - 61, gameChar_x + 4, gameChar_y - 61, gameChar_x - 12, gameChar_y - 54);

	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
		// Character Legs
		fill(80, 196, 255);
		stroke(0, 100, 255, 20);
		beginShape();
			vertex(gameChar_x - 10.5, gameChar_y - 20);
			vertex(gameChar_x - 8, gameChar_y - 12);
			vertex(gameChar_x - 6, gameChar_y - 14);
			vertex(gameChar_x + 2, gameChar_y - 6);
			vertex(gameChar_x + 6, gameChar_y - 15);
			vertex(gameChar_x + 7, gameChar_y -  12);
			vertex(gameChar_x + 9.5, gameChar_y - 19.8);
		endShape();
		// Character Body
		stroke(0);
		fill(51 ,77, 92);
		rect(gameChar_x - 11, gameChar_y - 53, 20, 33);
		rect(gameChar_x - 13, gameChar_y - 52, 10, 20);
		// Character Head
		fill(213, 213, 213);
		ellipse(gameChar_x, gameChar_y - 60, 28);
		noStroke();
		// Character Eyes
		fill(90, 214, 255);
		ellipse(gameChar_x + 6, gameChar_y - 57, 11, 7);
		fill(213, 213, 213);
		triangle(gameChar_x + 12, gameChar_y - 61, gameChar_x - 4, gameChar_y - 61, gameChar_x + 12, gameChar_y - 54);

	}
	else if(isLeft)
	{
		// add your walking left code
		// Character Body
		stroke(0);
		fill(51 ,77, 92);
		rect(gameChar_x - 9.5, gameChar_y - 53, 20, 33);
		rect(gameChar_x + 2, gameChar_y - 52, 10, 20);
		// Character Head
		fill(213, 213, 213);
		ellipse(gameChar_x, gameChar_y - 60, 28);
		noStroke();
		// Character Eyes
		fill(255, 0, 0);
		ellipse(gameChar_x - 6, gameChar_y - 57, 11, 7);
		fill(213, 213, 213);
		triangle(gameChar_x - 12, gameChar_y - 61, gameChar_x + 4, gameChar_y - 61, gameChar_x - 12, gameChar_y - 54);
		// Character Legs
		fill(0, 0, 0, 155);
		ellipse(gameChar_x, gameChar_y, 25, 5);

	}
	else if(isRight)
	{
		// add your walking right code
		// Character Body
		stroke(0);
		fill(51 ,77, 92);
		rect(gameChar_x - 11, gameChar_y - 53, 20, 33);
		rect(gameChar_x - 13, gameChar_y - 52, 10, 20);
		// Character Head
		fill(213, 213, 213);
		ellipse(gameChar_x, gameChar_y - 60, 28);
		noStroke();
		// Character Eyes
		fill(255, 0, 0);
		ellipse(gameChar_x + 6, gameChar_y - 57, 11, 7);
		fill(213, 213, 213);
		triangle(gameChar_x + 12, gameChar_y - 61, gameChar_x - 4, gameChar_y - 61, gameChar_x + 12, gameChar_y - 54);
		// Character Legs
		fill(0, 0, 0, 155);
		ellipse(gameChar_x, gameChar_y, 25, 5);

	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
		// Character Legs
		fill(80, 196, 255);
		stroke(0, 100, 255, 20);
		beginShape();
			vertex(gameChar_x - 10, gameChar_y - 20);
			vertex(gameChar_x - 6, gameChar_y - 13);
			vertex(gameChar_x - 4, gameChar_y - 15);
			vertex(gameChar_x, gameChar_y - 5);
			vertex(gameChar_x + 4, gameChar_y - 14);
			vertex(gameChar_x + 5, gameChar_y - 10)
			vertex(gameChar_x + 10, gameChar_y - 20);
		endShape();
		stroke(0);
		// Character Body
		fill(51 ,77, 92);
		rect(gameChar_x - 10.5, gameChar_y - 53, 20, 33);
		rect(gameChar_x - 17, gameChar_y - 52, 7, 20);
		rect(gameChar_x + 9, gameChar_y - 52, 7, 20);
		// Character Head
		fill(213, 213, 213);
		ellipse(gameChar_x, gameChar_y - 60, 28);
		noStroke();
		// Character Eyes
		fill(90, 214, 255);
		ellipse(gameChar_x - 5, gameChar_y - 57.5, 11, 5);
		ellipse(gameChar_x + 5, gameChar_y - 57.5, 11, 5);
		fill(213, 213, 213);
		triangle(gameChar_x - 12, gameChar_y - 60, gameChar_x, gameChar_y -60, gameChar_x, gameChar_y -54);
		triangle(gameChar_x + 12, gameChar_y - 60, gameChar_x, gameChar_y -60, gameChar_x, gameChar_y -54);

	}
	else
	{
		// add your standing front facing code
		stroke(0);
		// Character Body
		fill(51 ,77, 92);
		rect(gameChar_x - 10.5, gameChar_y - 53, 20, 33);
		rect(gameChar_x - 17, gameChar_y - 52, 7, 20);
		rect(gameChar_x + 9, gameChar_y - 52, 7, 20);
		// Character Head
		fill(213, 213, 213);
		ellipse(gameChar_x, gameChar_y - 60, 28);
		noStroke();
		// Character Eyes
		fill(255, 0, 0);
		ellipse(gameChar_x - 5, gameChar_y - 57.5, 11, 5);
		ellipse(gameChar_x + 5, gameChar_y - 57.5, 11, 5);
		fill(213, 213, 213);
		triangle(gameChar_x - 12, gameChar_y - 60, gameChar_x, gameChar_y -60, gameChar_x, gameChar_y -54);
		triangle(gameChar_x + 12, gameChar_y - 60, gameChar_x, gameChar_y -60, gameChar_x, gameChar_y -54);
		// Character Legs
		fill(0, 0, 0, 155);
		ellipse(gameChar_x, gameChar_y, 35, 5);

	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds() {
	// Draw clouds.
	for (var i = 0; i < clouds.length; i++) {
		fill(255);
		ellipse(clouds[i].x_pos + 60, clouds[i].y_pos, 120, 80);
		ellipse(clouds[i].x_pos, clouds[i].y_pos + 10, 100, 60);
		ellipse(clouds[i].x_pos + 120, clouds[i].y_pos + 10, 100,  60);
		rect(clouds[i].x_pos, clouds[i].y_pos, 120, 40);
	}
}

// Function to draw mountains objects.
function drawMountains() {
	// Draw mountains.
	for (var i = 0; i < mountains.length; i++) {
		fill(10, 152, 183);
		triangle(
			mountains[i].x_pos,
			mountains[i].y_pos + 133,
			mountains[i].x_pos + 80,
			mountains[i].y_pos + 5,
			mountains[i].x_pos + 190,
			mountains[i].y_pos + 133
		);
		triangle(
			mountains[i].x_pos + 40,
			mountains[i].y_pos + 133,
			mountains[i].x_pos + 150,
			mountains[i].y_pos - 65,
			mountains[i].x_pos + 280,
			mountains[i].y_pos + 133
		);
		fill(6, 97, 148, 155);
		triangle(
			mountains[i].x_pos,
			mountains[i].y_pos + 133,
			mountains[i].x_pos + 80,
			mountains[i].y_pos + 5,
			mountains[i].x_pos + 20,
			mountains[i].y_pos + 133
		);
		triangle(
			mountains[i].x_pos + 70,
			mountains[i].y_pos + 133,
			mountains[i].x_pos + 150,
			mountains[i].y_pos - 65,
			mountains[i].x_pos + 40,
			mountains[i].y_pos + 133
		);
	}
}

// Function to draw trees objects.
function drawTrees() {
	for (var i = 0; i < trees_x.length; i++) {
		fill(78, 54, 32); // Brown
		beginShape();
			vertex(trees_x[i] - 50, floorPos_y);
			vertex(trees_x[i], floorPos_y);
			vertex(trees_x[i] - 10, floorPos_y - 60);
			vertex(trees_x[i] - 40, floorPos_y - 60);
		endShape();
		fill(35, 83, 71); // Green
		triangle(trees_x[i] - 70, floorPos_y - 37, trees_x[i] - 25, floorPos_y - 120, trees_x[i] + 20, floorPos_y - 37);
		triangle(trees_x[i] - 70, floorPos_y - 57, trees_x[i] - 25, floorPos_y - 140, trees_x[i] + 20, floorPos_y - 57);
		triangle(trees_x[i] - 70, floorPos_y - 77, trees_x[i] - 25, floorPos_y - 155, trees_x[i] + 20, floorPos_y - 77);
	}
}


// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
	fill(161, 204, 182);
	rect(t_canyon.x_pos, 432, t_canyon.width, 200);
	fill(127, 210, 185, 80);
	rect(t_canyon.x_pos, 460, t_canyon.width, 200);
  fill(20, 210, 185, 35);
	rect(t_canyon.x_pos, 520, t_canyon.width, 200);
  fill(0, 0, 0, 5);
	rect(t_canyon.x_pos, 560, t_canyon.width, 200);
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
	if (gameChar_world_x > t_canyon.x_pos && gameChar_world_x < t_canyon.x_pos + t_canyon.width && gameChar_y >= floorPos_y) {
		isPlummeting = true;
	}
	if (isPlummeting == true) {
		gameChar_y += 4.5;
	}
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
	stroke(119, 28, 220, 75);
	fill(72, 21, 89);
	ellipse(t_collectable.x_pos, t_collectable.y_pos, t_collectable.size - 15);
	stroke(0, 0, 0, 75);
	fill(87, random(40, 60), 122);
	ellipse(t_collectable.x_pos, t_collectable.y_pos, t_collectable.size - 25);
	noStroke();
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
	// check if gameChar is intersecting with the t_collectable
	if (dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) <= t_collectable.size * 1.05) {
    t_collectable.isFound = true;
		game_score += 1;
    objectCollectedSound.play();
  }
}


// ---------------------------------
// Flagpole render and check functions
// ---------------------------------

// Function to draw Flagpole.

function renderFlagpole() {
	push();
	strokeWeight(5);
	stroke(180);
	line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250);
	fill(60, 60, 108);
	noStroke();
	if (flagpole.isReached) {
		rect(flagpole.x_pos, floorPos_y - 250, 75, 50);
	}
	else {
		rect(flagpole.x_pos, floorPos_y - 60, 75, 50);
	}

	pop();
}

// Function to check flagpole.
function checkFlagpole() {
	var distance = abs(gameChar_world_x - flagpole.x_pos);

	if (distance < 20) {
		flagpole.isReached = true;
    winGameSound.play();
    backgroundSound.stop();
	}
}

// ---------------------------------
// Player score, lives render and check functions
// ---------------------------------

// Draw life tokens.
function drawLifeTokens(xPos, yPos) {
	for(var i = 0; i < lives; i++) {
		fill(220, 0, 0);
    // Character Head
    stroke(0);
    fill(213, 213, 213);
    ellipse(xPos + i * 50, yPos - 60, 32);
    noStroke();
    // Character Eyes
    fill(255, 0, 0);
    ellipse(xPos - 5 + i * 50, yPos - 57.5, 11, 5);
    ellipse(xPos + 5 + i * 50, yPos - 57.5, 11, 5);
    fill(213, 213, 213);
    triangle(xPos - 12 + i * 50, yPos - 60, xPos + i * 50, yPos -60, xPos + i * 50, yPos -54);
    triangle(xPos + 12 + i * 50, yPos - 60, xPos + i * 50, yPos -60, xPos + i * 50, yPos -54);
	}
}

// Draw Game score.
function drawGameScore() {
	stroke(119, 28, 220, 75);
	fill(72, 21, 89);
	ellipse(20, 20, 50 - 15);
	stroke(0, 0, 0, 75);
	fill(87, 43, 122);
	ellipse(20, 20, 50 - 25);
	noStroke();

	fill(255);
	noStroke();
	textSize(22);
	text("x " + game_score + " / " + collectables.length, 45, 26);
}

// Functions to check character lives
function checkPlayerDie() {
	if ((gameChar_y > height || isDead == true) && lives > 0) {
		lives -= 1;
    backgroundSound.stop();
		startGame();
    if (lives == 0) {
      gameOverSound.play();
      backgroundSound.stop();
    }
	}


}


// ---------------------------------
// Platforms render and check functions
// ---------------------------------

function createPlatforms(x, y, length) {
  var platform = {
    x: x,
    y: y,
    length: length,
    draw: function() {
      // platform drawing
      strokeWeight(3);
      stroke(15, 48, 51, random(200, 255))
      fill(42, 140, 142);
      rect(this.x, this.y, this.length, 20);
      noStroke();
      strokeWeight(0);
    },
    checkContact: function(gc_x, gc_y) {
      // checks if the game char is on the platform
      if (gc_x > this.x && gc_x < this.x + this.length) {
        var distance = this.y - gc_y;
        // return true if the game char is on the platform
        if (distance >= 0 && distance < 5) {
          return true;
        }
      }

      // return false if the game char is not on the platform
      return false;
    }
  }
  return platform;
}

function Enemy(x, y, range) {
  this.x = x,
  this.y = y,
  this.range = range;

  this.currentX = x;
  this.inc = 1;
  // update function updates the enemy positon across the screen
  this.update = function() {
    this.currentX += this.inc;
    // checks if the enemy position passed the value of range in
    if(this.currentX >= this.x + this.range) {
      this.inc = -1;
    }
    else if (this.currentX < this.x) {
      this.inc = 1;
    }
  }
  // Draws enemy shape
  this.draw = function() {
    this.update(); // to draw the enemy in the right updated position
    fill(0);
      beginShape();
        vertex(this.currentX, this.y - 20);
        vertex(this.currentX - 25, this.y - 10)
        vertex(this.currentX, this.y);
        vertex(this.currentX + 25, this.y - 10)
      endShape();
    stroke(0)
    strokeWeight(1)
    fill(213, 213, 213);
    ellipse(this.currentX, this.y - 10, 35, 35);
    fill(0);
    ellipse(this.currentX, this.y - 10, 20, 20);
    fill(11, 219, 182);
    ellipse(this.currentX, this.y - 10, 15, 15);
    fill(0);
    ellipse(this.currentX, this.y - 10, 10, 10);
    fill(255);
    ellipse(this.currentX, this.y - 10, 4, 4);
    fill(0)
    for(var i = 0; i < 3; i++) {
      ellipse(this.currentX - 5 + i * 5, this.y + 3.5, 2, 2);
    }
    noStroke();
    fill(0, 0, 0, 55)
    ellipse(this.currentX, this.y + 15, 35, 10);

  }

  this.checkContact = function(gc_x, gc_y) {
    // compares game char with Enemy
    var distance = dist(gc_x, gc_y, this.currentX, this.y)
      if (distance < 25) {
        return true;
      }

    return false;
  }
}

// ---------------------------------
// Sign drawing function
// ---------------------------------

// Draws a sign at the start of the game to show the user how to control the character movement
function drawSign() {
  // shape of the sign
  stroke(58, 176, random(158, 230));
  strokeWeight(4);
  noFill(0);
  beginShape()
    vertex(340, 10);
    vertex(740, 10);
    vertex(740, 80);
    vertex(720, 100);
    vertex(320, 100);
    vertex(320, 30);
    vertex(340, 10);
  endShape()
  noStroke();
  // Text
  fill(35, 43, random(43, 80));
  textSize(16);
  text(' - Use        keys to control your movement', width/3 - 5, 40);
  text(' - Use        key to jump', width/3 - 5, 70);
  //draws space bar and arrow key images
  image(spaceImg, 376, 18, 100, 95);
  image(arrowsImg, 400, 14, 50, 30);

}
