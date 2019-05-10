//######### setup the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 800;
document.body.appendChild(canvas);

//######### global variables
const gravity = 9.8;
var allSprites = [];
var allCups = [];
var cupsCaught = 0;
var delta;
var score = 0;

//######### game objects

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
    console.log("background loaded successfully");
};
bgImage.src = "_images/Woodtable512by800Final3.png";

// ball image
var ballReady = false;
var ballImage = new Image();
ballImage.onload = function () {
    ballReady = true;
};
ballImage.src = "_images/pingpong_small.png";

// Cup image
var cupReady = false;
var cupImage = new Image();
cupImage.onload = function () {
    cupReady = true;
};
cupImage.src = "_images/cup_small.png";

function entity(img, w, h, x, y, speed) {
    this.img = img;
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;
    this.velX = 0;
    this.velY = 0;
    this.coFriction = 0.5;
    this.friction = function () {
        if (this.velX, this.velX > 0.5) {
            this.velX -= this.coFriction;
        }
        else if (this.velX < -0.5) {
            this.velX += this.coFriction;
        }
        else {
            this.velX = 0;
        }
    };
    this.speed = speed;

    allSprites.push(this);
}

var Cup = function (img, w, h, x, y, speed, type) {
    entity.call(this, img, w, h, x, y, speed);
    this.type = type;
    allCups.push(this);
};
var Ball = function (img, w, h, x, y, speed, type) {
    entity.call(this, img, w, h, x, y, speed);
    this.type = type;
    this.coFriction = 3;
    this.reset = function () {
        this.x = canvas.width / 2;
        this.y = canvas.height - 32;
        this.velY = 0;
        this.velX = 0;
    };
};

// Monster.prototype = Object.create(entity.prototype);

var ball = new Ball(ballImage, 32, 32, canvas.width / 2, canvas.height - 32, 4);
function cupGen() {
    var cup = new Cup(cupImage, 32, 32, 125, 100, 0, "boss");
    var cup2 = new Cup(cupImage, 32, 32, 175, 100, 0, "boss");
    var cup3 = new Cup(cupImage, 32, 32, 225, 100, 0, "boss");
    var cup4 = new Cup(cupImage, 32, 32, 275, 100, 0, "boss");
    var cup5 = new Cup(cupImage, 32, 32, 250, 150, 0, "boss");
    var cup6 = new Cup(cupImage, 32, 32, 200, 150, 0, "boss");
    var cup7 = new Cup(cupImage, 32, 32, 150, 150, 0, "boss");
    var cup8 = new Cup(cupImage, 32, 32, 225, 200, 0, "boss");
    var cup9 = new Cup(cupImage, 32, 32, 175, 200, 0, "boss");
    var cup10 = new Cup(cupImage, 32, 32, 200, 250, 0, "boss");
    console.log("Recreating the cups")
}
function reset() {
    cupGen();
}


// var pillar = new entity()

//######### functions
//// we don't have any yet
//######### input ***

//adding event listeners

var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.key] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.key];
}, false);

//get key input

var input = function (modifier) {
    // checks for user input
    if ("w" in keysDown) { // Player holding up
        ball.velY -= ball.speed;
    }
    if ("a" in keysDown) { // Player holding left
        ball.velX -= ball.speed;
    }
    // if ("s" in keysDown) { // Player holding down
    // 	ball.velY += ball.speed;
    // }
    if ("d" in keysDown) { // Player holding right
        ball.velX += ball.speed;
    }
};

//######### updates ***
function update() {
    if (cupsCaught >= 10) {
        cupsCaught = 0;
        cupGen();
    }

    for (var sprite in allSprites) {
        allSprites[sprite].x += allSprites[sprite].velX;
        allSprites[sprite].y += allSprites[sprite].velY;
        allSprites[sprite].friction();
    }
    //check to see if ball hits cup...
    for (cup in allCups) {
        if (
            ball.x <= allCups[cup].x + allCups[cup].w &&
            allCups[cup].x <= (ball.x + ball.w) &&
            ball.y <= allCups[cup].y + allCups[cup].w &&
            allCups[cup].y <= (ball.y + ball.w)
        ) {
            console.log("it worked!!!");
            ball.reset();
            allCups.splice(cup, 1);
            cupsCaught++;
        }
    }
    // check to see if ball off screen
    if (ball.x < 0) {
        ball.x = 0;
    }
    if (ball.x > canvas.width - 32) {
        ball.x = canvas.width - 32;
    }
    if (ball.y < 0) {
        ball.reset();
    }

}

//######### render
function render() {
    //render background first
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
        // console.log("background drawn successfully")
    }
    // then ball on top of background
    for (var cup in allCups) {
        if (cupReady) {
            ctx.drawImage(allCups[cup].img, allCups[cup].x, allCups[cup].y);
        }
    }
    if (ballReady) {
        ctx.drawImage(ballImage, ball.x, ball.y);
    }
}

//######### main function and run once functions
var main = function () {
    now = Date.now();
    delta = now - then;
    input(delta / 1000);
    update(delta / 1000);
    render(delta / 1000);
    then = now;
    // Request to do this again ASAP
    requestAnimationFrame(main);
};

{
    // Score
    ctx.fillStyle = "rgb(100, 100, 100)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Score: " + cupsCaught, 32, 32);
    // frames
    ctx.fillStyle = "rgb(100, 100, 100)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Delta: " + delta / 1000, 256, 32);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
// ball.reset();
main();
reset();