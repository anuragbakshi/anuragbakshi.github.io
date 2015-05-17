var jQueryCanvas = $('#main-canvas');
var canvas = jQueryCanvas[0];

// Load texture
var image = new Image();
image.src = 'pewds.png';
image.onload = function() {
	render(image);
};

function render(textureImage) {
	// Setup WebGL context
	var gl = canvas.getContext('experimental-webgl');

	if (!gl)
		alert('Could not initialize WebGL.');

	// Setup GLSL program
	var vertexShader = getShaderFromFile(gl, 'shaders/solid-wireframe/vertex.vs');
	var fragmentShader = getShaderFromFile(gl, 'shaders/solid-wireframe/fragment.fs');

	var program = getProgramWithShaders(gl, vertexShader, fragmentShader);
	gl.useProgram(program);

	// Look up where the vertex data needs to go.
	var positionLocation = gl.getAttribLocation(program, 'a_position');
	var positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array([
			0, 0,
			500, 0,
			0, 500,

			0, 500,
			500, 0,
			500, 500
		]),
		gl.STATIC_DRAW
	);
	gl.enableVertexAttribArray(positionLocation);
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

	var relativePositionLocation = gl.getAttribLocation(program, 'a_relativePosition');
	var relativePositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, relativePositionBuffer);
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array([
			1, 0, 0,
			0, 1, 0,
			0, 0, 1,

			1, 0, 0,
			0, 1, 0,
			0, 0, 1
		]),
		gl.STATIC_DRAW
	);
	gl.enableVertexAttribArray(relativePositionLocation);
	gl.vertexAttribPointer(relativePositionLocation, 3, gl.FLOAT, false, 0, 0);

	// Set the resoulution.
	var resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
	gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

	// look up where the texture coordinates need to go.
	var texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');

	// provide texture coordinates for the rectangle.
	var texCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array([
			0.0,  0.0,
			1.0,  0.0,
			0.0,  1.0,
			0.0,  1.0,
			1.0,  0.0,
			1.0,  1.0]),
		gl.STATIC_DRAW
	);
	gl.enableVertexAttribArray(texCoordLocation);
	gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

	// Create a texture.
	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);

	// Set the parameters so we can render any size image.
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

	// Upload the image into the texture.
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImage);

	gl.drawArrays(gl.TRIANGLES, 0, 6);
}

/* Util methods */
  // Returns a random integer from 0 to range - 1.
function randomInt(range) {
  return Math.floor(Math.random() * range);
}

// Fills the buffer with the values that define a rectangle.
function setRectangle(gl, x1, y1, x2, y2) {
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2]), gl.STATIC_DRAW);
}

/* WebGL util methods */
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

function getProgramWithShaders(gl, vertexShader, fragmentShader) {
	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
		alert('Could not create the GLSL program.');

	return shaderProgram;
}