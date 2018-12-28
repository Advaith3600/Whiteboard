class Behaviour {
	constructor() {
		this.state = false;
		this.size = 6;
	}

	mouse() {
		if (mouseAvailable) {
			ctx.beginPath();
			ctx.arc(mouseX, mouseY, this.size, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();
		}
	}
}