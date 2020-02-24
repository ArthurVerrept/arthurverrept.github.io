var x = 0;
var y = 0;
var bg = [230];
var cols = {
  white: [242, 242, 242],
  black: [10, 10, 10],
  red: [218, 3, 21],
  orange: [242, 116, 5],
  yellow: [252, 203, 20],
  green: [143, 180, 85]
}

var lightCols = {
  white: [247, 247, 247],
  black: [50, 50, 50],
  red: [255, 50, 65],
  orange: [255, 160, 62],
  yellow: [245, 230, 50],
  green: [160, 217, 102]
}

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
var startRoute = false;
var endRoute = false;
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

//set up global variables
var userMarker;
var userCoords;
var mapLoaded;
var center = [];
var userPoint;
var mousePoint
var poly = [];
var points = 0;
var compassHeading = 0;
var userPixel;
var pointDistance=[];


// Lets put all our map options in a single object
const options = {
  lat: 50.37841452717053,
  lng: -4.128819446563721,
  zoom: 14,
  style: "https://{s}.tile.osm.org/{z}/{x}/{y}.png",
  dragging: false,
  doubleClickZoom: false
}

function preload(){
  for(let i = 0; i < polyAmount; i++){
    poly[i] = loadJSON('data/poly'+ i +'.geo.json');
  }
}

// p5.js setup
function setup(){
  imgA = loadImage('assets/abnormap.png');
  imgP = loadImage('assets/pointer.png');
  imgI = loadImage('assets/intro.png'); 
  // Create a canvas 640x640
  canvas = createCanvas(windowWidth,windowHeight);
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas, onMapLoad);  
  
  
  if(navigator.geolocation){
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
  gotPosition = true;
   console.log('success');  
   console.log(e.coords.latitude);
   console.log(e.coords.longitude);
  
  userPoint = turf.point([e.coords.longitude, e.coords.latitude]);
  userPixel = myMap.latLngToPixel(e.coords.latitude,e.coords.longitude);
  //ellipse(userPixel.x, userPixel.y, 20);
  
  //if map has not loaded, jump back out of function
  if (!mapLoaded) return;
}


function onMapLoad(){ 
  //when map is loaded set mapLoaded to true
  mapLoaded = true;
  //makes a marker at location

  //adds those latlongpoly to map as a polygon
  for(let i = 0; i < polyAmount; i++){
    polygon[i] = L.geoJSON(poly[i]).addTo(myMap.map);
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
    center[i] = turf.centerOfMass(poly[i]);
    entered[i] = false;
    hasLeft[i] = false;
    pointDistance[i] = 0;
  }
}


function draw() {
  var numIn;
  noStroke();
  if(mapLoaded == true){
    //if(mouseIsPressed){
    clear();
    for(let i = 0; i < polyAmount; i++){
      myMap.map.removeLayer(polygon[i])
    }
    //console.log(mouseX, mouseY);
    var Position = [];
    // Store the current latitude and longitude of the mouse position
    position = myMap.pixelToLatLng(mouseX, mouseY);
    //mousePoint = turf.point(Position);
    var bearing = [];
    var inChecker = [];
    var distanceFromCenter = [];
    var circleSize = [];

    if(userPoint != undefined){    
      for(let i = 0; i < polyAmount; i++){
        bearing[i] = turf.bearing(userPoint, center[i]);
        //console.log('b'+[i]+' : '+ bearing[i])
         inChecker[i] = turf.pointsWithinPolygon(userPoint, poly[i]);
              var options = {units: 'meters'};
        distanceFromCenter[i] = turf.distance(userPoint, center[i], options);

        if(distanceFromCenter[i] > 900 || entered[i] == true)
        {
          circleSize[i] = 0;
        }
        else{
          circleSize[i] = map(distanceFromCenter[i], 50, 900, 40, 5)
        }
      
        
        
      fill(bgCol);
      rect(0,0,1000000, 100000)
      imageMode(CENTER);
      image(imgA, windowWidth/2, imgA.height/18, imgA.width/16, imgA.height/16);
      image(imgP, windowWidth - imgP.width/47, imgA.height/18, imgP.width/40, imgP.height/40);
      strokeWeight(1.5)
      stroke(60);
      fill(cols.white);
      rect(windowWidth-80,windowHeight-50,75,30, 4.5);
      fill(20);
      noStroke();
      textAlign(CENTER);
      textFont('georgia', 14)
        //saddasdasd
      text(word,windowWidth-80,windowHeight-50);
      if(numIn != undefined){
        textAlign(RIGHT)
        fill(20);
        text(poly[numIn].features[0].name, (windowWidth - imgP.width/25), imgA.height/18);
        textAlign(LEFT)
        textSize(13);
        text('Distance in \ncurrent zone:', 20, windowHeight-49);
        textSize(20);
        text(Math.round(pointDistance[numIn]) + " m", 105, windowHeight-50);
      }

        
      //if you click start.
      if(onRoute == true && routes == 1){
        if(inChecker[i].features.length == 1 && hasLeft[i] == false){
          circleSize[i] = 0;
            if(entered[i] == false){
              entryPoint = turf.point([userPoint.geometry.coordinates[0],userPoint.geometry.coordinates[1]]);
            }
          entered[i] = true;
          
          
          if(poly[i].features[0].danger == 1){
            pointDistance[i] = turf.distance(entryPoint, userPoint, options)
            bgCol = cols.green;
            lightBgCol = lightCols.green;
            
          }
          
          else if(poly[i].features[0].danger == 2){
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
          numIn = i;
        }
        else if(inChecker[i].features.length == 0 && entered[i] == true){
          hasLeft[i] = true;
          bgCol = cols.white;
        }
      }
      else{
        if(routes == 0){
          
      image(imgI, windowWidth/2, windowHeight/2-20, imgI.width/3, imgI.height/3);
          
        }
        else{
          var tempTotal = pointDistance.reduce((a, b) => a + b, 0);
          total = Math.round(tempTotal);
          if(total == undefined){
            total = 0;
          }
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
          text(getDanger(), windowWidth/2, (windowHeight/2)-(windowWidth - (1/8)-300)/5 + 63)
        }
      }
    }
  }
    
    


    

    
    if(gotPosition == true && onRoute == true){
      var v1 = createVector(0, -(windowWidth - (1/8)-180)/2-40);
      
      stroke(60);
      strokeWeight(2);
      fill(cols.white);
      ellipse(windowWidth/2, windowHeight/2, windowWidth - (1/8)-140);
      strokeWeight(0);
        
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
      translate(windowWidth/2, windowHeight/2);
      rotate(-(compassHeading * PI/180));
      for(let i = 0; i < polyAmount; i++){
        push();
        rotate(bearing[i] * PI/180);
        fill(nowCol[i]);
        ellipse(v1.x, v1.y, circleSize[i]);
        pop();
      }
    }
    else if(gotPosition == false){
      fill(240);
      rect(0,0,10000000,10000000);
    }
  }
}



function mousePressed() {
  if((mouseX < windowWidth - 40 && mouseX > windowWidth - 160) && (mouseY < windowHeight - 30 && mouseY > windowHeight - 70)){
    getCompassAccess();
    if(onRoute == false && routes != 1)
    {
      routes = 1;
      word = 'End';
      onRoute = true;
      //routes = 1;
      for(var i = 0; i < polyAmount; i++){
        entered[i] = false;
        hasLeft[i] = false;
        pointDistance[i] = 0;
      }
    }
    else if(onRoute == true){
      onRoute = false;
      word = 'Restart';
      routes = 2;
    }
  }
}



function getCompassAccess(){
    // feature detect
   if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          window.addEventListener('deviceorientation', (e) => {
              compassHeading = e.webkitCompassHeading;
              gotBearing = true;

          });
        }
      })
      .catch(console.error);
    } else {
      // handle regular non iOS 13+ devices
      window.addEventListener('deviceorientation', (e) => {
      compassHeading = e.webkitCompassHeading;
      gotBearing = true;
    });
  }
}

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
