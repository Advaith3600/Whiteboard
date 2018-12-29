class Pencil extends Behaviour {
	display(stack) {
		if (stack.length > 1) {
			ctx.beginPath();
			
			for (let i = 1; i < stack.length; i++) {
				ctx.strokeStyle = stack[0].color;
				ctx.lineWidth = stack[0].size;
				ctx.moveTo(stack[i - 1].x, stack[i - 1].y);
				ctx.lineTo(stack[i].x, stack[i].y);
				ctx.stroke();
			}

			ctx.closePath();
		}
	}

	add(stack) {
		stack.push({
			x: mouseX,
			y: mouseY,
			pen: this
		});
	}
}