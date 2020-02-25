// global colour variables
var cols = {
  white: [242, 242, 242],
  black: [100, 100, 100],
  red: [218, 3, 21],
  orange: [242, 116, 5],
  yellow: [252, 203, 20],
  green: [143, 180, 85]
}

// one is for ellipses foreground and one is for background
var lightCols = {
  white: [247, 247, 247],
  black: [30, 30, 30],
  red: [255, 50, 65],
  orange: [255, 160, 62],
  yellow: [245, 230, 50],
  green: [160, 217, 102]
}

// set up global variables
var mapLoaded;
var center = [];
var userPoint;
var poly = [];
var compassHeading = 0;
var pointDistance = [];
var polygon = []
var nowCol = [];
var entered = [];
const polyAmount = 12
var entryPoint;
var hasLeft = [];
var word = 'Ready?';
var total;
var routes = 0;
var onRoute = false;
var gotPosition = false;
var gotBearing = false;
var bgCol = cols.white;
var lightBgCol = lightCols.white;


// Create a variable to hold our map
let myMap;
// Create a variable to hold our canvas
let canvas;
// Create a new Mappa instance using Leaflet.
const mappa = new Mappa('Leaflet');

// put all our map options in a single object
const options = {
  lat: 50.37841452717053,
  lng: -4.128819446563721,
  zoom: 14,
  style: "https://{s}.tile.osm.org/{z}/{x}/{y}.png",
  dragging: false,
  doubleClickZoom: false
}

// loads all of our JSON polygons into an array
function preload(){
  for(let i = 0; i < polyAmount; i++){
    poly[i] = loadJSON('data/poly'+ i +'.geo.json');
  }
}

function setup(){
  // loading our three images to be used in draw
  imgA = loadImage('assets/abnormap.png');
  imgP = loadImage('assets/pointer.png');
  imgI = loadImage('assets/intro.png'); 

  canvas = createCanvas(windowWidth,windowHeight);

  // create a map intance with our options
  myMap = mappa.tileMap(options);

  // overlay the map and call onMapLoad
  myMap.overlay(canvas, onMapLoad);  
  
  // if user accepts location request 
  if(navigator.geolocation){
    // watch loaction and call gotPos every second
     navigator.geolocation.watchPosition(gotPos, undefined, 
    {
    maximumAge: 0,
    timeout: 1000,
    enableHighAccuracy: true
    });
  }
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(width / 15);
}


function gotPos(e){
  // set boolean to true
  gotPosition = true;
  
  // userpoint become a turf point using lng lat values
  userPoint = turf.point([e.coords.longitude, e.coords.latitude]);
  
  //if map has not loaded, jump back out of function
  if (!mapLoaded) return;
}


function onMapLoad(){ 
  // when map is loaded set mapLoaded boolean to true
  mapLoaded = true;


  for(let i = 0; i < polyAmount; i++){
    
    // sets the color of ellipses in relation to zones 
    if(poly[i].features[0].danger == 5){
      nowCol[i] = lightCols.black;
    }
    if(poly[i].features[0].danger == 4){
      nowCol[i] = lightCols.red;
    }
    if(poly[i].features[0].danger == 3){
      nowCol[i] = lightCols.orange;
    }
    if(poly[i].features[0].danger == 2){
      nowCol[i] = lightCols.yellow;
    }
    if(poly[i].features[0].danger == 1){
      nowCol[i] = lightCols.green;
    }
    
    // array of the center of all the polygons
    center[i] = turf.centerOfMass(poly[i]);
    
    // fills arrays to correct size not as undefined
    entered[i] = false;
    hasLeft[i] = false;
    pointDistance[i] = 0;
  }
}


function draw() {
  var numIn;
  noStroke();
  // once map is loaded draw all these elements
  if(mapLoaded == true){
    clear();

    // create arrays to be used in draw only
    var bearing = [];
    var inChecker = [];
    var distanceFromCenter = [];
    var circleSize = [];

    // if your location has been found
    if(userPoint != undefined){    
      for(let i = 0; i < polyAmount; i++){
        // find the bearing from you to all the centers of polygons
        bearing[i] = turf.bearing(userPoint, center[i]);
        // check if you are within any of the polygons
        inChecker[i] = turf.pointsWithinPolygon(userPoint, poly[i]);

        // set the distance in polygons to metres
        var options = {
          units: 'meters'
        };
        // gets user distance from center or every polygon with previous options
        distanceFromCenter[i] = turf.distance(userPoint, center[i], options);

        // if you are too far from a polygon or you have already entered it
        if(distanceFromCenter[i] > 900 || entered[i] == true)
        {
          // don't show the circle on the compass
          circleSize[i] = 0;
        }
        else{
          // if not, map the circle size based on the distance from the zone
          circleSize[i] = map(distanceFromCenter[i], 50, 900, 40, 5)
        }
        
        // draw a rectangle over the map and fill with bgColor
        fill(bgCol);
        rect(0,0,1000000, 100000)

        // add images loaded in draw
        imageMode(CENTER);
        image(imgA, windowWidth/2, imgA.height/18, imgA.width/16, imgA.height/16);
        image(imgP, windowWidth - imgP.width/47, imgA.height/18, imgP.width/40, imgP.height/40);

        // draw button
        strokeWeight(1.5)
        stroke(60);
        fill(cols.white);
        rect(windowWidth-80,windowHeight-50,75,30, 4.5);
        fill(20);
        noStroke();
        textAlign(CENTER);
        textFont('georgia', 14)

        // use word variable as text in button to change when clicked
        text(word,windowWidth-80,windowHeight-50);

        // if you are on route
        if(numIn != undefined){
          // display name of area and distance in area
          textAlign(RIGHT)
          fill(20);
          text(poly[numIn].features[0].name, (windowWidth - imgP.width/25), imgA.height/18);
          textAlign(LEFT)
          textSize(13);
          text('Distance in \ncurrent zone:', 20, windowHeight-49);
          textSize(20);
          text(Math.round(pointDistance[numIn]) + " m", 105, windowHeight-50);
        }

        
        // if you click start and landing screen has been loaded
        if(onRoute == true && routes == 1){
          // if you are in a polygon and have not left that polygon yet
          if(inChecker[i].features.length == 1 && hasLeft[i] == false){
            // hide the circle of the zone you are in
            circleSize[i] = 0;
            // if you have not entered preveiously mark entry point
            if(entered[i] == false){
              entryPoint = turf.point([userPoint.geometry.coordinates[0],userPoint.geometry.coordinates[1]]);
            }
            // then set entered for that polygon to true
            entered[i] = true;
          
            // depending on danger level
            if(poly[i].features[0].danger == 1){
              // work out distance
              pointDistance[i] = turf.distance(entryPoint, userPoint, options)
              // set background color to correspond to danger level
              bgCol = cols.green;
              lightBgCol = lightCols.green;
            }
          
            else if(poly[i].features[0].danger == 2){
              // multiply distance by danger level for extra score
              pointDistance[i] = turf.distance(entryPoint, userPoint, options) * 2
              bgCol = cols.yellow;
              lightBgCol = lightCols.yellow;
            }

            else if(poly[i].features[0].danger == 3){
              pointDistance[i] = turf.distance(entryPoint, userPoint, options) * 3
              bgCol = cols.orange;
              lightBgCol = lightCols.orange;
            }
          
            else if(poly[i].features[0].danger == 4){
              pointDistance[i] = turf.distance(entryPoint, userPoint, options) * 4
              bgCol = cols.red;
              lightBgCol = lightCols.red;
            }
          
            else if(poly[i].features[0].danger == 5){
              pointDistance[i] = turf.distance(entryPoint, userPoint, options) * 5
              bgCol = cols.black;
              lightBgCol = lightCols.black;
            }
            // set variable to i to be user outside loop
            numIn = i;
          }
          // if you are no longer in the polygon but have been in it
          else if(inChecker[i].features.length == 0 && entered[i] == true){
            // close polygon and set background to white
            hasLeft[i] = true;
            bgCol = cols.white;
          }
        }
        // if you are not on a route
        else{
          // if you have only just opened it show landing page
          if(routes == 0){
            image(imgI, windowWidth/2, windowHeight/2-20, imgI.width/3, imgI.height/3); 
          }
          // if you have finish a route
          else{
            // add all totals from distance array together
            var tempTotal = pointDistance.reduce((a, b) => a + b, 0);
            // round to nearest whole number
            total = Math.round(tempTotal);

            // if you stop before entering a zone
            if(total == undefined){
              //set total to zero and not undefined
              total = 0;
            }

            // draw end rect and fill with content
            fill(160);
            stroke(60);
            strokeWeight(2);
            fill(cols.white);
            rect(windowWidth/2, windowHeight/2, windowWidth - (1/8)-130, windowWidth - (1/8)-130, 8);
            noStroke();
            fill(30);
            textSize(17);
            text("Your total is: ", windowWidth/2, (windowHeight/2)-(windowWidth - (1/8)-130)/5);
            fill(cols.red);
            text(total, windowWidth/2, (windowHeight/2)-(windowWidth - (1/8)-130)/5 + 25);
            fill(cols.black);
            text("You got rated:", windowWidth/2, (windowHeight/2)-(windowWidth - (1/8)-300)/5 + 35)
            fill(cols.red)
            // use getDanger function to return text based score realting to total number
            text(getDanger(), windowWidth/2, (windowHeight/2)-(windowWidth - (1/8)-300)/5 + 63)
            // set background to white for restart
            bgCols = cols.white;
          }
        }
      }
    }
  
    


    

    // once you have position and are on route
    if(gotPosition == true && onRoute == true){
      // create vector position element
      var v1 = createVector(0, -(windowWidth - (1/8)-180)/2-40);
      
      // draw middle compass ellipse
      stroke(60);
      strokeWeight(2);
      fill(cols.white);
      ellipse(windowWidth/2, windowHeight/2, windowWidth - (1/8)-140);
      strokeWeight(0);
        
      //draw top arrow
      fill(cols.red)
      push();
      translate(windowWidth/2, windowHeight/2);
      beginShape();
      vertex(0, -(windowWidth - (1/8)-350)/2-40);
      vertex(-12, -(windowWidth - (1/8)-350)/2-55);
      vertex(0, -(windowWidth - (1/8)-350)/2-90);
      vertex(12, -(windowWidth - (1/8)-350)/2-55);
      endShape(CLOSE);
      pop();
      
      
      noStroke();
      // draw ellipses
      translate(windowWidth/2, windowHeight/2);

      // rotate all ellipses based on compass heading from phone
      rotate(-(compassHeading * PI/180));
      for(let i = 0; i < polyAmount; i++){
        push();
        // move the ellipses around the compass based on where zones are
        rotate(bearing[i] * PI/180);
        // fill with colour of polygon danger level
        fill(nowCol[i]);
        // draw ellipses using circle size
        ellipse(v1.x, v1.y, circleSize[i]);
        pop();
      }
    }
    // while gotPos is loading hide map
    else if(gotPosition == false){
      fill(240);
      rect(0,0,10000000,10000000);
    }
  }
}


// if mouse is pressed
function mousePressed() {
  // if mouse clicked is on the button
  if((mouseX < windowWidth - 40 && mouseX > windowWidth - 160) && (mouseY < windowHeight - 30 && mouseY > windowHeight - 70)){
    // call getCompassAccess to request access of the compass heading on iphone
    getCompassAccess();
    
    // if not on a route when pressed and is either first or second route 
    if(onRoute == false && routes != 1)
    {
      // set route to one and change route
      routes = 1;
      word = 'End';
      // set boolean to route = true
      onRoute = true;
      // for all arrays
      for(var i = 0; i < polyAmount; i++){
        // reset all values to restart the project
        entered[i] = false;
        hasLeft[i] = false;
        pointDistance[i] = 0;
      }
    }
    // if on route when pressed
    else if(onRoute == true){
      // set boolean route to false
      onRoute = false;
      word = 'Restart';
      // set route to 2 
      routes = 2;
    }
  }
}



function getCompassAccess(){
   // gets access of deviceorientation for iphone IOS 13+ devices
   if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission()
      .then(permissionState => {
        // if user allows access
        if (permissionState === 'granted') {
          // listen for any changes
          window.addEventListener('deviceorientation', (e) => {
            // set compassHeading var to the compassheading of phone
            compassHeading = e.webkitCompassHeading;
            // set boolean to true
            gotBearing = true;
          });
        }
      })
      // error catch and log
      .catch(console.error);
    } else {
      // handle regular non iOS 13+ devices
      window.addEventListener('deviceorientation', (e) => {
      compassHeading = e.webkitCompassHeading;
      gotBearing = true;
    });
  }
}

// function to relate score to danger text
function getDanger(){
  if(total <= 1000){
    return 'Safety Sally';
  }
  else if(total <= 3000 && total > 1000){
    return 'Not bad, Not great';
  }
  else if(total <= 10000 && total > 3000){
    return 'Crazy score!';
  }
  else if(total <= 20000 && total > 10000){
    return 'Thrill Seeker score!';
  }
    else if(total > 20000){
    return 'MANIAC score!';
  }
}
