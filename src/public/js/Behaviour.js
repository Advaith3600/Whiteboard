class Behaviour {
	constructor() {
		this.state = false;
		this.size = 6;
	}

	mouse() {
		if (mouseAvailable) {
			let pointer = $('.mouse_pointer');

			pointer.style.top = mouseY + 'px';
			pointer.style.left = mouseX + 'px';
			pointer.style.width = this.size + 'px';
			pointer.style.height = this.size + 'px';
			pointer.style.background = color;
		}
	}
}