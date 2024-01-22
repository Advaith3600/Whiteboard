import Behaviour from "../Behaviour";

export default class Circle extends Behaviour {
	add(stack, mouseX: number, mouseY: number) {
		stack.push({
			x: mouseX,
			y: mouseY,
			pen: this
		});

		if (stack.length > 2)
			stack.splice(1, 1);
	}

	display(stack, ctx) {
		if (stack.length == 2) {
			ctx.beginPath();
			ctx.lineWidth = stack[0].pen.size;
			ctx.strokeStyle = stack[0].pen.color;

			let r1 = (stack[1].x - stack[0].x);
			let r2 = (stack[1].y - stack[0].y);

			ctx.ellipse(stack[0].x + (r1 / 2), 
				stack[0].y + (r2 / 2), 
				Math.abs(r1 / 2), 
				Math.abs(r2 / 2), 0, 0, 2 * Math.PI);
			ctx.stroke();
		}
	}
}
