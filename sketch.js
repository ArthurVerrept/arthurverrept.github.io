//Creates hit & hit2 variable to detect collisions
var hit = false;
var hit2 = false;

//Creates gravity variables for both row of ellipses
var gravity = 0;
var gravity2 = -0.1;

//Creates opacity variable
var o = 50;

//Sets move seed of polygon to 0
var move = 0;

//Ball bounce distance for collisions
var distance;

//Creates polygon array to store perlin shape vectors
var poly = [];

//Creates array for both top and bottom ellipses to store vectors to join with lines
var lines = [];
var lines2 = [];

//Creates ball array to hold vectors of ellipses
var balls = [];
var balls2 = [];
var params;

function setup() {
	createCanvas(594, 841);
	newLines();
	//Draws ellipse between colliding objects
	collideDebug(true);

	//Creates params and assigns certain values
	params = {
	gravity: 0.1,
	distance: 30
	}

	//Creates new function in params called newLine
 	params.newLine = function() {
		//Calls newLines function to make new line of ellipses
	  newLines();
	};

	//Creates new function in params called blur
	params.blur = function() {
		//Calls change function to toggle fade
		change();
	};

	//Creates new function in params called reset
	params.reset = function() {
		//Calls reset to reset the program
		reset();
	};

	//Creates variable gui and assignes a new gui
	var gui = new dat.GUI();

	//Adds all the buttons and sliders to gui
	gui.add(params, 'gravity', 0.01, 0.2).name('Gravity');
	gui.add(params, 'distance', 30, 100).name('Distance');
	gui.add(params, 'newLine').name('New balls');
	gui.add(params, 'blur').name('Blur on/off');
	gui.add(params, 'reset').name('Reset');
};



function draw() {
	//Assigns variables the input data in the gui
	gravity = params.gravity;
	gravity2 = params.gravity * -1;
	distance = params.distance;

	//Fills rectangle with colour white and opacity of variable o
	fill(255, o);
	//Creates rectangle of full canvas size to fade ellipses
	rect(0, 0, width, height);

	//Calls not pressed function to fill poly array with shape vectors and set fill colour
	notPressed();

	//Start shape outside loop to draw whole array
	beginShape();
	//Draw the polygon from the Vectors created in the notPressed function
	for(i=0; i < poly.length; i++){
		//Draws out center shape from poly array
		vertex(poly[i].x,poly[i].y);
	}
	//Ends shape
	endShape(CLOSE);

	//For the balls array length
	for (var i = 0; i < balls.length; i++) {
		//Call update and display functions at point "i" in array
		balls[i].update();
		balls[i].display();
	}

	//For the balls2 array length
	for (var i = 0; i < balls2.length; i++) {
		//Call update and display functions at point "i" in array
		balls2[i].updateBot();
		balls2[i].displayBot();
	}

	//calls the drawLines function to connect ellipses
	drawLines();
}



function notPressed(){
	//Sets xoff variable to move which keeps shape changing
	var xoff = move;

	//Creates one variable of RGB and maps them to pelin noise between 0 and 1 to return value 0 - 225
	var colourR = map(noise(xoff), 0, 1, 0, 225);
	var colourG = map(noise(xoff+100), 0, 1, 0, 225);
	var colourB = map(noise(xoff+10000), 0, 1, 0, 225);

	//Sets fill to mapped colours
	fill(colourR,colourG,colourB);

	//turns off  lines
	noStroke();

	//Goes through every x from 0 to width of canvas
		for (var x = 0; x < width; x++) {
			//Maps y coordinate from perlin noise and sets value between 0 - height
			y = map(noise(xoff), 0, 1, 0, height);
			//Fills array with x and y values
			poly[x] = createVector(x, y);
			//Adds to xoff to keep polygon shape irregular
			xoff += 0.002;
		}
		//Adds to move so polygon is moving and not static
		move += 0.002;
  }

	function Ball(tempX, tempY, tempW) {
  this.x = tempX;  //x location of circle
  this.y = tempY;  //y location of circle
  this.w = tempW;  //Width of circle
  this.speed = 0;  //Speed for ellipses moving down
	this.speed2 = 0;	//Speed2 for ellipses moving up

  this.display = function() {
		//Create RGB colour variables for ellipses set based on height of ellipse on canvas
		var colourR = map(this.y, 0, height/2, 0, 225);
		var colourG = map(this.y, height/2, 0, 0, 225);
		var colourB = map(this.y, 0, height/2, 0, 225);

		//Set fill colour to variables previously created
    fill(colourR, colourG, colourB);

		//Draws ellipse
    ellipse(this.x,this.y,this.w,this.w);

		//Adds this ellipse to lines array
		lines.push(createVector(this.x,this.y));
  }

  this.update = function() {
			//Sets hit variable to true or false depending on if ellipse has hit polygon using distance parameter from GUIs
			hit = collideCirclePoly(this.x, this.y, distance, poly);

			//Checks if ellipse hit the polygon
			if (hit == true) {
				//If there was a collision and speed is under 2
				if (this.speed < 1) {
					//set speed to 4 for top row of ellipses
					this.speed = 4;
				}

				//Change direction and reduce bounce
				this.speed = this.speed * -0.95;
			}

    //Add speed to y location
    this.y = this.y + this.speed;

    // Add gravity to speed
    this.speed = this.speed + gravity;
  }

	//Same as above with slight variation to colour and speed direction
	this.displayBot = function() {
		var colourR = map(this.y, height, height/2, 0, 255);
		var colourG = map(this.y, height, height/2, 0, 255);
		var colourB = map(this.y, height, height/2, 255, 0);
    fill(colourB, colourR, colourG);
    noStroke(0);
    ellipse(this.x,this.y,this.w,this.w);
		lines2.push(createVector(this.x,this.y));
  }

  this.updateBot = function() {
			//Sets hit2 variable to true or false depending on if ellipse has hit polygon using distance parameter from GUI
			hit2 = collideCirclePoly(this.x, this.y, distance, poly);
			if (hit2 == true) {
				//If there was a collision and speed under -1
				if (this.speed2 > -1) {
					//Set speed to -4 for bottom row of ellipses
					this.speed2 = -4;
				}
				//Change ball direction and reduce bounce
				this.speed2 = this.speed2 * -0.95;
			}

		//add speed2 to y location
    this.y = this.y + this.speed2;

		//add gravity2 to speed2
    this.speed2 = this.speed2+ gravity2;
  }
}


function drawLines(){
	//Set no fill
	noFill();
	//Set stroke colour
	stroke(100);
	//Creates lineLength variable and sets as both "lines" arrays added together
	var lineLength = lines.length + lines2.length;
	//Sets max amount of lines on screen to ("amount of ellipses" * 2 for both x and y) + 1 to round up
	var lineLengthMax = (width/15)*2+1;

	//If lineLength is bigger than lineLengthMax
	//i.e. if theres less than 2 rows of ellipses on top and bottom
	if (lineLength < lineLengthMax) {

		//Start lines shape for top ellipses
		beginShape();
		//For the lines array length
		for (var i = 0; i < lines.length; i++) {
			//Draw shape with x and y coordinates from lines array
			vertex(lines[i].x, lines[i].y);
		}
		//End lines for top ellipses
		endShape();

		//Start lines shape for bottom ellipses
		beginShape();
		//For the lines2 array length
		for (var i = 0; i < lines2.length; i++) {
			//Draw shape with x and y coordinates from lines2 array
			vertex(lines2[i].x, lines2[i].y);
		}
		//End lines for bottom ellipses
		endShape();
		//clear arrays for next position
		lines = [];
		lines2 = [];
	}

	//else clear lines arrays to not display lines on ellipses
	else{
		lines = [];
		lines2 = [];
	}
}

function newLines(){
	//Creates width/15 amount of elipses on screen
	for (var i = 0.75; i < width/15; i++) {
		//Pushes x and y coordinates to arrays ball and ball2
		//Calls ball function with x, y, and speed coordinates
		//	one for top row and one for bottom ro of ellipses
		balls.push(new Ball(i*15, 10, 15));
		balls2.push(new Ball(i*15, 845, 15));
	}
}

//Function to change opacity on button press
function change(){
	//If the value of o is 50 change to 255
	if (o == 50) {
		o = 255;
	}
	//If the value of o is 255 change to 50
	else {
		o = 50;
	}
}

//Function to reset all
function reset(){
	//Clears line array to clear all lines off the screen
	lines = [];
	lines2 = [];

	//Clears ball arrays to clear all ellipses off the screen
	balls = [];
	balls2 = [];

	//Calls newLines function to create the new ellipses
	newLines();

	//Sets o to 255 so that when program always resets it always has blur/fade turned on
	o = 255;

	//Calls the change function to turn blur back on/ keep it on
	change();
}
