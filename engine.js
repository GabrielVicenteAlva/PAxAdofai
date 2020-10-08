function startGame() {
	gameArea.start();
}

var gameArea = {
    canvas : null,
    framerate: 30,
    start : function() {
        this.canvas.width = 750;
        this.canvas.height = 550;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]); // What
        this.interval = setInterval(updateGameArea, 1000/this.framerate);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

class Obj {
	static OBJS = [];
	constructor(){
		this.x = 0.;
		this.y = 0.;
		this.rot = 0.;
		this.color = '#000';
		this.hostile = false;
		Obj.OBJS.push(this);
	}
	destroy(){
		let ind = Obj.OBJS.indexOf(this);
		Obj.OBJS.splice(ind,1);
	}
	collision(x,y) {
		return false;
	}
	draw() {}
	customFrame() {}
	frame() {
		this.customFrame();
		this.draw();
	}
}

class Rect extends Obj {
	constructor(width,height) {
		super();
		this.width = width;
		this.height = height;
	}
	draw() {
		let ctx = gameArea.context;
		ctx.save();
        ctx.fillStyle = this.color;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.fillRect(-this.width/2,-this.height/2, this.width, this.height);
        ctx.restore()
	}
	collision(x,y){
		x -= this.x;
		y -= this.y;
		let sin = Math.sin(this.rot);
		let cos = Math.cos(this.rot);
		let dx = x*cos + y*sin;
		let dy = -x*sin + y*cos;
		return Math.abs(dx)<(this.width/2+10) && Math.abs(dy)<(this.height/2+10); // Added planets' radii
	}
}

class Circ extends Obj {
	constructor(radius) {
		super();
		this.radius = radius;
	}
	draw() {
		let ctx = gameArea.context;
		ctx.beginPath();
        ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, false);
		ctx.fillStyle = this.color;
		ctx.fill();
	}
	collision(x,y){
		x -= this.x;
		y -= this.y;
		return Math.sqrt(x*x+y*y)<this.radius+10;
	}
}

// Easings
const Easing = {
	line : t=>t,
	inSine : t=>(1 - Math.cos(x*Math.PI/2)),
	outSine : t=>Math.sin(t*Math.PI/2)
};

function customUpdate() {};

function updateGameArea() {
    gameArea.clear();
	customUpdate();
	for(obj of Obj.OBJS) {
		obj.frame();
	}
}
