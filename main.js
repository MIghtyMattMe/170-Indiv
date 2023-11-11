title = "MinorMiner";

description = `
[Click]

and Dig
`;

characters = [
	`
	 yyy 
	yyyyy
	 LLL
	rrrrr
	rbbbr
	 bbb
	`,
	`
	YYY
	YYY
	YYY
	`,
	`
	LLL
	LLL
	LLL
	`,
	`  
	 GGG 
	GgggG
	GgggG
	GgggG
	 GGG
	`,
	`  
	  P 
	 PpP
	PpppP
	PpppP
	 PPP
	`,
	`  
	  R
	 RrR
	  R
	`
];

const G = {
	WIDTH: 60,
	HEIGHT: 90
};

options = {
	theme: "dark",
	viewSize: {x: G.WIDTH, y: G.HEIGHT},
};

//types:

/**
* @typedef {{
* pos: Vector,
* }} Player
*/
/**
* @type { Player }
*/
let player;

/**
* @typedef {{
* sprite: string,
* pos: Vector,
* }} block
*/
/**
* @type { block [] }
*/
let digSite;

/**
* @typedef {{
* sprite: string,
* pos: Vector,
* }} gem
*/
/**
* @type { gem [] }
*/
let treasures;

/**
* @typedef {{
* str: string,
* pos: Vector,
* }} marker
*/
/**
* @type { marker [] }
*/
let depthMarkers;

var dir = 1;
var scoreDrop = 1;

function update() {
	if (!ticks) {
		player = {
			pos: vec(G.WIDTH * 0.5, 26)
		};
		let x = 0;
		let y = 30;
		let spr = "b";
		digSite = times(9000, () => {
			x += 3;
			if (x == 63) {
				x = 3;
				y += 3;
				if (y % 50 == 0) {
					if (spr == "b") spr = "c"; else spr = "b";
				}
			}
			return {sprite: spr, pos: vec((x - 3) % 60, y)};
		});
		y = 30;
		let sprs = ["d", "e", "f"];
		treasures = times(30, () => {
			x = rndi(10, 50);
			y = rndi(80, 1300) 
			return {sprite: sprs[rndi(0, 3)], pos: vec(x, y)};
		});
		score = 500;
		x = 5;
		y = 0;
		depthMarkers = times(20, () => {
			y += 100
			return {str: y + "ft", pos: vec(x, y)};
		});
	}

	if (ticks % 5 == 0) {
		if ((player.pos.x >= G.WIDTH - 8) || (player.pos.x <= 5)) {
			dir *= -1;
		}
		player.pos.x += dir;
		score -= scoreDrop;
		if (score <= 0) {
			score = 0;
			end();
		}
	}
	if (ticks % 1800 == 0) {
		scoreDrop++;
	}
	color("white");
	rect(player.pos.x - 3, player.pos.y - 4, 7, 7);
	color("black");
	char("a", player.pos);
	let temp = digSite.length;
	remove(digSite, (blok) => {
		var playerCollide = false
		if (input.isPressed && ticks % 5 == 0) {
			blok.pos.y -= 3;
		}
		if ((blok.pos.y <= G.HEIGHT + 6) && (blok.pos.y > -6)) {
			playerCollide = char(blok.sprite, blok.pos).isColliding.rect.white;
		}
		//if (playerCollide) {play("hit");}
		if (blok.pos.y < -6) {
			playerCollide = true;
		}
		return (playerCollide);
	})
	if (digSite.length < temp && ticks % 10 == 0) {
		play("hit");
	}
	remove(treasures, (gems) => {
		var playerCollide = false
		if (input.isPressed && ticks % 5 == 0) {
			gems.pos.y -= 3;
		}
		if ((gems.pos.y <= G.HEIGHT + 6) && (gems.pos.y > -6)) {
			playerCollide = char(gems.sprite, gems.pos).isColliding.rect.white;
		}
		if (playerCollide) {
			play("coin");
			score += 50;
		}
		if (gems.pos.y < -6) {
			playerCollide = true;
		}
		return (playerCollide);
	})
	char("a", player.pos);

	depthMarkers.forEach(element => {
		if (input.isPressed && ticks % 5 == 0) {
			element.pos.y -= 3;
		}
		text(element.str, element.pos);
	});
}
