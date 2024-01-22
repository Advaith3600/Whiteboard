import { $ } from './utils';

export default class Behaviour {
	constructor(size = 6, color = '#000') {
		this.size = size;
		this.color = color;
		this.state = false;
	}

	mouse(mouseAvailable: boolean, mouseX: number, mouseY: number) {
		let pointer = $('.mouse_pointer');

		if (mouseAvailable) {
			pointer.style.display = 'block';
			pointer.style.top = mouseY + 'px';
			pointer.style.left = mouseX + 'px';
			pointer.style.width = this.size + 'px';
			pointer.style.height = this.size + 'px';
			pointer.style.background = this.color;
		} else {
			pointer.style.display = 'none';
		}
	}
}
