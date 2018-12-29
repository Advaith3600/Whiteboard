// A helper function to select dom elements
const $ = (s) => (a = document.querySelectorAll(s), a.length > 1 ? a : a[0]);

const cvs = $('canvas');
const ctx = cvs.getContext('2d');

// setting width and height of the canvas
const width = 3000;
const height = 3000;

cvs.width = width;
cvs.height = height;

// creating socket connection
const socket = io('http://localhost:3000');
socket.on('track', data => {
	console.log(data);
	track.push(data.map(u => (u.pen = new pens[u.penName](u.pen.size, u.pen.color), u)));
});
socket.on('undo', () => {
	track.pop();
});

// list of all the available pen
let pens = {
	'Pencil': Pencil,
	'Line': Line,
	'Square': Square
};

// current pen
let pen = new pens.Pencil();

// track of all the drawing in the screen
let track = [];
// tracking the currently drawing art
let currentTrack = [];

// mouse location
let mouseX = null, mouseY = null;
let mouseAvailable = false;

// registering event listeners
cvs.addEventListener('mousedown', handleMouseDown);
cvs.addEventListener('mousemove', handleMouseMove);
cvs.addEventListener('mouseup', handleMouseUp);
cvs.addEventListener('mouseover', () => mouseAvailable = true);
cvs.addEventListener('mouseout', () => mouseAvailable = false);

function handleMouseDown(e) {
	ctx.beginPath();

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
		pen.add(currentTrack);
	}
}

function handleMouseUp(e) {
	currentTrack.pop();
	currentTrack.push({
		x: mouseX,
		y: mouseY,
		pen
	});

	let key = currentTrack[0].pen.constructor.name;

	socket.emit('track', currentTrack.map(u => (u.penName = key, u)));
	pen = new pens[pen.constructor.name](pen.size, pen.color);

	track.push(currentTrack);
	currentTrack = [];
	ctx.closePath();
}

// function which draws everything into the canvas
function draw() {
	ctx.clearRect(0, 0, cvs.width, cvs.height);
	pen.mouse();

	// drawing all the elements
	track.forEach(i => i[0].pen.display(i));

	// drawing the currentling drawing element
	if (currentTrack.length > 0)
		currentTrack[0].pen.display(currentTrack);

	requestAnimationFrame(draw);
}

draw();

// handling changing drawing tools
$('.drawing_tool').forEach(element => {
	element.addEventListener('click', function (event) {
		// if the selected drawing tool is not already been selected
		if (element.className.split(/\s+/).indexOf("selected") === -1) {
			let tool = element.dataset.tool;

			if (pens[tool]) {
				pen = new pens[tool]();
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
		if (element.className.split(/\s+/).indexOf("selected") === -1) {
			pen.color = element.dataset.color;
			$('.color_options .color.selected').classList.remove('selected');
			element.classList.add('selected');
		}
	});
});

// handling size change
$('.pen_size_slider .slider').addEventListener('input', function (event) {
	pen.size = event.target.value;
});

// handling undo event
$('.undo_option').addEventListener('click', function (event) {
	track.pop();
	socket.emit('undo');
});