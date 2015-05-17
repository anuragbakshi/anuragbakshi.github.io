var jQueryCanvas = $('#main-canvas');
var canvas = jQueryCanvas[0];

$(document).ready(startWebGL);

var gl;
var shaderProgram;

var positionBuffer;
var textureBuffer;

function startWebGL() {
	initGL(canvas);
	initShaders();
	initBuffers();

	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	renderScene();
}

function initGL(canvas) {
	try {
		gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
	} catch(e) {}

	if (!gl)
		alert('Could not initialize WebGL.');
}

function initShaders() {
	var fragmentShader = getShaderFromFile(gl, 'shaders/fragment.fs');
	var vertexShader = getShaderFromFile(gl, 'shaders/vertex.vs');

	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
		alert('Could not initialize shaders');

	gl.useProgram(shaderProgram);

	shaderProgram.positionLocation = gl.getAttribLocation(shaderProgram, 'a_position');
	gl.enableVertexAttribArray(shaderProgram.positionLocation);

	shaderProgram.resolutionLocation = gl.getUniformLocation(shaderProgram, 'u_resolution');
	gl.uniform2f(shaderProgram.resolutionLocation, canvas.width, canvas.height);

	shaderProgram.textureLocation = gl.getAttribLocation(shaderProgram, 'a_texCoord');
	gl.enableVertexAttribArray(shaderProgram.textureLocation);
}

function initBuffers() {
	// Position buffer
	positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		// 1st triangle
		-1.0, -1.0,
		1.0, -1.0,
		-1.0, 1.0,

		// 2nd triangle
		-1.0, 1.0,
		1.0, -1.0,
		1.0, 1.0
	]), gl.STATIC_DRAW);

	// Texture buffer BUG: Not creating new buffer? Both buffers binding to same one
	textureBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		0.0,  0.0,
		1.0,  0.0,
		0.0,  1.0,
		0.0,  1.0,
		1.0,  0.0,
		1.0,  1.0
	]), gl.STATIC_DRAW);

	console.log(positionBuffer);
	console.log(textureBuffer);
}

function renderScene() {
	gl.enableVertexAttribArray(shaderProgram.positionLocation);
	gl.vertexAttribPointer(shaderProgram.positionLocation, 2, gl.FLOAT, false, 0, 0);

	gl.enableVertexAttribArray(shaderProgram.textureLocation);
	gl.vertexAttribPointer(shaderProgram.textureLocation, 2, gl.FLOAT, false, 0, 0);

	gl.drawArrays(gl.TRIANGLES, 0, 6);
}

/* Util methods */
function getShaderFromFile(gl, path) {
	var location = window.location.pathname;
	var directory = location.substring(0, location.lastIndexOf('/'));
	var url = directory + '/' + path;

	var source;
	$.ajax({
		type: 'GET',
		url: url,
		success: function(response) {
			source = response;
		},
		async: false
	});

	var shader;

	var extension = path.substring(path.lastIndexOf('.') + 1);
	if (extension === 'fs')
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	else if (extension === 'vs')
		shader = gl.createShader(gl.VERTEX_SHADER);
	else
		return null;

	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}