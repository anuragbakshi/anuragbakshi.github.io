var canvas = $('#main-canvas')[0];
var canvasContext = canvas.getContext('2d');

var video = $('#main-video')[0];

if(!hasMediaSupport())
	alert('You don\'t have webcam support.');

// Support for most browsers
window.URL = window.URL || window.webkitURL;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

navigator.getUserMedia({video: true, audio: false}, function(mediaStream) {
	// video.attr('src', window.URL.createObjectURL(mediaStream));
	video.src = window.URL.createObjectURL(mediaStream);
});

var frameTimer;
var objectTrackerTimer;

var orangeTracker = new ObjectTracker(canvas, [0, 1, 0], .05);

var jQueryVideo = $(video);
// Set onVideoFrame to be called 60 times per second
jQueryVideo.on('play', function() {
	frameTimer = setInterval(onVideoFrame, 1000 / 60);

	canvas.width = video.videoWidth;
	canvas.height = video.videoHeight;

	objectTrackerTimer = setInterval(onObjectTrackerUpdate, 1000 / 15);
});

// Stop calling onVideoFrame when the video is paused or has ended
// jQueryVideo.on('paused', function() {
// 	clearInterval(frameTimer);
// });

// jQueryVideo.on('ended', function() {
// 	clearInterval(frameTimer);
// });

function onVideoFrame() {
	canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height);
}

function onObjectTrackerUpdate() {
	orangeTracker.update();

	var bounds = orangeTracker.getObjectBounds();
	console.log(bounds);
	if(bounds !== null) {
		canvasContext.beginPath();
		canvasContext.lineWidth = 5;
		canvasContext.strokeStyle = 'green';
		canvasContext.rect(bounds.x, bounds.y, bounds.width, bounds.height);
		canvasContext.stroke();
	}
}

/* Media utility methods */
function hasMediaSupport() {
	return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

/* Image utility methods */
function pixel(imageData, x, y, newData) {
	// If color values are not given, just return the current color.
	var pixelIndex = (x + y * imageData.width) * 4;

	if(newData === undefined) {
		var data = [];
		arraycopy(imageData.data, pixelIndex, data, 0, 4);
		return data;
	} else
		arraycopy(newData, 0, imageData.data, pixelIndex, 4);
}

/* General utility methods */
function arraycopy(source, sourcePosition, destination, destinationPosition, length) {
	for(var i = 0; i < length; ++i)
		destination[destinationPosition + i] = source[sourcePosition + i];
}