var canvas;
var main_loop;

var keys = {};
var wall_active;

var TOP = 1;
var BOTTOM = 2;
var RIGHT = 3;
var LEFT = 4;

var music;

var player;

var directions = {-5,5};

var ball;
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
    if(this.touching(bottomWall) && wall_active==BOTTOM){
		ball.vy =-5;
    } else if(this.touching(topWall) && wall_active==TOP){
		ball.vy = 5;
    } else if(this.touching(leftWall) && wall_active==LEFT){
		ball.vx = 5;
    } else if(this.touching(rightWall) && wall_active==RIGHT){
		ball.vx = -5;
    }
    
	if(this.touching(bottomWall) && wall_active != BOTTOM){
		loss();
	} else if(this.touching(topWall) && wall_active != TOP){
		loss();
	} else if(this.touching(leftWall) && wall_active != LEFT){
		loss();
	} else if(this.touching(rightWall) && wall_active != RIGHT){
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

Wall.prototype = new Game_Object;
function Wall (align,x,y) {
    if(align){
	Game_Object.call (this, "barrier.png", 1, x,y,0,"rect");
    } else{
	Game_Object.call (this, "vertical_barrier.png", 1, x,y,0,"rect");
    }
}
Wall.prototype.update =
    function (){
    Game_Object.prototype.update.call(this);
};
function draw () {
    ctx = canvas.getContext ('2d');

    ctx.save ();

    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect (0, 0, canvas.width, canvas.height);

    ctx.restore ();

    ball.draw (ctx);
    switch(wall_active){
    case 1:
	topWall.draw (ctx);
	break;
    case 2:
	bottomWall.draw (ctx);
	break;
    case 3:
	rightWall.draw (ctx);
	break;
    case 4:
	leftWall.draw (ctx);
	break;
    }
	
	draw_game_message (ctx, canvas);
}

function update () {
    ball.update();
	
//	$("#duration").text (show_time ());

    draw();
}

function key_press (event) {
    keys[event.which] = true;
    keys[chr(event.which)] = true;
    switch (event.which) {
    case KEY.UP:
	wall_active = TOP;
	break;
    case KEY.DOWN:
	wall_active = BOTTOM;
	break;
    case KEY.RIGHT:
	wall_active = RIGHT;
	break;
    case KEY.LEFT:
	wall_active = LEFT;
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
	wall_active = 0;
	break;
    }
}

function init () {
    canvas = document.getElementById("canvas");

    ball = new Ball();
    wall_active = 0;
    topWall = new Wall(1,0,0);
    bottomWall = new Wall(1,0,canvas.height);
    leftWall = new Wall(0,0, 0);
    rightWall = new Wall(0,canvas.width, 0);

    $(".loglabel").click (function () { $(this).toggle (); });

    main_loop = setInterval (update, 1000.0 / FRAME_RATE);
}

$(document).ready (init);
$(document).keydown (key_press);
$(document).keyup (key_release);
