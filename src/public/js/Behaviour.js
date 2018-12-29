class Behaviour {
	constructor() {
		this.state = false;
	}

	mouse() {
		if (mouseAvailable) {
			let pointer = $('.mouse_pointer');

			pointer.style.top = mouseY + 'px';
			pointer.style.left = mouseX + 'px';
			pointer.style.width = size + 'px';
			pointer.style.height = size + 'px';
			pointer.style.background = color;
		}
	}
}