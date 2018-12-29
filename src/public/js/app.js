// A helper function to select dom elements
const $ = (s) => (a = document.querySelectorAll(s), a.length > 1 ? a : a[0]);

const cvs = $('canvas');
const ctx = cvs.getContext('2d');

// setting width and height of the canvas
const width = 800;
const height = 600;

cvs.width = width;
cvs.height = height;

// creating socket connection
const socket = io('http://localhost:3000');
socket.on('track', (data) => {
	track.push(data.map(u => (u.pen = pens[u.penName], u)));
});

// list of all the available pen
let pens = {
	'Pencil': new Pencil(),
	'Line': new Line(),
	'Square': new Square()
};

// current pen
let pen = pens.Pencil;

// current color
let color = '#000';

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
		color, pen
	});

	pen.state = true;
}

function handleMouseMove(e) {
	mouseX = e.x - cvs.offsetLeft;
	mouseY = e.y - cvs.offsetTop;

	if (pen.state) {
		pen.add(currentTrack);
	}
}

function handleMouseUp(e) {
	pen.state = false;
	currentTrack.pop();
	currentTrack.push({
		x: mouseX,
		y: mouseY,
		pen
	});

	let key = currentTrack[0].pen.constructor.name;

	socket.emit('track', currentTrack.map(u => (u.penName = key, u)));

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
				pen = pens[tool];
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
			color = element.dataset.color;
			$('.color_options .color.selected').classList.remove('selected');
			element.classList.add('selected');
		}
	});
});