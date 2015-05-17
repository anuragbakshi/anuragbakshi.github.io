window.main = ->
	jQueryCanvas = $ "#main-canvas"
	canvas = jQueryCanvas[0]

	# Create a new WebGL context for the canvas.
	gl = createGLContext canvas;

	# Create the vertex and fragment shaders.
	fragmentShader = getShaderFromFile gl, "shaders/fragment.fs"
	vertexShader = getShaderFromFile gl, "shaders/vertex.vs"

	# Create a shader program using the shaders.
	shaderProgram = createShaderProgram gl, fragmentShader, vertexShader

	# Tell the GL context to use the shader program.
	gl.useProgram shaderProgram

	# Create the model view and projection matrices.
	matrices = createMatrices canvas, 45, 0.1, 100
	modelViewMatrix = matrices.modelView
	projectionMatrix = matrices.projection

	# Get the location of the matrices in GPU memory.
	modelViewMatrixLocation = gl.getUniformLocation shaderProgram, "u_modelViewMatrix"
	projectionMatrixLocation = gl.getUniformLocation shaderProgram, "u_projectionMatrix"

	# Save the matrices in GPU memory.
	gl.uniformMatrix4fv projectionMatrixLocation, false, projectionMatrix
	gl.uniformMatrix4fv modelViewMatrixLocation, false, modelViewMatrix

	# Load the model from the obj file.
	model = ObjLoader.loadModelFromFile "models/M9.obj"

	# Create buffers for the vertices.
	buffers = ObjLoader.createBuffersFromModel gl, model
	vertexPositionBuffer = buffers.position
	vertexIndexBuffer = buffers.index

	# Get the location of the buffers in GPU memory
	gl.bindBuffer gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer
	gl.drawElements gl.TRIANGLES, vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0

window.createGLContext = (canvas) ->
	gl = canvas.getContext("webgl") or canvas.getContext("experimental-webgl")
	if not gl? then alert "Could not initialize WebGL."

	gl

window.createShaderProgram = (gl, fragmentShader, vertexShader) ->
	shaderProgram = gl.createProgram()

	gl.attachShader shaderProgram, vertexShader
	gl.attachShader shaderProgram, fragmentShader
	gl.linkProgram shaderProgram

	if not gl.getProgramParameter shaderProgram, gl.LINK_STATUS
		alert "Could not initialize shaders."
		null

	shaderProgram

window.createMatrices = (canvas, fov, zNear, zFar) ->
	modelViewMatrix = mat4.create()
	projectionMatrix = mat4.create()

	mat4.perspective projectionMatrix, fov, canvas.width / canvas.height, zNear, zFar
	mat4.identity modelViewMatrix

	modelView: modelViewMatrix
	projection: projectionMatrix

# Util methods
window.getShaderFromFile = (gl, path) ->
	location = window.location.pathname
	directory = location.substring(0, location.lastIndexOf "/")
	url = "#{directory}/#{path}"

	source = null
	$.ajax
		type: 'GET'
		url: url
		success: (response) ->
			source = response
		async: false

	extension = path.substring(path.lastIndexOf(".") + 1)
	shader = gl.createShader do ->
		switch extension
			when "fs" then gl.FRAGMENT_SHADER
			when "vs" then gl.VERTEX_SHADER
			else null

	gl.shaderSource shader, source
	gl.compileShader shader

	if not gl.getShaderParameter shader, gl.COMPILE_STATUS
		alert "An error occurred compiling the shaders: #{gl.getShaderInfoLog shader}"
		null

	shader

$(document).ready main