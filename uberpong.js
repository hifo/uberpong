var canvas;
var main_loop;

var keys = {};
var Paddle_active;

var FRAME_RATE = 30;

var TOP = 1;
var BOTTOM = 2;
var RIGHT = 3;
var LEFT = 4;

var music;

var player;

var duration = 0;

var ball = {};
var numBalls = 0;

Ball.prototype = new Game_Object;
function Ball () {
    Game_Object.call (this, "sphere.png", 1,
                      100,
                      100, 0,
                      "circle");
    this.vx = 5;
    this.vy = 5;
}
Ball.prototype.update =
    function () {
    Game_Object.prototype.update.call (this);
    if(this.touching(bottomPaddle) && Paddle_active==BOTTOM){
		ball.vy =-5;
    } else if(this.touching(topPaddle) && Paddle_active==TOP){
		ball.vy = 5;
    } else if(this.touching(leftPaddle) && Paddle_active==LEFT){
		ball.vx = 5;
    } else if(this.touching(rightPaddle) && Paddle_active==RIGHT){
		ball.vx = -5;
    }
    
	if(this.y >= 480 && Paddle_active != BOTTOM){
		loss();
	} else if(this.y <= 0 && Paddle_active != TOP){
		loss();
	} else if(this.x <= 0 && Paddle_active != LEFT){
		loss();
	} else if(this.x >= 640 && Paddle_active != RIGHT){
		loss();
	}
};

function halt (stopmusic) {
    clearInterval (main_loop);
    if (stopmusic != false) {
	//music.pause ();
	//music.addEventListener ('ended', function () {
	//			}, false);
    }
}

function show_time () {
    var seconds = Math.floor (duration / FRAME_RATE);
    return sprintf ("%02d:%02d", Math.floor (seconds / 60), seconds % 60);
}

function victory () {
    game_messages.push (new Game_Msg ("You win!", "rgb(255, 255, 255)"));
}

function loss(){
	game_messages.push ( new Game_Msg ("You lose!", "rgb(255,255,255)"));
	halt(false);
}

Paddle.prototype = new Game_Object;
function Paddle (align,x,y) {
    if(align){
	Game_Object.call (this, "barrier.png", 1, x,y,0,"rect");
    } else{
	Game_Object.call (this, "vertical_barrier.png", 1, x,y,0,"rect");
    }
}
Paddle.prototype.update =
    function (){
    Game_Object.prototype.update.call(this);
};
function draw () {
    ctx = canvas.getContext ('2d');

    ctx.save ();

    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect (0, 0, canvas.width, canvas.height);

    ctx.restore ();
	
	for (a in ball) {
		ball[a].draw (ctx);
    }

    switch(Paddle_active){
    case 1:
		topPaddle.draw (ctx);
		break;
    case 2:
		bottomPaddle.draw (ctx);
		break;
    case 3:
		rightPaddle.draw (ctx);
		break;
    case 4:
		leftPaddle.draw (ctx);
		break;
    }
	
	draw_game_message (ctx, canvas);
}

function update () {
	for (a in ball) {
		ball[a].update();
    }
		
	duration++;
    $("#duration").text (show_time ());
	
	if(duration % (60 * FRAME_RATE) == 0){
		ball[numBalls] = new Ball();
		numBalls++;
	}

    draw();
}

function key_press (event) {
    keys[event.which] = true;
    keys[chr(event.which)] = true;
    switch (event.which) {
    case KEY.UP:
		Paddle_active = TOP;
		break;
    case KEY.DOWN:
		Paddle_active = BOTTOM;
		break;
    case KEY.RIGHT:
		Paddle_active = RIGHT;
		break;
    case KEY.LEFT:
		Paddle_active = LEFT;
		break;
    }
}
function key_release (event) {
    keys[event.which] = false;
    keys[chr(event.which)] = false;
    switch (event.which) {
    case KEY.SPACE:
	break;
    case KEY.ESCAPE:
	clearInterval (main_loop);
	log ("Stopped");
	break;
    case KEY.UP:
    case KEY.DOWN:
    case KEY.RIGHT:
    case KEY.LEFT:
	Paddle_active = 0;
	break;
    }
}

function init () {
    canvas = document.getElementById("canvas");

    ball[numBalls] = new Ball();
	numBalls++;
    Paddle_active = 0;
    topPaddle = new Paddle(1,0,0);
    bottomPaddle = new Paddle(1,0,canvas.height);
    leftPaddle = new Paddle(0,0, 0);
    rightPaddle = new Paddle(0,canvas.width, 0);

    $(".loglabel").click (function () { $(this).toggle (); });

    main_loop = setInterval (update, 1000.0 / FRAME_RATE);
}

$(document).ready (init);
$(document).keydown (key_press);
$(document).keyup (key_release);
