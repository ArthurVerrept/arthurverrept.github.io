var x = 0;
var y = 0;
var bg = [230];
var whi = [255, 255, 255];
var cols = {
  black: [0, 0, 0],
  red: [255, 0, 0],
  orange: [255, 100, 0],
  yellow: [255, 255, 0],
  green: [0, 200, 0]
}
var polygon = []
var nowCol = [];
var entered = [];
const polyAmount = 12
var entryPoint;
var hasLeft = [];
var total;
var routes = 0;
var startRoute = false;
var endRoute = false;
var gotPosition = false;
var gotBearing = false;

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
  style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
}

function preload(){
  for(let i = 0; i < polyAmount; i++){
    poly[i] = loadJSON('data/poly'+ i +'.geo.json');
  }
}

// p5.js setup
function setup(){
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
  
  //if usermarker is not undefined
  if(!userMarker){
    //set usermarker varibale as the marker itself
  userMarker = L.circleMarker([e.coords.latitude, e.coords.longitude]).addTo(myMap.map);
  }
  //sles  move latLng of marker for every new position
  else{
    userMarker.setLatLng([e.coords.latitude, e.coords.longitude]);
  }
  userLatLng = userMarker.getLatLng();
}


function onMapLoad(){ 
  //when map is loaded set mapLoaded to true
  mapLoaded = true;
  //makes a marker at location

  //adds those latlongpoly to map as a polygon
  for(let i = 0; i < polyAmount; i++){
    polygon[i] = L.geoJSON(poly[i]).addTo(myMap.map);
    if(poly[i].features[0].danger == 5){
      polygon[i].setStyle({
      color: '#ff0000'
      });
      nowCol[i] = cols.red;
    }
    if(poly[i].features[0].danger == 3){
      polygon[i].setStyle({
      color: '#ffa500'
      });
      nowCol[i] = cols.orange;
    }
    if(poly[i].features[0].danger == 2){
      polygon[i].setStyle({
      color: '#ffff00'
      });
      nowCol[i] = cols.yellow;
    }
    if(poly[i].features[0].danger == 1){
      polygon[i].setStyle({
      color: '#00b300'
      });
      nowCol[i] = cols.green;
    }
    center[i] = turf.centerOfMass(poly[i]);
    entered[i] = false;
    hasLeft[i] = false;
    pointDistance[i] = 0;
  }
}


function draw() {
  if(mapLoaded == true){
    //if(mouseIsPressed){
    clear();
    for(let i = 0; i < polyAmount; i++){
      myMap.map.addLayer(polygon[i])
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
      if(startRoute == true && routes == 1){
        if(distanceFromCenter[i] > 900 || entered[i] == true)
        {
          circleSize[i] = 0;
        }
        else{
          circleSize[i] = map(distanceFromCenter[i], 50, 900, 20, 1)
        }


        if(inChecker[i].features.length == 1 && hasLeft[i] == false){
          circleSize[i] = 0;
            if(entered[i] == false){
              console.log(userPoint.geometry.coordinates[0])
              entryPoint = turf.point([userPoint.geometry.coordinates[0],userPoint.geometry.coordinates[1]]);
            }
          entered[i] = true;
          
          
          if(poly[i].features[0].danger == 1){
            pointDistance[i] = turf.distance(entryPoint, userPoint, options)
          }
          
          else if(poly[i].features[0].danger == 2){
            pointDistance[i] = turf.distance(entryPoint, userPoint, options) * 2
          }

          else if(poly[i].features[0].danger == 3){
            pointDistance[i] = turf.distance(entryPoint, userPoint, options) * 3
          }
          
          else if(poly[i].features[0].danger == 5){
            pointDistance[i] = turf.distance(entryPoint, userPoint, options) * 5
          }
          
        }
        else if(inChecker[i].features.length == 0 && entered[i] == true){
          hasLeft[i] = true;
          total = pointDistance.reduce((a, b) => a + b, 0);
        }
       print(pointDistance);
      }
        
        else{
          for(let i = 0; i < polyAmount; i++){
            myMap.map.removeLayer(polygon[i])
          }
          fill(255);
          rect(0,0,1000000, 100000)
          fill(0);
          textSize(10);
          text("your total is: " + total, windowWidth/3, 20);
        }
      }
  }  
    
    if(gotPosition == true){
      noStroke();
      var v1 = createVector(0, -50);

      fill(230);
      ellipse(windowWidth/2, windowHeight/2, 50);

      fill(255);
      ellipse(windowWidth/2, windowHeight/2, 40);

      push();
      translate(windowWidth/2, windowHeight/2);
      rotate(compassHeading * PI/180);
      beginShape();
      vertex(0, -40);
      vertex(-12, -55);
      vertex(0, -90);
      vertex(12, -55);
      endShape(CLOSE);
      pop();

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
  }
}


function mousePressed() {
  if(routes == 0)
  {
    startRoute = true;
    routes = 1;
    for(var i = 0; i < polyAmount; i++){
      entered[i] = false;
      hasLeft[i] = false;
      pointDistance[i] = 0;
    }
  }
  else if(routes == 1){
    endRoute = true;
    routes = 0;
  }
}


