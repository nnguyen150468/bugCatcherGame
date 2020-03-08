let canvas;
let ctx;

const HERO_WIDTH = 32, HERO_HEIGHT = 32;
const MONSTER_WIDTH = 32, MONSTER_HEIGTH = 32;

canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 450;

let bgReady, heroReady, monsterReady, bugReady;
let bgImage, heroImage, monsterImage, bugImage;

let gameOverImage, gameOverImageReady;

let bugEscapeImage, bugEscapeImageReady;

let bugEscapeX, bugEscapeY;

let bugList = [];

let bugNumber = 0;

let startTime = Date.now();
const SECONDS_PER_ROUND = 30;
let elapsedTime = 0;

let gameOver = false;

let resultArea = document.getElementById("resultArea");
let timeArea = document.getElementById("timeArea");
let recordArea = document.getElementById("recordArea");
let record=[];
let nameArea = document.getElementById("nameArea");

let startButton = document.getElementById("startButton");
let stopCurrentPlayerButton = document.getElementById("stopCurrentPlayerButton");


let nameInput = document.getElementById("userName");
let nameEntered = false;


startButton.disabled=true;
let userName;

let gameNumber = 0;

let gameTurn =0;

let scorePerSecond;

let localData;

let bestScore;

let bestScoreArea = document.getElementById("bestScore");

let scoreArray =[];

let bestScoreIndex;

function start(){
    userName = nameInput.value;
    if(userName.length==0){
        alert('Please enter your name before playing');
    } else {
        nameEntered = true;
        reset();
        stopCurrentPlayerButton.disabled=false;
    }
}

function stopCurrentPlayer(){
    nameInput.value=null;
    stopCurrentPlayerButton.disabled=true;
    startButton.disabled=true;
}

function changePlayer(){
    userName = nameInput.value;
    if(userName.length==0){
        alert('Please enter your name');
    } else {
    startButton.disabled=false;
    gameTurn = 0;
    nameArea.innerHTML=userName;
    }
    
}

function recording(){
    entry = {
        player: userName,
        score: score,
        time: elapsedTime,
        scorePerSecond: score/elapsedTime
};
    record.push(entry);
    scoreArray.push(score);
    //test localStorage
  
}

function showRecord(){
    localStorage.setItem('record', JSON.stringify(record));
    localData=JSON.parse(localStorage.getItem('record'));
    let para = document.createElement("div");
    para.innerHTML=`Player: ${userName} <br> Game ${gameTurn+1} <br> 
    Scores:${record[gameNumber]['score']}
    <br>Time:${record[gameNumber]['time']}
    <br>Scores per Second: ${record[gameNumber].scorePerSecond}`;
    recordArea.appendChild(para);
    gameNumber++;
}

function unhideRecord(){
    let x = document.getElementById("recordArea");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function loadImages() {
    for(bugNumber; bugNumber<20; bugNumber++){
        let bugImage = new Image();
    bugImage.onload = function(){
        bugReady = false;
    }
    bugImage.src = 'images/bug.svg';

    bugList.push({
        bugImage:bugImage,
        bugX:monsterX,
        bugY:monsterY,
        bugReady:false
    })
    }

    gameOverImage = new Image();
    gameOverImage.onload = function(){
        gameOverImageReady = false;
    }
    gameOverImage.src = 'images/gameOver.png'

    bugEscapeImage = new Image();
    bugEscapeImage.onload = function(){
        bugEscapeImageReady = false;
    }
    bugEscapeImage.src = 'images/hole.jpg'

    bgImage = new Image();
    bgImage.onload = function (){
        bgReady = true;
    };
    bgImage.src='images/grass.jpg';

    heroImage = new Image();
    heroImage.onload = function (){
        heroReady = true;
    };
    heroImage.src='images/hero1.png';

    monsterImage = new Image();
    monsterImage.onload = function(){
        monsterReady = true;
    };
    monsterImage.src='images/monster.png';
}


let heroX = canvas.width/2;
let heroY = canvas.height/2;

let monsterX = 100;
let monsterY = 100;

let speedX = 5;
let speedY = 5;

//DEFINE TEST POSITION

let score = 0;

let keysDown = {};

function youLose(){
    gameOver=true;
    gameOverImageReady = true;    
    recording();
    showRecord();
    findBestScore();
    gameTurn++;
}

function reset(){
    gameOver=false;
    heroX=canvas.width/2;
    heroY=canvas.height/2;
    monsterX= 100;
    monsterY=100;
    bugList=[];
    bugNumber=0;
    for(bugNumber; bugNumber<20; bugNumber++){
        let bugImage = new Image();
    bugImage.onload = function(){
        bugReady = false;
    }
    bugImage.src = 'images/bug.svg';

    bugList.push({
        bugImage:bugImage,
        bugX:monsterX,
        bugY:monsterY,
        bugReady:false
    })
    }
    score=0;
    gameOverImageReady=false;
    timeElapsed=0;
    startTime=Date.now();
}

function setupKeyboardListeners() {
    addEventListener("keydown", function (key) {
        keysDown[key.keyCode] = true;
    }, false);
    
    addEventListener("keyup", function (key) {
        delete keysDown[key.keyCode];
    }, false);
}

function showMessages(){
    resultArea.innerHTML=`Scores: ${score}`;
    timeArea.innerHTML=`Time elapsed: ${elapsedTime}`;
}

let update = function(){
    if(gameOver){
        return;
    }
    if(nameEntered){
        elapsedTime = Math.floor((Date.now() - startTime) / 1000);
// if elapsedTime==10s, make new bug. startTime = Date.now()
    const i = parseInt(elapsedTime/10)

    //make bug bounce
    for(let j=0; j<bugList.length; j++){
        if(j <= i){
            bugList[j].bugReady = true
            bugList[j].bugX += speedX
            bugList[j].bugY += speedY

            if(bugList[j].bugX > canvas.width - 32 -3 || bugList[j].bugX < 3){
                speedX = -speedX;
            }
        
            if(bugList[j].bugY > canvas.height - 32  -3|| bugList[j].bugY < 3){
                speedY = -speedY;
            };
            if (
                heroX <= (bugList[j].bugX + 32)
                && bugList[j].bugX <= (heroX + 32)
                && heroY <= (bugList[j].bugY + 32)
                && bugList[j].bugY <= (heroY + 32)
            ){
                youLose();
            };     
        }
    }

    if (38 in keysDown) {
        heroY -= 5;
    }
    if (40 in keysDown) {
        heroY += 5;
    }
    if (37 in keysDown) {
        heroX -=5;
    }
    if (39 in keysDown) {
        heroX +=5;
    }


//make sure hero doesn't go outside of the screen
    if(heroX > canvas.width - HERO_WIDTH){
        heroX = canvas.width - HERO_WIDTH;
    }
    if(heroX < 0){
        heroX = 0;
    }
    if(heroY > canvas.height -32) {
        heroY = canvas.height - 32;
    }
    if(heroY < 0){
        heroY = 0;
    };
//make bug bounce



//check if hero and monster collide
    if (
        heroX <= (monsterX + 32)
        && monsterX <= (heroX + 32)
        && heroY <= (monsterY + 32)
        && monsterY <= (heroY + 32)
    ){
        bugEscapeImageReady=true;
        bugEscapeX = monsterX;
        bugEscapeY = monsterY;

        monsterX = Math.floor(Math.random()*(canvas.width - 32 -3 ));
       
        monsterY = Math.floor(Math.random()*(canvas.height-32 -3));

        score++;
    };
    }
    
    //if hero and bug collide. youLose()
    showMessages();
}

function findBestScore(){
    bestScore=Math.max(...scoreArray);
    bestScoreIndex = scoreArray.indexOf(bestScore);
    bestScoreArea.innerHTML=`Best score: ${bestScore}`;

    bestScoreArea.innerHTML=`Best score: ${bestScore} <br>
    by ${localData[bestScoreIndex]['player']}`;
}
 
function render(){
    if(bgReady){
        ctx.drawImage(bgImage, 0, 0, 512, 480);
    }
    if(heroReady){
        ctx.drawImage(heroImage, heroX, heroY, 40, 40);
    }
    if(monsterReady){
        ctx.drawImage(monsterImage, monsterX, monsterY, 40, 40);
    }
    const i = parseInt(elapsedTime/10)
    for (let j = 0; j < bugList.length; j++ ){
        if(bugList[j].bugReady){
            ctx.drawImage(bugList[j].bugImage, bugList[j].bugX, bugList[j].bugY,50,50);
        }
    }
    if (gameOverImageReady){
        ctx.drawImage(gameOverImage, 18, canvas.height/10, 470, 370);
        }           
    if (bugEscapeImageReady){
        ctx.drawImage(bugEscapeImage, bugEscapeX, bugEscapeY, 32, 32);
        bugEscapeImageReady=false;
        }   
}

function main(){
    console.log('main function');
    update();
    render();
    requestAnimationFrame(main);
};

let w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

loadImages();
setupKeyboardListeners();
main();