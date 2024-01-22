import Behaviour from "../Behaviour";

export default class Square extends Behaviour {
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
			ctx.lineWidth = stack[0].pen.size;
			ctx.strokeStyle = stack[0].pen.color;

			let width = stack[1].x - stack[0].x;
			let height = stack[1].y - stack[0].y;

			ctx.strokeRect(stack[0].x, stack[0].y, width, height);
		}
	}
}
