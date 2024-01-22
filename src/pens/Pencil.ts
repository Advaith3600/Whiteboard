import Behaviour from '../Behaviour';

export default class Pencil extends Behaviour {
	display(stack, ctx) {
		if (stack.length > 1) {
			ctx.beginPath();
			ctx.strokeStyle = stack[0].pen.color;
			ctx.lineWidth = stack[0].pen.size;
			ctx.moveTo(stack[0].x, stack[0].y);
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';
			
			for (let i = 1; i < stack.length; i++) {
				ctx.lineTo(stack[i].x, stack[i].y);
			}

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
	}
}
