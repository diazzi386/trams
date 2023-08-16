const dt = 1/60;
var canvas = document.getElementById("screen");
var context = canvas.getContext("2d");

var inputs = {
	throttle: false,
	init: function () {      
		document.body.addEventListener('pointerdown', function (event) {
			event.preventDefault();
			if (event.repeat == true)
				return;
			inputs.throttle = true;
		}, false);      
		document.body.addEventListener('pointerup', function (event) {
			inputs.throttle = false;
		}, false);
	}
};

var tram = {
	x: 0,
	v_x: 0,
	a_x: 0,
	a_r: 0,
	move: function () {
		if (inputs.throttle)
			this.a_x = 100 * Math.exp(-1 * this.v_x / 250);
		else
			this.a_x = -20 * Math.exp(this.v_x / 500);
		this.v_x += this.a_x * dt;
		this.x += Math.max(0, this.v_x) * dt;
	}
};

var route = {
	segments: [],
	stations: [],
	names: [],
	times: [],
	day: 0,
	level: 0,
	seed: 0,
	generate: function (seed = Date.now(), difficulty = 0) {
		var day = Math.floor(Date.now()/8.64e7); // days since Jan 1st, 1970
		// Save level with local storage?
		route.seed = day * 1000 + difficulty;
		route.segments = [
			[400, 0],
			[200, 30],
			[200, 0],
			[200, 0],
			[200, 60],
			[400, 0]
		];
		route.stations = [0, 500, 1600];
		route.names = ["Mirandola", "San Felice", "Camposanto"];
		route.times = [0, 600, 600];
		return route.seed;
	}, distance: function (segments = route.segments) {
		var d = 0;
		for (var i in segments) {
			d += this.segments[i][0];
		}
		return d;
	}
};

var time = {
	start: 0,
	last: 0,
	now: 0,
	route: 0
};

var segment = {
	interpret: function () {

	}, generate: function () {

	}
};

var names = {
	generate: function () {
		return "San Possidonio";
	}
}

var graphics = {
	draw: function () {
		canvas.width = screenW = window.innerWidth;
		canvas.height = screenH = window.innerHeight;
		context.clearRect(0, 0, screenW, screenH);
		
		// Background
		context.fillStyle = "rgb(130, 180, 80)";
		context.fillRect(0, 0, screenW, screenH);

		context.strokeStyle = "rgb(250, 200, 150)";
		context.lineWidth = 10;

		var y = tram.x;
		for (var i in route.segments) {
			context.beginPath();
			context.moveTo(screenW/2, y);
			y = y + route.segments[i][0];
			context.lineTo(screenW/2, y);
			context.stroke();
		};

		context.fillStyle = "white";
		context.textAlign = "left";
		context.font = "20px sans-serif";

		for (var i in route.stations) {
			context.fillText(route.names[i], screenW/2 + 20, screenH - route.stations[i] - 20 + tram.x);
		};

		context.fillText(tram.a_x.toFixed(1), 20, screenH - 100);
		context.fillText((tram.v_x/3.6).toFixed(1), 20, screenH - 80);
		context.fillText(tram.x.toFixed(1), 20, screenH - 60);
		context.fillText(route.seed, 20, screenH - 40);
		context.fillText(inputs.throttle, 20, screenH - 20);
	}
}

route.generate();
inputs.init();
setInterval(function () {
	tram.move();
	graphics.draw();
}, 1000*dt);