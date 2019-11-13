// setting scroll to very top of page before load
window.onbeforeunload = () => {
  window.scrollTo(0, 0);  
}

// when burger menu button is pressed in 
function openNav() {
  // set nav background to fill the whole screen
  document.getElementById("myNav").style.height = "100%";
  // show close menu button
  document.querySelector(".burgerClosed").classList.replace('hidden', 'unHidden');
}

// when close burger menu button is pressed
function closeNav() {
  // set height to 0
  document.getElementById("myNav").style.height = "0%";
  // hide close burger menu button
  document.querySelector(".burgerClosed").classList.replace('unHidden', 'hidden');
}


// listening for scroll 
window.addEventListener('scroll', () => {
  // set scroll top variable
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  // if 10 pixels off the top 
  if(scrollTop > 10){
    // scale down the whole navbar
    document.querySelector('.navbar').style.transform = 'scale(0.9)';
    // move navbar up to close space above
    document.querySelector('.navbar').style.top = '-1vw';
  }
  else{
    // if not scale back to normal
    document.querySelector('.navbar').style.transform = 'scale(1)';
    // reset position
    document.querySelector('.navbar').style.top = '0';
  }
});


// when screen loads load 
window.addEventListener('load', (event) => {
  // select all elements with class of svg
  const svg = document.querySelectorAll('.svg');
  // looping through each element
  for (let i = 0; i < svg.length; i++) {
    // setting variable for use in maths later
    var x = 0;
    // selecting the end of each svg text to animate differently
    if (i == 22 || i == svg.length-1){
      // adding animate.css classes
      svg[i].classList.add('animated');
      svg[i].classList.add('bounceInDown');
      // this takes current position and divides by 40 to increment start time of animation
      x = i / 40;
      // converts time to string
      svg[i].style.animationDelay = x.toString()+'s';
      // setting animation duration
      svg[i].style.animationDuration = '0.5s';
      // setting fill colour
      svg[i].style.fill = '#65433D';
    }
    else{
      // for every other letter do a pulse animation
      svg[i].classList.add('animated');
      svg[i].classList.add('pulse');
      // setting start time
      x = i / 40;
      svg[i].style.animationDelay = x.toString()+'s';
      svg[i].style.animationDuration = '0.3s';
      svg[i].style.fill = '#65433D';
    }
  }
});

var btns = document.querySelectorAll('.shopInfoTitle');



for (let i = 0; i < btns.length; i++) {
  btns[i].addEventListener('click', (idNum)=>{
    var current = document.getElementsByClassName('active');
    if(current[0].id == btns[i].id){
      current[0].className = current[0].className.replace(' active underLine', '');
    }
    else{
      for (let x = 0; x < current.length; x++) {
        if(current[x].id == btns[i].id){
          current[x].className = current[x].className.replace(' active underLine', '');
          
        }
      }
    }
    btns[i].className += ' active underLine';

   });
} 






