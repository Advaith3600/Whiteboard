class Line extends Behaviour {
	draw(x, y) {
		ctx.lineWidth = this.size;
		ctx.lineTo(x, y);
		ctx.stroke();
	}
	
	parse(array) {
		return [
			array[0], array[array.length - 1]
		];
	}

	add(stack) {
		stack.push({
			x: mouseX,
			y: mouseY,
			pen: this
		});

		if (stack.length > 2)
			stack.splice(1, 1);
	}
}