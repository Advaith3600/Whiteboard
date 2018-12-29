class Square extends Behaviour {
	add(stack) {
		stack.push({
			x: mouseX,
			y: mouseY,
			pen: this
		});

		if (stack.length > 2)
			stack.splice(1, 1);
	}

	display(stack) {
		if (stack.length == 2) {
			ctx.lineWidth = stack[0].size;
			ctx.strokeStyle = stack[0].color;

			let width = stack[1].x - stack[0].x;
			let height = stack[1].y - stack[0].y;

			ctx.strokeRect(stack[0].x, stack[0].y, width, height);
		}
	}
}