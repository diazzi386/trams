var canvas = document.getElementById("screen");
var context = canvas.getContext("2d");

var keyboard = {
	init: function () {      
		document.body.addEventListener('modown', function (event) {
			// event.preventDefault();
			if (event.repeat == true) return;
			keyboard.down(event.key);
		}, false);      
		document.body.addEventListener('keyup', function (event) {
			// event.preventDefault();
			if (event.repeat == true) return;
			keyboard.down(event.key);
		}, false);
	}
};

var sound = {
	context: null,
	oscillator: null,
	gain: null,
	init: function () {
		sound.context = new (window.AudioContext || window.webkitAudioContext)();        
		sound.oscillator = sound.context.createOscillator();
		sound.oscillator.type = 'sine';
		sound.gain = sound.context.createGain();
		sound.gain.gain.value = 0;
		sound.oscillator.connect(sound.gain);
		sound.gain.connect(sound.context.destination);
		sound.oscillator.start();
	}, play: function (f = 440, t = 0.5, v = 0.5) {
		if (sound.context.state === 'suspended')
			sound.context.resume();
		sound.oscillator.frequency.value = f;
		sound.gain.gain.setTargetAtTime(v, sound.context.currentTime, 0.05);
		sound.gain.gain.setTargetAtTime(0, sound.context.currentTime + t, 0.05);
	}
};

var graphics = {
	draw: function () {
		canvas.width = screenW = window.innerWidth;
		canvas.height = screenH = window.innerHeight;
		context.clearRect(0, 0, screenW, screenH);
		// Offset on player or map?
		/*
		var offsetW = Math.floor(screenW/2) - (player.x + 0.5) * tile,
			offsetH = Math.floor(screenH/2) - (player.y + 0.5) * tile;
		*/
		
		// Walls
		context.shadowBlur = 100;
		context.shadowColor = "white";
		context.fillStyle = "white";
		for (var j = 0; j < maps[map].map.length; j++) {
			for (var i = 0; i < maps[map].map[j].length; i++) {
				if (tiles.isWalkable(maps[map].map[j][i])) {
					context.fillRect(tile * i + offsetW, tile * j + offsetH, tile, tile);
				}
			}
		}

		context.shadowBlur = 25;
		context.shadowColor = "black";
		for (var i = 0; i < collectibles.length; i++) {
			context.fillStyle = collectibles[i].color;
			context.fillRect(tile * collectibles[i].x + offsetW + 3*tile/8, tile * collectibles[i].y + offsetH + 3*tile/8, tile/4, tile/4);
		}

		context.fillStyle = "crimson";
		for (var i = 0; i < enemies.enemies.length; i++) {
			context.fillRect(tile * enemies.enemies[i].x + offsetW + tile/4, tile * enemies.enemies[i].y + offsetH + tile/4, tile/2, tile/2);
		}

		context.fillStyle = "black";
		context.fillRect(tile * player.x + offsetW + tile/4, tile * player.y + offsetH + tile/4, tile/2, tile/2);

		var gradient = context.createRadialGradient(screenW/2, screenH/2, 0, screenW/2, screenH/2, 2*tile + player.torch/10*tile);
		gradient.addColorStop(0, "rgba(0,0,0,0)");
		gradient.addColorStop(1, "rgba(0,0,0,1.0)");

		context.fillStyle = gradient;
		if (!DEBUG)
			context.fillRect(0, 0, screenW, screenH);
			
		context.fillStyle = "white";
		context.textAlign = "center";
		context.font = 2/3*tile + "px 'Roboto Mono', monospace";
		context.fillText(maps[map].message || "", screenW/2, screenH - 3*tile);

		context.fillStyle = "DarkGray";
		context.font = 2/3*tile + "px 'Roboto Mono', monospace";
		context.fillText(maps[map].hint || "", screenW/2, screenH - 2*tile);
			
		context.fillStyle = "white";
		context.font = 1/2*tile + "px 'Roboto Mono', monospace";
		context.fillText(
			"MAP " + String(map + 1).padStart(2, 0)
			+ "  LIVES " + String(player.lives).padStart(2, 0)
		//	+ "  GOLD " + String(player.gold).padStart(3, 0)
			+ "  TORCH " + String(player.torch).padStart(2, 0),
			screenW/2, screenH - tile);

		if (DEBUG) {
			context.fillStyle = "red";
			context.fillRect(screenW/2 - 2, screenH/2 - 2, 4, 4);
		}
	}
}

keyboard.init();
// sound.init();
setInterval(graphics.draw, 1000/30);