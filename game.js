/*
* Global variablesand arrays.........------------............
* START
*/

// =================== VARIABLES ==========================

// Variable that stores the layer which will be dynamically created after the game starts.. to block the modification of components from user during game play.
var blockDiv;

// The dynamically cerated audio element will be stored in this variable
var neighSound;

// Boolean used to check if the game has been played for the first time after the browser is opened or not.
var firstTime = true;

// Boolean to check if the horses can run or not. Horses can run only when the loading screen finishes displaying after the start button is pressed..
var runnable = false;

// Varaible that stores how far the progress of setting horses back to position has reached.
var progress;

// Variable that stores the text which displays in intervals after the race completes.
var textView;

// Variables that store the two path blocker elements;
var blocker1, blocker2;

// Variable to store the <div id="start"> Start Race </div>.
var startButton;

// Variables to store the current amount a player has.
var currentAmountLabel, currentAmountNumber;

// Varaibles to store the bet amount a player bets.
var betAmountBox, betAmountNumber;

// Variables to store the horse a player bets.
var betHorseBox, betHorseSelected;

// Varaibles to store the number of addition laps (initial 1) a player wants the race to continue.
var additionalLapBox, additionalLapCount;
var lapDecrement;

// Boolean to check if a player can participate in a race with entered data.
var grantAccess;

// Variables that store pixel positions of different parts of the track.
var firstWayLeft, firstWayRight; // Left and right border positions of the first vertical path.
var secondWayLeft, secondWayRight; // Left and right border positions of the second vertical path.
var thirdWayLeft, thirdWayRight; // Left and right border positions of the third vertical path.
var lastWayLeft, lastWayRight; // Left and right border positions of the last vertical path.

var topWayHigh, topWayLow, bottomWayHigh, bottomWayLow; // Top and bottom border positions of horizontal path.
var runWay;
// Variable to set the interval in which the main racing function gets called.
var continueRun;

// Variable to check the continuation of race as per the lap count.
var stoppable = false;

// Variable to store one-twelveth of 10% of screen width
var trackWidth = getPixelWidth(10)/12;

// Variable to  - 1store one-twelveth of 15% of screen height
var trackHeight = getPixelHeight(15)/12;

// =============== ARRAYS ===============================

// Array to store the horses according to their rank after the race.
var result = [];

//Array to store the horses that race.
var racingHorsesArray = [];

// Array to store turning positions, 4 multiples of track(Width/Height);
var turningPointsHor = [0 * trackWidth, 1 * trackWidth, 2 * trackWidth, 3 * trackWidth];
var uniqueTurningPointsHor = [];
var turningPointsVer = [0 * trackHeight, 1 * trackHeight, 2 * trackHeight, 3 * trackHeight];
var uniqueTurningPointsVer = [];

/*
* Global variables and arrays.............-----------..........
* END
*/


// Function that returns the pixel value for supplied percentage width / view width.
function getPixelWidth(percentageWidth){
  return (percentageWidth/100) * window.innerWidth;
}

// Function that returns the pixel value for supplied percentage height / view height.
function getPixelHeight(percentageHeight){
  return (percentageHeight/100) * window.innerHeight;
}

// Function that returns a random whole number between two supplied numbers (inclusive)
function getRandomInclusive(numberLower, numberHigher){
  var commonDifference = numberHigher - numberLower;
  // var randomizedNumber = (Math.floor(Math.random() * (commonDifference + 1))) + numberLower;
  var randomizedNumber = (Math.ceil(Math.random() * (commonDifference + 1))) + (numberLower - 1);
  return randomizedNumber;
}

// Function that returns a random whole number between two supplied numbers (exclusive)
function getRandomExclusive(numberLower, numberHigher){
  var commonDifference = numberHigher - numberLower;
  var randomizedNumber = Math.ceil(Math.random() * (commonDifference - 1)) + numberLower;
  return randomizedNumber;
} // (Mozilla Developers, 2005)

// Function to set (unique + random) turningPointsArray[] values in uniqueTurningPoints[] Array
function getRandomUniqueHor(){
  for (var i = 0; i < turningPointsHor.length; i++){
    var unique = false;
    while (unique == false){
      var randomTurning = getRandomInclusive(0,3);
      var alreadySet = false;
      for (var count = 0; count < uniqueTurningPointsHor.length; count++){
        if (uniqueTurningPointsHor[count] == turningPointsHor[randomTurning]){
          alreadySet = true;
        }
      }
      if (alreadySet == false){
        uniqueTurningPointsHor.push( turningPointsHor[randomTurning]);
        unique = true;
      }
    }
  }
}

// Function to set (unique + random) turningPointsArray[] values in uniqueTurningPoints[] Array
function getRandomUniqueVer(){
  for (var i = 0; i < turningPointsVer.length; i++){
    var unique = false;
    while (unique == false){
      var randomTurning = getRandomInclusive(0,3);
      var alreadySet = false;
      for (var count = 0; count < uniqueTurningPointsVer.length; count++){
        if (uniqueTurningPointsVer[count] == turningPointsVer[randomTurning]){
          alreadySet = true;
        }
      }
      if (alreadySet == false){
        uniqueTurningPointsVer.push( turningPointsVer[randomTurning]);
        unique = true;
      }
    }
  }
}

// Calls the function intiWork() after the page has been fully loaded.
document.addEventListener('DOMContentLoaded', initWork);

/*
* Sets the variable startButton to the start race element from HTML.
* Calls the function necessaryCheck() when click event is triggered in startButton
*/
function initWork(){
  startButton = document.getElementById('start');
    startButton.addEventListener('click', necessaryCheck);
}

/*
* Sets blocker1 and blocker2 to the path blocker elements from HTML
* Assigns values of data entries to different variables
* Checks for the bet amount and lap count entries calling their respective functions
* If data entries are correct, then this function calls welcomeScreen() function
*/
function necessaryCheck(){
  blocker1 = document.getElementById('block1');
  blocker2 = document.getElementById('block2');

  currentAmountLabel = document.getElementById('funds');
  currentAmountNumber = parseFloat(currentAmountLabel.innerHTML);

  betAmountBox = document.getElementById('amount');
  betAmountNumber = parseFloat(betAmountBox.value);

  betHorseBox = document.getElementById('bethorse');
  // betHorseSelected = betHorse.options[betHorseBox.selectedIndex].text; // ==> Output ---> e.g. White
  betHorseSelected = betHorseBox.value; // ==> Output ---> e.g. horse1

  additionalLapBox = document.getElementById('noOfLaps');
  additionalLapCount = parseFloat(additionalLapBox.value);

  var amountGrantAccess = betAmountCheck();
  var lapGrantAccess = additionalLapCheck();
  grantAccess = amountGrantAccess && lapGrantAccess;

  if (grantAccess){
    // If the page has already loaded and game has been played at least once, all the resttings of variables and arrays is done here..
    if (firstTime == false){
      stoppable = false;
      uniqueTurningPointsHor.length = 0;
      uniqueTurningPointsVer.length = 0;
      result.length = 0;
      setTrack();
      setHorses();
      getRandomUniqueHor();
      getRandomUniqueVer();
    }
    welcomeScreen();
  }
}

/*
* Checks if the data entered for bet amount is valid or not.
* If invalid, error messages are written to the bet amount box..
* If valid, error free notification is returned
*/
function betAmountCheck(){
  var errorFree = false;
  betAmountBox.style.color = 'red';
  if (betAmountBox.value == ""){
    betAmountBox.value = 'Should not be null';
  }
  else if ( !(betAmountBox.value % 1 >= 0) ){
    betAmountBox.value = 'Must be a number';
  }
  else if (betAmountNumber <= 0){
    betAmountBox.value = 'Can\'t be 0 or less';
  }
  else if ( betAmountNumber > currentAmountNumber){
    betAmountBox.value = 'Not enough amount';
  }
  else{
    betAmountBox.style.color = 'green';
    errorFree = true;
  }
  return errorFree;
}

/*
* Checks if the data entered for lap count is valid or not.
* If invalid, error messages are written to the lap count box..
* If valid, error free notification is returned..
*/
function additionalLapCheck(){
  var errorFree = false;
  additionalLapBox.style.color = 'red';
  if (additionalLapBox.value == ""){
    additionalLapBox.value = 'Should not be null';
  }
  else if (additionalLapBox.value % 1 != 0){
    additionalLapBox.value = 'Must be a whole number';
  }
  else if (additionalLapCount < 0){
    additionalLapBox.value = 'Can\'t be negative number';
  }
  else{
    additionalLapBox.style.color = 'green';
    errorFree = true;
  }
  return errorFree;
}

/*
* Function used to display the loading screen to the user
* Loading screen is displayed only when the game is played for the first time i.e only once after the page is loaded..
* Different divisions and texts are created dynamically to display the loading screen
* Bet amount is reduced from players fund here..
* After all these, this function calls the runRace() function in interval of 100ms;
*/
function welcomeScreen(){
  blockDiv = document.createElement('div');
  blockDiv.style = 'width:100vw; height:100vh; position:fixed; z-index:2000; background-color:rgba(0,0,0,0.1)';
  if(firstTime){
    firstTime = false;
    var greetingDiv = document.createElement('div');
    greetingDiv.className = 'greeting';
    var textSpan = document.createElement('span');
    textSpan.className = 'titleGreet';
    var textTitle = document.createTextNode('Game is preparing your first Play');
    textSpan.appendChild(textTitle);
    var time = 0;
    var textSecond = document.createElement('span');
    textSecond.className = 'second';
    var textTitle2 = document.createTextNode('Initializing Game Components...');
    textSecond.appendChild(textTitle2);
    greetingDiv.appendChild(textSpan);
    greetingDiv.appendChild(textSecond);
    document.getElementsByTagName('body')[0].appendChild(greetingDiv);
    var intervalGreeting = setInterval(function(){
      textTitle2.parentNode.removeChild(textTitle2);
      time = time + 5;
      switch(time){
        case 50:
          textTitle2 = document.createTextNode("Clearing leftovers...");
          stoppable = false;
          uniqueTurningPointsHor.length = 0;
          uniqueTurningPointsVer.length = 0;
          result.length = 0;
          break;
        case 100:
          textTitle2 = document.createTextNode("Setting up the horses and track....");

          neighSound = document.createElement('AUDIO');
          neighSound.setAttribute("src", "sounds/once.mp3");
          neighSound.playbackRate = 0.1;
          neighSound.setAttribute("autoplay", "true");
          neighSound.loop = false;
          document.getElementsByTagName('body')[0].appendChild(neighSound);
          neighSound.load();
          // (w3schools, 1999)

          setTrack();
          setHorses();
          break;
        case 150:
          textTitle2 = document.createTextNode("Setting up randoms.....");
          break;
        case 200:
          textTitle2 = document.createTextNode("Finalizing path.....");
          getRandomUniqueHor();
          getRandomUniqueVer();
          break;
        case 250:
        currentAmountNumber = currentAmountNumber - betAmountNumber;
        currentAmountLabel.innerHTML = currentAmountNumber;
        textSecond.style.backgroundColor = 'rgba(0,0,0,0.8)';
        textSecond.style.color = 'red';
        textSecond.style.textShadow = 'none';
        textTitle2 = document.createTextNode("The bet amount is deducted from your available fund.. Your current amount is £ " + currentAmountNumber + ". If you win, double your bet amount will be added to £" + currentAmountNumber + ". Best of luck!!");
      }
      textSecond.appendChild(textTitle2);
      if (time > 600){
        neighSound.parentNode.removeChild(neighSound);
        runnable = true;
        greetingDiv.parentNode.removeChild(greetingDiv);
        clearInterval(intervalGreeting);
        document.getElementsByTagName('body')[0].appendChild(blockDiv);
        continueRun = setInterval(runRace, 100);
      }
    }, 100);
  }
  else{
    document.getElementsByTagName('body')[0].appendChild(blockDiv);
    currentAmountNumber = currentAmountNumber - betAmountNumber;
    currentAmountLabel.innerHTML = currentAmountNumber;
    continueRun = setInterval(runRace, 100);
  }

}

/*
* This function assigns all the racing horses to an array and sets the position of each horse..
*/
function setHorses(){
  for (var horseNum = 1; horseNum <= 4; horseNum++){
    racingHorsesArray[horseNum - 1] = document.getElementById('horse' + horseNum);
    racingHorsesArray[horseNum - 1].style.top = ((horseNum - 1) * ((0.15 * window.innerHeight)/4)) + runWay.offsetTop - 10  + 'px';
  }
}

/*
* This function sets the necessary offsetLeft, offsetTop, width and height calculation of track positions to different variables by calling the function turningPoints(....,....,...)
*/
function setTrack(){
  additionalLapCount = additionalLapCount * 4;
  lapDecrement = additionalLapCount;
  runWay = document.getElementsByClassName('track')[0];
  var collisionBox1 = document.getElementsByClassName('inner1')[0];
  var collisionBox2 = document.getElementsByClassName('inner2')[0];
  var collisionBox3 = document.getElementsByClassName('inner3')[0];

  turningPoints(runWay, collisionBox1, collisionBox2, collisionBox3);
}

function turningPoints(runWay, collisionBox1, collisionBox2, collisionBox3){
  firstWayLeft = runWay.offsetLeft + 16;
  firstWayRight = firstWayLeft + collisionBox1.offsetLeft;
  secondWayLeft = firstWayRight + getPixelWidth(25);
  secondWayRight = firstWayLeft + collisionBox2.offsetLeft;
  thirdWayLeft = secondWayRight + getPixelWidth(5);
  thirdWayRight = firstWayLeft + collisionBox3.offsetLeft;
  lastWayLeft = thirdWayRight + getPixelWidth(20);
  lastWayRight = firstWayLeft + getPixelWidth(90);

  topWayHigh = runWay.offsetTop + 16;
  topWayLow = topWayHigh + collisionBox1.offsetTop;
  bottomWayHigh = topWayLow + getPixelHeight(50);
  bottomWayLow = bottomWayHigh + getPixelHeight(15);

}

/*
* The actual function that sets the horses positions to random positions in forward direction periodically.
*/
function runRace(){
  for (horseNum = 1; horseNum <= 4; horseNum++){
    // If horses have to move towards the right from top of track
    if (racingHorsesArray[horseNum - 1].offsetLeft + 48 < lastWayLeft + uniqueTurningPointsHor[horseNum -1]
    && stoppable == false
    && (racingHorsesArray[horseNum - 1].className == 'horse runRight' || racingHorsesArray[horseNum - 1].className == 'horse standRight')){
      racingHorsesArray[horseNum - 1].className = 'horse runRight';
      racingHorsesArray[horseNum -1].style.left = racingHorsesArray[horseNum - 1].offsetLeft + getRandomInclusive(27,30) + 'px';
      // set the rotation of path blockers to 0 degree.. That is close the unwanted path movement
      blocker1.style.transform = 'rotateZ(0deg)';
      blocker2.style.transform = 'rotateZ(0deg)';
    }

    // If the horses have to move towards the bottom after moving right
    if (racingHorsesArray[horseNum - 1].offsetLeft + 48 >= lastWayLeft + uniqueTurningPointsHor[horseNum -1]
    && racingHorsesArray[horseNum - 1].className == 'horse runRight'){
      blocker2.style.transform = 'rotateZ(90deg)'; // Open the second path blocker because that path needs to be taken
      racingHorsesArray[horseNum - 1].className = 'horse runDown';
    }

    // Move horses downwards
    if (racingHorsesArray[horseNum - 1].offsetTop + 60 < bottomWayHigh + uniqueTurningPointsVer[horseNum -1]
    && racingHorsesArray[horseNum - 1].className == 'horse runDown'){
      racingHorsesArray[horseNum - 1].style.top = racingHorsesArray[horseNum - 1].offsetTop + getRandomInclusive(27,30) + 'px';
    }

    // If the horses have to mve towards the lefft after moving downwards
    if (racingHorsesArray[horseNum -1].offsetTop + 60 >= bottomWayHigh + uniqueTurningPointsVer[horseNum -1]
    && racingHorsesArray[horseNum - 1].className == 'horse runDown'){
      racingHorsesArray[horseNum - 1].className = 'horse runLeft';
    }

    // Move horses to the left
    if (racingHorsesArray[horseNum - 1].offsetLeft + 48 > thirdWayLeft + uniqueTurningPointsHor[horseNum -1] + 20
    && racingHorsesArray[horseNum - 1].className == 'horse runLeft'){
      racingHorsesArray[horseNum - 1].style.left = racingHorsesArray[horseNum - 1].offsetLeft - getRandomInclusive(27,30) + 'px';

    }

    // If the horses have to move upward after moving left
    if (racingHorsesArray[horseNum - 1].offsetLeft + 48 <= thirdWayLeft + uniqueTurningPointsHor[horseNum -1] + 20
    && racingHorsesArray[horseNum - 1].offsetLeft + 48 > secondWayRight
    && racingHorsesArray[horseNum - 1].className == 'horse runLeft'){
      racingHorsesArray[horseNum - 1].className = 'horse runUp';
    }

    // Move the horses upward
    if (racingHorsesArray[horseNum - 1].offsetTop + 60 > topWayLow - uniqueTurningPointsVer[horseNum - 1]
    && racingHorsesArray[horseNum - 1].className == 'horse runUp'){
      blocker1.style.transform = 'rotateZ(-90deg)'; // Open the first path blocker
      racingHorsesArray[horseNum - 1].style.top = racingHorsesArray[horseNum - 1].offsetTop - getRandomInclusive(27,30) + 'px';
    }

    // If the horses have to move towards the left after moving upward
    if (racingHorsesArray[horseNum -1].offsetTop + 60 <= topWayLow - uniqueTurningPointsVer[horseNum - 1]
    && racingHorsesArray[horseNum - 1].className == 'horse runUp'){
      racingHorsesArray[horseNum - 1].className = 'horse runLeft';
    }

    // Move horses towards left
    if (racingHorsesArray[horseNum - 1].offsetLeft + 48 > secondWayLeft + uniqueTurningPointsHor[horseNum - 1] + 20
    && racingHorsesArray[horseNum - 1].offsetLeft + 48 < secondWayRight - uniqueTurningPointsHor[horseNum - 1] + 20
    && racingHorsesArray[horseNum -1].className == 'horse runLeft'){
      racingHorsesArray[horseNum - 1].style.left = racingHorsesArray[horseNum - 1].offsetLeft - getRandomInclusive(27,30) + 'px';
    }

    // If the horses have to move downwards after moving to the left
    if (racingHorsesArray[horseNum - 1].offsetLeft + 48 <= secondWayLeft + uniqueTurningPointsHor[horseNum - 1] + 20
    && racingHorsesArray[horseNum - 1].offsetLeft + 48 > secondWayLeft - 50
    && racingHorsesArray[horseNum - 1].className == 'horse runLeft'){
      racingHorsesArray[horseNum - 1].className = 'horse runDown';
    }

    // If the horses have to move towards left after moving downwards
    if (racingHorsesArray[horseNum - 1].offsetTop + 60 >= bottomWayHigh + uniqueTurningPointsVer[horseNum - 1]
    && racingHorsesArray[horseNum - 1].className == 'horse runDown'){
      racingHorsesArray[horseNum - 1].className = 'horse runLeft';

    }

    // Move horses towards left
    if (racingHorsesArray[horseNum - 1].offsetLeft + 48 > firstWayLeft + uniqueTurningPointsHor[horseNum - 1] + 20
    && racingHorsesArray[horseNum - 1].className == 'horse runLeft'){
      racingHorsesArray[horseNum - 1].style.left = racingHorsesArray[horseNum - 1].offsetLeft - getRandomInclusive(27,30) + 'px';
    }

    // If the horses have to move up after moving left
    if (racingHorsesArray[horseNum - 1].offsetLeft + 48 <= firstWayLeft + uniqueTurningPointsHor[horseNum - 1] + 20
    && racingHorsesArray[horseNum -1].className == 'horse runLeft'){
      racingHorsesArray[horseNum -1].className = 'horse runUp';
    }

    /*
    * After completing one round,
    * If lap count is not zero, notify that the horses shouldn't stop, reset  all necessary variables and move the next round
    * If lap is 0, then notify that the horses  should stop;
    */
    if ( racingHorsesArray[horseNum - 1].offsetTop + 60 <= topWayLow - uniqueTurningPointsVer[horseNum - 1]
    && racingHorsesArray[horseNum - 1].className == 'horse runUp'){
      racingHorsesArray[horseNum - 1].className = 'horse runRight';
      if ( additionalLapCount == 0){
        stoppable = true;
      }
      else{
        additionalLapCount = additionalLapCount - 1;
        if ( additionalLapCount == lapDecrement - 4){
          document.getElementById('lapValue').innerHTML = parseInt(document.getElementById('lapValue').innerHTML) + 1;
          lapDecrement = lapDecrement - 4;
        }
        uniqueTurningPointsHor.length = 0;
        uniqueTurningPointsVer.length = 0;
        getRandomUniqueHor();
        getRandomUniqueVer();
      }
    }

    /*
    * If horses should stop, move them till they cross the finish line..
    * Assign the horses reaching the final points at first, second, third, and fouth place in an array result[];
    */
    if (stoppable == true && racingHorsesArray[horseNum - 1].className == 'horse runRight'){
      if (racingHorsesArray[horseNum -1].offsetLeft < firstWayLeft + document.getElementById('startline').offsetLeft){
        racingHorsesArray[horseNum - 1].style.left = racingHorsesArray[horseNum - 1].offsetLeft + getRandomInclusive(10,20) + 'px';
      }
      else{
        var unique = true;
        while(unique==true){
          addIt = true;
          for (count = 0; count < result.length; count++){
            if(result[count] == racingHorsesArray[horseNum - 1].id){
              addIt = false;
            }
          }
          if (addIt == true){
            result.push(racingHorsesArray[horseNum - 1].id);
            unique = false;
          }
          else{
            unique = false;
          }
        }
      }
    }

    /*
    * If the result[] array is sized 4, i.e all thhe horses reached the finishing line, clear the interval as the runRace function is no longer needed be called further
    */
    if ( result.length == 4){
      clearInterval(continueRun);
      winnerDeclaration(); // Calls the function to declare the winner
      break;
    }

  }
}

/*
* Function that sets the values in result table accoriding to the horses position in result[] array
*/
function winnerDeclaration(){
  var top = document.getElementsByTagName('td');
  top[1].className = result[0];
  top[3].className = result[1];
  top[5].className = result[2];
  top[7].className = result[3];

  // If the bet horse is winner,reward the player with some amount..

  if(betHorseBox.value == result[0]){
    currentAmountNumber = currentAmountNumber + (betAmountNumber * 2);
    currentAmountLabel.innerHTML = currentAmountNumber;
  }

  // Set back the position of horses for next round;
  setPosition();
}

/*
* This function sets the position of horses back in their initial positions while the message is dynamically being generated..
* If player wins, congratulation message is generated else losing message is generated..
*/
function setPosition() {
  document.getElementById('lapValue').innerHTML= 1;

  progress = 0;
  textView = document.createTextNode("Setting Horses back to position... " + progress + "%");
  var settingPositionInProcess = document.createElement('div');
  settingPositionInProcess.className = 'greeting';
  var mainProcess = document.createElement('div');
  mainProcess.className = 'titleGreet';
  var body = document.getElementsByTagName('body')[0];
  mainProcess.appendChild(textView);
  settingPositionInProcess.appendChild(mainProcess);
  body.appendChild(settingPositionInProcess);
  var nextText;
  var interval = setInterval(function(){
    progress = progress + 25;
    textView.parentNode.removeChild(textView);
    if (progress < 120){
      textView = document.createTextNode("Setting Horses back to position... " + progress + "%");
    }
    else{
      if(betHorseBox.value == result[0]){
        mainProcess.style.color = 'green';
        mainProcess.style.backgroundColor = 'rgba(0,0,0,0.8)';
        textView = document.createTextNode("Congratulations!! You won!!!! ==== You got rewarded by £" + currentAmountNumber);
      }
      else{
        mainProcess.style.color = 'red';
        mainProcess.style.backgroundColor = 'rgba(0,0,0,0.8)';
        textView = document.createTextNode("Sorry!! You lose!!! <><><><><><><><> Your amount is £" + currentAmountNumber);
      }

    }

    mainProcess.appendChild(textView);

    switch(progress){
      case 25:
        racingHorsesArray[0].style.top = ( 0 * ((0.15 * window.innerHeight)/4)) + runWay.offsetTop - 10 + 'px';
        racingHorsesArray[0].style.left = firstWayLeft + document.getElementById('startline').offsetLeft - 96 + 'px';
        racingHorsesArray[0].className = 'horse standRight';
        break;
      case 50:
        racingHorsesArray[1].style.top = ( 1 * ((0.15 * window.innerHeight)/4)) + runWay.offsetTop - 10  + 'px';
        racingHorsesArray[1].style.left = firstWayLeft + document.getElementById('startline').offsetLeft - 96 + 'px';
        racingHorsesArray[1].className = 'horse standRight';
        break;
      case 75:
        racingHorsesArray[2].style.top = ( 2 * ((0.15 * window.innerHeight)/4)) + runWay.offsetTop - 10  + 'px';
        racingHorsesArray[2].style.left = firstWayLeft + document.getElementById('startline').offsetLeft - 96 + 'px';
        racingHorsesArray[2].className = 'horse standRight';
        break;
      case 100:
        racingHorsesArray[3].style.top = ( 3 * ((0.15 * window.innerHeight)/4)) + runWay.offsetTop - 10  + 'px';
        racingHorsesArray[3].style.left = firstWayLeft + document.getElementById('startline').offsetLeft - 96 + 'px';
        racingHorsesArray[3].className = 'horse standRight';
        break;
    }
    if (progress > 200){
      clearInterval(interval); // Clear the interval if no longer needed to popup the messages..
      settingPositionInProcess.parentNode.removeChild(settingPositionInProcess); // Removes unnecessary elements from the page..
      blockDiv.parentNode.removeChild(blockDiv);
    }

  }, 1000);
}
