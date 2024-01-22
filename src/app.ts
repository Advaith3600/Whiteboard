import './style.css'

import { $ } from './utils';
import Pencil from './pens/Pencil';
import Line from './pens/Line';
import Square from './pens/Square';
import Circle from './pens/Circle';

import io from 'socket.io-client';

const cvs = $('canvas');
const ctx = cvs.getContext('2d');

// setting width and height of the canvas
const width = 3000;
const height = 3000;

cvs.width = width;
cvs.height = height;

// creating socket connection
const socket = io('http://localhost:5173');
socket.on('track', data => track.push(data.map(u => (u.pen = new pens[u.penName](u.pen.size, u.pen.color), u))));
socket.on('undo', () => track.pop());

// list of all the available pen
let pens = { Pencil, Line, Square, Circle };

// current pen
let pen = new pens.Pencil();

// track of all the drawing in the screen
let track = [];
let trackLength = 0; // keep the track of track's length
// tracking the currently drawing art
let currentTrack = [];
let currentPen: keyof typeof pens = 'Pencil';

// mouse location
let mouseX = null, mouseY = null;
let mouseAvailable = false;

// registering canvas event listeners
cvs.addEventListener('mousedown', handleMouseDown);
cvs.addEventListener('mousemove', handleMouseMove);
cvs.addEventListener('mouseup', handleMouseUp);
cvs.addEventListener('mouseover', () => mouseAvailable = true);
cvs.addEventListener('mouseout', () => mouseAvailable = false);

function handleMouseDown(e) {
	currentTrack.push({
		x: mouseX,
		y: mouseY,
		pen
	});

	pen.state = true;
}

function handleMouseMove(e) {
	mouseX = e.pageX - cvs.offsetLeft;
	mouseY = e.pageY - cvs.offsetTop;

	if (pen.state) {
		pen.add(currentTrack, mouseX, mouseY);
	}
}

function handleMouseUp(e) {
	currentTrack.pop();
	currentTrack.push({
		x: mouseX,
		y: mouseY,
		pen
	});

	socket.emit('track', currentTrack.map(u => (u.penName = currentPen, u)));
	pen = new pen.constructor(pen.size, pen.color);

	track.push(currentTrack);
	currentTrack = [];
}

// function which draws everything into the canvas
function draw() {
	pen.mouse(mouseAvailable, mouseX, mouseY);

	// redrawing everything if there is a change
	if (track.length != trackLength || currentTrack.length > 0) {
		ctx.clearRect(0, 0, cvs.width, cvs.height);

		// drawing all the elements
		track.forEach(i => i[0].pen.display(i, ctx));

		// drawing the currentling drawing element
		if (currentTrack.length > 0)
			currentTrack[0].pen.display(currentTrack, ctx);

		trackLength = track.length;
	}

	requestAnimationFrame(draw);
}

draw();

// handling changing drawing tools
$('.drawing_tool').forEach(element => {
	element.addEventListener('click', function (event) {
		// if the selected drawing tool is not already been selected
		if (element.className.split(/\s+/).indexOf("selected") === -1) {
			let tool = element.dataset.tool;

			if (tool in pens) {
				currentPen = tool;
				pen = new pens[tool](pen.size, pen.color);
				$('.drawing_tool.selected').classList.remove('selected');
				element.classList.add('selected');
			}
		}
	});
});

// handling color change
$('.color_options .color').forEach(element => {
	element.addEventListener('click', function (event) {
		// if the selected color is not already been selected
		if (element.className.indexOf("selected") === -1) {
			pen.color = element.dataset.color;
			$('.color_options .color.selected').classList.remove('selected');
			element.classList.add('selected');
		}
	});
});

// handling size change
$('.pen_size_slider .slider').addEventListener('input', function ({ target }) {
	pen.size = target.value;
});

// handling undo event
$('.undo_option').addEventListener('click', function (event) {
	track.pop();
	socket.emit('undo');
});

window.addEventListener('load', () => {
	document.body.style.display = 'block';
});
