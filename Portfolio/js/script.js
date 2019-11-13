/* When page is loaded check window width for each breakpoint load a different amount of images */
/* When instagram is over contact section less images is loaded to shorten scroll amount */
/* New instagram limit is only loaded when page is loaded/re-loaded not when changed */
if (window.innerWidth < 992) {
  var instaLimit = 6;
}
/* As screen size gets thinner less images are shown */
if (window.innerWidth < 768 && window.innerWidth > 576) {
  var instaLimit = 4;
}
/* As screen size gets thinner less images are shown */
if (window.innerWidth < 576) {
  var instaLimit = 2;
}
/* If screen size is over 991 show full amount of images */
else if (console.log > 991){
  instaLimit = 15;
}

/* Instafeed section  */
var feed = new Instafeed({
  /* My info */
  get: 'user',
  userId: '303571919',
  accessToken: '303571919.1d02b8d.e35a0e70474c4902ad54cd6957560729',
  /* Setting resolution to highest setting in instafeed */
  resolution: 'standard_resolution',
  /* Setting limit to variable found above */
  limit: instaLimit,
  /* Setting instagram image to open in new tab when clicked and adding classes where needed */
  /* Adding font-awesome like icon */
  template: '<a target="_blank" class="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-6 p-1 mt-2 instaCrop" href="{{link}}"><img class="instaImage" src="{{image}}"/><p class="likes"><i class="far fa-heart mr-1" style="font-size:10px;"></i>{{likes}}</p></a>'
});
/* Running instafeed */
feed.run();




  /* When page content is loaded */
  document.addEventListener('DOMContentLoaded', function(){
    /* Create animation using anime.js svg morphing */
    var animation = anime({
      /* Starts with HTML class element st0 polygon and moves through SVG anchor locations below */
    targets: '.st0',
    points: [
      { value: ['105,110 0,110 0,0 42.78,0 105,0 ']},
      { value: ['210,110 105,110 105,0 147.78,0 210,0 ']},
    ],
    /* Simple sign wave easing used */
    easing: 'easeInOutSine',
    /* Animation lasts 2 secons */
    duration: 2000,
    /* plays only once */
    loop: false
  });
  /* Using promise to only load logo when animation is finished calling displayLogo function */
  animation.finished.then(displayLogo);
});



/* Function to show logo and add animate.css to fade logo in */
function displayLogo(){
  document.querySelector("#logo").style.visibility = "visible";
  document.querySelector("#logo").classList.add('animated', 'fadeIn');
}

//add an event listener that looks for scroll event
window.addEventListener('scroll', function(e) {
  console.log(window.innerWidth);
  //load all id names of sections/divs into array
  var locA = ['landing', 'skills', 'portfolio', 'about'];
  //create another empty array to be filled
  var loc = [];
  //loop through all items in locA
  for (var i = 0; i < locA.length; i++) {
    //create div and set it to get element of current count
    var div = document.getElementById(locA[i]);
    //set temp to get properties of top, bottom, width, etc
    var temp = div.getBoundingClientRect();
    //add a new item in array with all that data to be called below when needed
    loc.push(temp);
  }
  //if landing.top (the top of the landing element) is greater than -2
  //i.e between 0 & -2 do the following
  if (loc[0].top > -2) {
    //set navbar background to transparent, logo to blue and set home nav-link to transparent background
    document.querySelector(".myNav").style.backgroundColor = "transparent";
    //document.querySelectorAll(".nav-link")[0].style.backgroundColor = "transparent";
    document.querySelector(".nav-link").style.backgroundColor = "transparent";
  }
  //once landing.top moves past -2
  if (loc[0].top < -2) {
    //clears all navbar-link backgrounds
    for (var i = 0; i < 5; i++) {
      document.querySelectorAll(".nav-link")[i].style.backgroundColor = "transparent";
    }
    //sets navbar background to blue and logo to white
    document.querySelector(".myNav").style.backgroundColor = "#0F3C87";
    //document.querySelector("#navLogo").style.mixBlendMode = "multiply";
    //sets 1st selection in querySelector to coloured background
    document.querySelectorAll(".nav-link")[0].style.backgroundColor = "#7D8D99";
  }
    //if skills.top goes under 70px from top of screen (about size of navbar)
  if (loc[1].top < 70) {
    //clears all navbar-link backgrounds
    for (var i = 0; i < 5; i++) {
      document.querySelectorAll(".nav-link")[i].style.backgroundColor = "transparent";
    }
    //sets 2nd selection in querySelector to coloured background
    document.querySelectorAll(".nav-link")[1].style.backgroundColor = "#7D8D99";
  }
  //if portfolio.top goes under 70px from top of screen (about size of navbar)
  if (loc[2].top < 70) {
    //clears all navbar-link backgrounds
    for (var i = 0; i < 5; i++) {
      document.querySelectorAll(".nav-link")[i].style.backgroundColor = "transparent";
    }
    //sets 3rd selection in querySelector to coloured background
    document.querySelectorAll(".nav-link")[2].style.backgroundColor = "#7D8D99";
  }
  //if aboutBar.top goes under 70px from top of screen (about size of navbar)
  if (loc[3].top < 70) {
    //clears all navbar-link backgrounds
    for (var i = 0; i < 5; i++) {
      document.querySelectorAll(".nav-link")[i].style.backgroundColor = "transparent";
    }
    //sets 4th selection in querySelector to coloured background
    document.querySelectorAll(".nav-link")[3].style.backgroundColor = "#7D8D99";
  }
  //if bottom of aboutBar goes under 170px from top of screen OR the screen is less than 70px from the bottom
  if (loc[3].bottom < 170 || (window.innerHeight + window.scrollY) > document.body.offsetHeight-70) {
    //clears all navbar-link backgrounds
    for (var i = 0; i < 5; i++) {
      document.querySelectorAll(".nav-link")[i].style.backgroundColor = "transparent";
    }
    //sets 4th selection in querySelector to coloured background
    document.querySelectorAll(".nav-link")[4].style.backgroundColor = "#7D8D99";
  }
});



/* Set the width of the side navigation to toggle between 2 different css sections */
function nav() {
  /* Selects sideNav class and toggles between navOpen and origional state */
  var nav = document.querySelector(".sideNav");
  nav.classList.toggle("navOpen");

  /* Selects menu class and toggles between menuO and origional state */
  var menu = document.querySelector(".menu");
  menu.classList.toggle("menuO");
}
