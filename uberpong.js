var canvas;
var main_loop;

var keys = {};
var wall_active;

var player;

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
    if(this.touching(bottomWall)){
	ball.vy =-5;
    } else if(this.touching(topWall)){
	ball.vy *= 5;
    } else if(this.touching(leftWall)){
	ball.vx *= -5;
    } else if(this.touching(rightWall)){
	ball.vx *= 5;
    }
    	
};

Wall.prototype = new Game_Object;
function Wall (align,x,y) {
    if(align){
	Game_Object.call (this, "barrier.png", 1, x,y,0,"rectangle");
    } else{
	Game_Object.call (this, "vertical_barrier.png", 1, x,y,0,"rectangle");
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
}

function update () {
    ball.update();

    draw();
}

function key_press (event) {
    keys[event.which] = true;
    keys[chr(event.which)] = true;
    switch (event.which) {
    case KEY.UP:
	wall_active = 1;
	break;
    case KEY.DOWN:
	wall_active = 2;
	break;
    case KEY.RIGHT:
	wall_active = 3;
	break;
    case KEY.LEFT:
	wall_active = 4;
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
