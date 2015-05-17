/*
	This page and all code contained within it is property of Anurag Bakshi.
*/

var viewWidth = view.size.width;
var viewHeight = view.size.height;

var minBubbleSize = 10;
var maxBubbleSize = 30;

var maxBubbleVelocity = 10;

var bubbles = [];
var indiciesToRemove = [];

for (var i = 0; i < 20; i++)
	addBubble();

function addBubble() {
	var radius = random(minBubbleSize, maxBubbleSize);
	var bubble = new Path.Circle(Point.random() * [viewWidth, viewHeight], radius);

	bubble.fillColor = randomArray(0, 1, 3);
	// bubble.fillColor = 'black';

	bubble.velocity = randomVector(0, maxBubbleVelocity);
	bubble.radius = radius;

	bubbles.push(bubble);
}

/*
	Event functions
*/
function onFrame(event) {
	bubbles.forEach(function(bubble, index) {
		if(!bubble.dead) {
			bubble.position += bubble.velocity;

			// Bounce off edges of window
			if(bubble.position.x - bubble.radius < 0 || bubble.position.x + bubble.radius > viewWidth) {
				bubble.velocity.x *= -1;
				bubble.position.x = boundTo(bubble.position.x, bubble.radius, viewWidth - bubble.radius);
			}

			if(bubble.position.y - bubble.radius < 0 || bubble.position.y > viewHeight - bubble.radius) {
				bubble.velocity.y *= -1;
				bubble.position.y = boundTo(bubble.position.y, bubble.radius, viewHeight - bubble.radius);
			}

			// TODO Improve collision algorithm, if possible. Currently O(n^2)
			bubbles.forEach(function(otherBubble, otherIndex) {
				if(index != otherIndex && !otherBubble.dead) {
					if((bubble.position - otherBubble.position).length < bubble.radius + otherBubble.radius) {
						indiciesToRemove.push(index, otherIndex);

						bubble.dead = true;
						otherBubble.dead = true;

						var newRadius = Math.sqrt(bubble.radius * bubble.radius + otherBubble.radius * otherBubble.radius);
						var combinedBubble = new Path.Circle((bubble.position + otherBubble.position) / 2, newRadius);
						combinedBubble.fillColor = (bubble.fillColor + otherBubble.fillColor) / 2;

						combinedBubble.radius = newRadius;
						combinedBubble.velocity = (bubble.velocity * square(bubble.radius) + otherBubble.velocity * square(otherBubble.radius)) / square(newRadius);

						bubbles.push(combinedBubble);
					}
				}
			});
		}
	});

	bubbles = bubbles.filter(function(elem, pos) {
		return bubbles.indexOf(elem) == pos;
	});

	indiciesToRemove.forEach(function(i) {
		while(!bubbles[i].remove())
			bubbles.splice(i, 1);
	});

	indiciesToRemove.length = 0;
}

function onMouseDown(event) {
	addBubble();
}

/*
	Utility functions
*/
function random(min, max) {
	return Math.random() * (max - min) + min;
}

function randomVector(minLength, maxLength) {
	var vector = new Point();

	vector.angle = random(0, 360);
	vector.length = random(minLength, maxLength);

	return vector;
}

function randomArray(min, max, length) {
	var a = [];
	for(var i = 0; i < length; ++i)
		a[i] = random(min, max);

	return a;
}

function square(num) {
	return num * num;
}

function boundTo(num, min, max) {
	return Math.max(Math.min(num, max), min);
}