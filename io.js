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
	m: 1500,
	function () {
		this.x = 
	}
};

var route = {
	segments: [],
	day: 0,
	level: 0,
	seed: 0,
	generate: function (seed = Date.now(), difficulty = 0) {
		var day = Math.floor(Date.now()/8.64e7); // days since Jan 1st, 1970
		// Save level with local storage?
		route.seed = day * 1000 + difficulty;
		return route.seed;
	}
};

var time = {
	start: 0,
	last: 0,
	now: 0,
	route: 0,
	interval: function () {
		if (!this.start) {
			this.start = Date.now();
			return 0;
		}
		this.last = this.now;
		this.now = Date.now();
		return (this.now - this.last) / 1000;
	}
}

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

		context.fillStyle = "white";
		context.textAlign = "left";
		context.font = "20px sans-serif";
		context.fillText("San Possidonio", 20, screenH - 60);
		context.fillText(route.seed, 20, screenH - 40);
		context.fillText(inputs.throttle, 20, screenH - 20);
	}
}

route.generate();
inputs.init();
setInterval(graphics.draw, 1000/30);