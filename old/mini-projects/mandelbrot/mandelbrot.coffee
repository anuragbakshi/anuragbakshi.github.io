window.main = ->
	window.needsUpdate = no
	window.dragInProcess = no

	window.windowSize = [$(window).width(), $(window).height()]

	$canvas = $ "#main-canvas"
	canvas = $canvas[0]

	$dragBox = $ "#drag-box"

	# Register event handlers
	$canvas.mousedown (event) ->
		window.dragInProcess = yes
		window.dragStartPoint = [event.clientX, event.clientY]

		$dragBox.css
			"display": "block"

			"left": dragStartPoint[0]
			"top": dragStartPoint[1]

			"width": 0
			"height": 0

	$canvas.mousemove (event) ->
		if window.dragInProcess
			p1 = [Math.min(event.clientX, dragStartPoint[0]), Math.min(event.clientY, dragStartPoint[1])]
			p2 = [Math.max(event.clientX, dragStartPoint[0]), Math.max(event.clientY, dragStartPoint[1])]

			$dragBox.css
				"left": p1[0]
				"top": p1[1]

				"width": p2[0] - p1[0]
				"height": p2[1] - p1[1]

	$canvas.mouseup (event) ->
		window.dragEndPoint = [event.clientX, event.clientY]
		$dragBox.css
			"display": "none"

		window.dragInProcess = no

		updateWindowBounds()

	# Create a new WebGL context for the canvas.
	window.gl = createGLContext canvas

	# Create the vertex and fragment shaders.
	fragmentShader = getShaderFromFile gl, "shaders/fragment.fs"
	vertexShader = getShaderFromFile gl, "shaders/vertex.vs"

	# Create a shader program using the shaders.
	shaderProgram = createShaderProgram gl, fragmentShader, vertexShader

	# Tell the GL context to use the shader program.
	gl.useProgram shaderProgram

	# Allocate space in GPU memory for the vertex position buffer.
	positionBufferLocation = gl.getAttribLocation shaderProgram, "a_position"
	positionBuffer = gl.createBuffer()

	# Create an array with the vertex position data.
	positionBufferData = new Float32Array [
		# 1st triangle
		0, 0
		1, 0
		0, 1

		# 2nd triangle
		1, 0
		0, 1
		1, 1
	]

	# Store the vertex position data in the buffer.
	gl.bindBuffer gl.ARRAY_BUFFER, positionBuffer
	gl.bufferData gl.ARRAY_BUFFER, positionBufferData, gl.STATIC_DRAW

	# Save the buffer in GPU memory.
	gl.enableVertexAttribArray positionBufferLocation
	gl.vertexAttribPointer positionBufferLocation, 2, gl.FLOAT, false, 0, 0

	# Repeat the process for the complex coordinates.
	window.complexCoordsBufferLocation = gl.getAttribLocation shaderProgram, "a_complexCoord"
	window.complexCoordsBuffer = gl.createBuffer()

	window.xBounds = [-2.5, 1]
	window.yBounds = [-1.2, 1.2]

	window.needsUpdate = yes
	tick()

window.tick = ->
	requestAnimFrame tick

	if needsUpdate
		update()
		render()

		window.needsUpdate = no

window.render = ->
	gl.drawArrays gl.TRIANGLES, 0, 6

window.update = ->
	# Recalculate x and y bounds based on mouse position NOT WORKING
	# radiusX = (xBounds[1] - xBounds[0]) / 2
	# radiusY = (yBounds[1] - yBounds[0]) / 2

	# mouseComplexCoord = [mapTo(mousePosition[0] / 10, 0, $(window).width(), xBounds[0], xBounds[1]), mapTo(mousePosition[1], 0, $(window).height(), yBounds[0], yBounds[1])]

	# radiusX *= 0.999
	# radiusY *= 0.999

	# xBounds[0] = mouseComplexCoord[0] - radiusX
	# xBounds[1] = mouseComplexCoord[0] + radiusX

	# yBounds[0] = mouseComplexCoord[1] - radiusY
	# yBounds[1] = mouseComplexCoord[1] + radiusY

	window.complexCoordsBufferData = new Float32Array [
		# 1st triangle
		xBounds[0], yBounds[1],
		xBounds[1], yBounds[1],
		xBounds[0], yBounds[0],

		# 2nd triangle
		xBounds[1], yBounds[1],
		xBounds[0], yBounds[0],
		xBounds[1], yBounds[0]
	]

	gl.bindBuffer gl.ARRAY_BUFFER, window.complexCoordsBuffer
	gl.bufferData gl.ARRAY_BUFFER, complexCoordsBufferData, gl.STATIC_DRAW

	gl.enableVertexAttribArray complexCoordsBufferLocation
	gl.vertexAttribPointer complexCoordsBufferLocation, 2, gl.FLOAT, false, 0, 0

updateWindowBounds = ->
	p1 = [Math.min(dragStartPoint[0], dragEndPoint[0]), Math.min(dragStartPoint[1], dragEndPoint[1])]
	p2 = [Math.max(dragStartPoint[0], dragEndPoint[0]), Math.max(dragStartPoint[1], dragEndPoint[1])]

	console.log xBounds
	window.xBounds = [mapTo(p1[0], 0, windowSize[0], xBounds[0], xBounds[1]), mapTo(p2[0], 0, windowSize[0], xBounds[0], xBounds[1])]
	window.yBounds = [mapTo(p1[1], 0, windowSize[1], yBounds[0], yBounds[1]), mapTo(p2[1], 0, windowSize[1], yBounds[0], yBounds[1])]

	# QUICK FIX
	window.yBounds = [Math.max(window.yBounds[1], window.yBounds[0]), Math.min(window.yBounds[1], window.yBounds[0])]
	#

	window.needsUpdate = yes

window.createGLContext = (canvas) ->
	gl = canvas.getContext("webgl") or canvas.getContext("experimental-webgl")
	unless gl? then alert "Could not initialize WebGL."

	gl

window.createShaderProgram = (gl, fragmentShader, vertexShader) ->
	shaderProgram = gl.createProgram()

	gl.attachShader shaderProgram, vertexShader
	gl.attachShader shaderProgram, fragmentShader
	gl.linkProgram shaderProgram

	if not gl.getProgramParameter shaderProgram, gl.LINK_STATUS
		alert "Could not initialize shaders."

	shaderProgram

# Util methods
window.getShaderFromFile = (gl, path) ->
	location = window.location.pathname
	directory = location[0...location.lastIndexOf "/"]
	url = "#{directory}/#{path}"

	source = ""
	$.ajax
		type: 'GET'
		url: url
		success: (response) ->
			source = response
		async: false

	extension = path[(path.lastIndexOf(".") + 1)..]
	shader = gl.createShader do ->
		switch extension
			when "fs" then gl.FRAGMENT_SHADER
			when "vs" then gl.VERTEX_SHADER

	gl.shaderSource shader, source
	gl.compileShader shader

	if not gl.getShaderParameter shader, gl.COMPILE_STATUS
		alert "An error occurred compiling the shaders: #{gl.getShaderInfoLog shader}"

	shader

window.mapTo = (num, startMin, startMax, mapMin, mapMax) ->
	mapMin + (((num - startMin) / (startMax - startMin)) * (mapMax - mapMin))

$ main