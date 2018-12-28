class Pencil extends Behaviour {
	draw(x, y) {
		ctx.lineWidth = this.size;
		ctx.lineTo(x, y);
		ctx.stroke();
	}
	
	parse(array) {
		return array;
	}

	add(stack) {
		stack.push({
			x: mouseX,
			y: mouseY,
			pen: this
		});
	}
}