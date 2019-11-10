//creating variable for API url
var url = 'https://forbes400.herokuapp.com/api/forbes400?limit=100';
//creating arrays for JSON data
var data = [];
//creating variable for flags and billionairs pictures
var img = [];
var flags = [];
//creating variables to use to make calculations
var usaWage, poverty, gdp, total, totalLong;

//creates a "words" object with x, y and size
var words = {
  x: 0,
  y: 50,
  size: 0
};

//creates a "pic" object with x, y and size
var pic = {
  x: 0,
  y: 50,
  size: 90
};

//creates a "country" object with the GDP of certain countries
var country = {
  Mexico: 1150000000000,
  Somalia: 7396000000,
  UnitedKingdom: 2622000000000,
  USA: 19390000000000,
  Greece: 200000000000
}


//Creates a "params" object to be used in GUI
var params = {
amount: 10,
};


function preload(){
  createCanvas(1280, 720);
  //this loads the data from API into the data array
  data = loadJSON(url)
console.log(data)
}


function setup() {
  //setting the aligning to center
  textAlign(CENTER);
  imageMode(CENTER);
  ellipseMode(CENTER);
  rectMode(CENTER);

  //loads images of billionaires from the images folder (with the same name as stored in data)
  //and stored locally into array in same location as corresponding billionaire
  for (var i = 0; i < 20; i++) {
    img[i] = loadImage("Images/" + data[i].name + ".jpg");
  }
  //loads images of country flags from the flags folder (with the same country as in data)
  //and stored locally into array in same location as corresponding billionaire
  for (var i = 0; i < 20; i++) {
    flags[i] = loadImage("Flags/" + data[i].country + ".png");
  }



	//Creates new function in params object called choice
 	params.Country = function() {
		//Calls Choice function to change value of countries gdp
	  choice();
	};


	//Creates variable gui and assignes a new gui
	var gui = new dat.GUI();

	//Adds all the lists and sliders to gui
	gui.add(params, 'amount', 0, 20).name('Amount');
  gui.add(params, 'Country', [ 'Mexico', 'Somalia', 'United Kingdom', 'USA', 'Greece' ] ).name('Country GDP');
  //this assigns a country from list on startup to avoid NaN number
  params.Country = 'USA';
}


function draw() {
  //calls richlist function
  richList();
}



function richList(){
  //this resets the screen every fram
  background(240);
  //this sets the variable r to be the value on the slider of GUI
  var r = Math.round(params.amount);
  //assigning total and totalLong to 0
  total = 0;
  totalLong = 0;
  fill(240);
  //looping from 0 to the value on the GUI slider
  for (var i = 0; i < r; i++) {
    //calls setsize with current point in loop and amount on slider
    setSize(i, r);
    //if statement calls checkmouse with x,y and image size to check if mouse is over current image being drawn
      if (checkMouse(pic.x, pic.y, pic.size) == true) {
        //calls background to reset size of all pictures
        background(240);
        //this for loop displays everything before the selected billionaire
        for (var x = 0; x < i; x++) {
          //calls the setsize function with the new point in loop
          setSize(x, r);
          //calls displayAll with new point in loop, value on slider, and the scale at which to decrease the non-selected images
          displayAll(x, r, 0.7);
        }
        //this for loop displays everything after the selected billionaire
        for (var x = i+1; x < r; x++) {
          //calls the setsize function with the new point in loop
          setSize(x, r);
          //this for loop displays everything after the selected billionaire
          displayAll(x, r, 0.7);
        }
      //this calls the selected function to highlights selected IF one is selected
      selected();
      }
      //if the mouse is not over current image then draw all normal size
      else{
        //calls display all function with a 1:1 scale to keep images same size
        displayAll(i, r, 1);
      }
  }


  //this function displays the selected image and data
  function selected(){
    //this if statement checks if the selected billionaire is on the left or right side
    if (i > r/2) {
      //this calls a function to set the side of the text in relation to text
      setSide('right', i, r);
      //this calls a function to display image and text in correct location
      displaySelected(i, r, 30);
      //this sets the the overall counter to the value of the selected image so
      //that the images will draw from the point after the selected one
      i = x;
    }
    else{
      //this calls a function to set the side of the text in relation to text
      setSide('left', i, r);
      //this calls a function to display image and text in correct location
      displaySelected(i, r, -30);
      //this sets the the overall counter to the value of the selected image so
      //that the images will draw from the point after the selected one
      i = x;
    }
  }

  //this for loop loops through all the billionaires on screen and adds their net worth together
  for (var i = 0; i < r; i++) {
    //some net worths were undefined so this if statement catches them
    if (data[i].realTimeWorth != null) {
      //the variable total adds up the net worths of the billionaires on screen and saves the number in billions by dividing by 1000
      total +=  Math.round(data[i].realTimeWorth/1000);
      //the totalLong is the same as total but multiplied by 1000000 because data from API is in multiples of millions
      totalLong += Math.round(data[i].realTimeWorth*1000000);
    }
    //if real time net worth is undefined move on to next billionaire
    else{
      i++;
    }
  }
  //if the total is greater than one trillion (1000 billions)
  if (total > 1000) {
    //then call createTotals with total, totalLong, 'TRILLION', and the "scale" to divide the number by, to make is easily legible
    displayTotals(total, totalLong, 'TRILLION', 1000);
  }
  else{
    //if smaller than 1 trillion same function call but dividing by 1
    displayTotals(total, totalLong, 'BILLION', 1);
  }
}

//this function checks which country is selected in the GUI and returns the corresponding data from country object
function choice(){
  //for example if you selec mexico this if statement catches that and returns the value of mexico's GDP from object
  if (params.Country == 'Mexico')return country.Mexico;
  else if (params.Country == 'Somalia')return country.Somalia;
  else if (params.Country == 'United Kingdom')return country.UnitedKingdom;
  else if (params.Country == 'USA')return country.USA;
  else if (params.Country == 'Greece')return country.Greece;
}

//this function displays totals on screen and does some simple calculations
//t = total, tL = totalLong, scale = BILLION/TRILLION, multiple = 1/1000
function displayTotals(t, tL, scale, multiple){
  fill(20);
  //re-aligns text to center since setSide function aligns it left or right
  textAlign(CENTER)
  //set gdp variable to equal totalLong/countryGDP *100 to give a percentage
  gdp = (tL/ choice())*100;
  //sets usawage to equal totalLong/ usa average wage
  usaWage = tL / 49192;
  //sets poverty to totallong / amount of people in poverty
  poverty = tL / 3000000000;
  //maps textsize of billionaires totals to size of total
  textSize(map(t, 100, 1500, 25, 125));
  //displays text and calls financial function with total/multiple to give legible number
  text('TOTAL: $' + financial(t/multiple) + ' ' + scale, width/2, height/1.5)

  //ALL THREE NEXT MAPS ARE STAGGERES TO GIVE THE TEXT SCROLL EFFECT
  //fill and colour are MAPPED to get bigger and darker/ smaller and lighter on mouseY for the first line of text after total
  fill(map(mouseY, 0, height, 200, 20));
  textSize(map(mouseY, 0, height, 30, 60));
  //Displays poverty amount and calls financial to set it to always have 2 decimal places
  text('$' + financial(poverty) + ' For all 3 billion in poverty', width/2, height/1.5+60);
    //these fill and textsize functions only apply to the middle line of text and make it get bigger the closer the mouse is to the center
    //these if statements simply cutoff the map function from going further than the bounds I set
    if (mouseY > height/2) {
      //fill and textsize mapped to mouseY between height/2 and height
      fill(map(mouseY, height/2, height, 20, 200));
      textSize(map(mouseY, height/2, height, 60, 35));
    }
    else{
      //fill and textsize mapped to mouseY between 0 and height/2
      fill(map(mouseY, 0, height/2, 200, 20));
      textSize(map(mouseY, 0, height/2, 30, 60));
    }
    //we then display that text rounding the salaries to the nearest whole number
    text(Math.round(usaWage) + ' Average American yearly salaries', width/2, height/1.5+110)
    //the last line is again mapped to mouseY but the opposite of the first line
    fill(map(mouseY, height/2, height, 20, 200));
    textSize(map(mouseY, 0, height, 60, 30));
    //the textfor the third line is then displayed using the selected country name from the list
    text(financial(gdp) + "% of " + params.Country + "'s GDP", width/2, height/1.5+170);
  }

//this function sets the text to either side of the selected billionaire
//imgRL = right/left, selected = location in loop of selected billionair, totalAmount = value on slider
function setSide(imgRL, selected, totalAmount){
  //if statement checks if text should be either on the right or the left
  if (imgRL == 'right') {
    textAlign(RIGHT);
    //uses pic.x and pic.size to assign the x location of the words according to where the picture is
    pic.x = (width-360) * (selected / totalAmount)+200;
    pic.size = map(totalAmount, 0, 20, 90, 60)*4
    //words.x is then the pic.x - pic.size since the text need to be to the left of the image
    words.x = pic.x - pic.size/2 - 20;
  }
  else if (imgRL == 'left'){
    textAlign(LEFT);
    //uses pic.x and pic.size to assign the x location of the words according to where the picture is
    pic.x = (width-360) * (selected / totalAmount)+200;
    pic.size = map(totalAmount, 0, 20, 90, 60)*4
    //words.x is then the pic.x + pic.size since the text need to be to the right of the image
    words.x = pic.x + pic.size/2 + 20;
  }
}

//this function displays the selected image and info bigger and in a diiferent place
//selected = location of selected in loop, totalAmount = slider value, move = 30/-30 depending on which side the text needs to be on
//All use pic.y or words.y to stagger text next to image
function displaySelected(selected, totalAmount, move){
  fill(20)
  //displaying images using pic.x pic.y and pic.size which has been set in setSize function
  //move is either 30 || -30 depending on which side of image the text should be
  image(img[selected], pic.x, pic.y+200, pic.size, pic.size);
  image(flags[selected], words.x - move, pic.y + 120);
  textSize(17);
  //displaying country name from API with words.x, pic.y also set up in setSize and subtracting move
  text(data[selected].country, words.x-move*2.2, pic.y+125);
  textSize(25);
  //displaying billionaires name and age from API with words.x, and words.y
  text(data[selected].name + ', ' + data[selected].age, words.x, words.y+170);
  //making net worth fill green
  fill(0, 153, 0);
  //displays text of net worth using realTimeWorth from API and showing as billions
  text('Net Worth: $' + financial(data[selected].realTimeWorth * 1000000/1000000000) + ' BILLION', words.x, words.y+200);
  //resetting fill to black and lowering textsize for less important features
  fill(20);
  textSize(20);
  //displays text of title from API
  text('Title: ' + data[selected].title, words.x, words.y+225);
  //displays source of wealth from API
  text('Source of wealth: ' + data[selected].source, words.x, words.y+250);
}

//this function displays all the images and their rank on top of them
//current = loaction in loop, totalAmount = amount on slider, multiple = scale of image and text (0.7/1)
function displayAll(current, totalAmount, multiple){
  //image displayed and size multiplied by multiple to choose the size depending on whether something is selected or not
  image(img[current], pic.x, pic.y, pic.size*multiple, pic.size*multiple);
  //textsize mapped to the total amount on slider, and then multipled by multiple to set size
  textSize(map(totalAmount, 0, 20, 50, 30)*multiple);
  //displays text using data from API stored in data array
  text('#' + data[current].rank, words.x, words.y+10);
}

//setSize is used to set location and size of text and images
function setSize(current, totalAmount){
  //the +-80 makes a 80 pixel border around the images
  //the current location in loop is divided by the amount on slider to give a decimal percentage of position on screen
  //this is then multiplied by width to get an actual pixel position
  //both done for words.x and pic.x
  words.x = (width-80) * (current / totalAmount)+80;
  pic.x = (width-80) * (current / totalAmount)+80;
  //pic.size is mapped totalAmount to set size acording to how many billionaires on screen
  pic.size = map(totalAmount, 0, 20, 90, 60)
}

//this function checks if the mouse is over the current image being drawn
function checkMouse(){
  //this if statement checks if mouseX & mouseY is within the x and y boundries of image being drawn
  if(mouseX < pic.x + (pic.size / 2) && mouseX > pic.x - (pic.size / 2) && mouseY < pic.y + (pic.size / 2) && mouseY > pic.y - (pic.size / 2)){
    //if so returns true
    return true;
  }
  else{
    //else returns false
    return false;
  }
}

//this function gets called with x as number to return that number to two decimal points
function financial(x) {
return Number.parseFloat(x).toFixed(2);
}
