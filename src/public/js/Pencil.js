class Pencil extends Behaviour {
	display(stack) {
		if (stack.length > 1) {
			for (let i = 1; i < stack.length; i++) {
				ctx.beginPath();
				ctx.strokeStyle = stack[0].color;
				ctx.lineWidth = this.size;
				ctx.moveTo(stack[i - 1].x, stack[i - 1].y);
				ctx.lineTo(stack[i].x, stack[i].y);
				ctx.stroke();
				ctx.closePath();
			}
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