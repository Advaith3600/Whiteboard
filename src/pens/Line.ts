import Behaviour from '../Behaviour';

export default class Line extends Behaviour {
	display(stack, ctx) {
		if (stack.length == 2) {
			ctx.beginPath();
			ctx.lineWidth = stack[0].pen.size;
			ctx.strokeStyle = stack[0].pen.color;
			ctx.moveTo(stack[0].x, stack[0].y);
			ctx.lineTo(stack[1].x, stack[1].y);
			ctx.stroke();
			ctx.closePath();
		}
	}

	add(stack, mouseX: number, mouseY: number) {
		stack.push({
			x: mouseX,
			y: mouseY,
			pen: this
		});

		if (stack.length > 2)
			stack.splice(1, 1);
	}
}
