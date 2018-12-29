class Line extends Behaviour {
	display(stack) {
		if (stack.length == 2) {
			ctx.beginPath();
			ctx.lineWidth = this.size;
			ctx.strokeStyle = stack[0].color;
			ctx.moveTo(stack[0].x, stack[0].y);
			ctx.lineTo(stack[1].x, stack[1].y);
			ctx.stroke();
			ctx.closePath();
		}
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