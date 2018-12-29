class Behaviour {
	constructor(size = 6, color = '#000') {
		this.size = size;
		this.color = color;
		this.state = false;
	}

	mouse() {
		if (mouseAvailable) {
			let pointer = $('.mouse_pointer');

			pointer.style.top = mouseY + 'px';
			pointer.style.left = mouseX + 'px';
			pointer.style.width = this.size + 'px';
			pointer.style.height = this.size + 'px';
			pointer.style.background = this.color;
		}
	}
}