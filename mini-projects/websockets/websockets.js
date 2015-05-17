var socket = new WebSocket('ws://localhost:9000/');

var myIdentifier;

var users = [];

tool.minDistance = 100;

/*
	Socket event functions
*/
socket.onopen = function() {
	console.log('Socket opened.');
};

socket.onmessage = function(message) {
	var dataObject = JSON.parse(message.data);

	if(dataObject.newIdentifier !== undefined) {
		console.log('New identifier: ' + dataObject.newIdentifier);
		myIdentifier = dataObject.newIdentifier;
	} else if(dataObject.identifier !== undefined) {
		if(users[dataObject.identifier] === undefined) {
			console.log('Dot created for id: ' + dataObject.identifier);

			addDot(dataObject.identifier);
		}

		users[dataObject.identifier].position = dataObject.position;
	}

	console.log('My identifier: ' + myIdentifier);
};

socket.onerror = function(error) {
};

function addDot(index) {
	var dot = new Path.Circle([0, 0], 100);
	dot.fillColor = 'black';

	users[index] = dot;
}

/*
	Paper.js event functions
*/
function onFrame(event) {
}

function onMouseDown(event) {
	console.log('Mouse down.');
	console.log('My identifier: ' + myIdentifier);
	socket.send(JSON.stringify({identifier: myIdentifier, position: event.point}));
}

function onMouseDrag(event) {
	console.log('Mouse dragged.');
	socket.send(JSON.stringify({identifier: myIdentifier, position: event.point}));
}

function onMouseUp(event) {
	console.log('Mouse up.');
	console.log('My identifier: ' + myIdentifier);
	socket.send(JSON.stringify({identifier: myIdentifier, position: [0, 0]}));
}