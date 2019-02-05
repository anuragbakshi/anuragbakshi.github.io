function ObjLoader() {}

ObjLoader.loadModelFromFile = function(path) {
	var location = window.location.pathname;
	var directory = location.substring(0, location.lastIndexOf('/'));
	var url = directory + '/' + path;

	var data;
	$.ajax({
		type: 'GET',
		url: url,
		success: function(response) {
			data = response.split('\n');
		},
		async: false
	});

	var model = {
		vertices: [],
		normals: [],
		faces: []
	};

	data.forEach(function(line) {
		var lineData = line.split(' ');
		switch(lineData[0]) {
			case 'v':
				model.vertices.push([
					parseFloat(lineData[1]),
					parseFloat(lineData[2]),
					parseFloat(lineData[3])
				]);
				break;

			case 'vn':
				model.normals.push([
					parseFloat(lineData[1]),
					parseFloat(lineData[2]),
					parseFloat(lineData[3])
				]);
				break;

			case 'f':
				var v1 = lineData[1].split('/');
				var v2 = lineData[2].split('/');
				var v3 = lineData[3].split('/');

				model.faces.push({
					vertexIndices: [
						parseInt(v1[0], 10),
						parseInt(v2[0], 10),
						parseInt(v3[0], 10)
					],
					normalIndices: [
						parseInt(v1[2], 10),
						parseInt(v2[2], 10),
						parseInt(v3[2], 10)
					]
				});
				break;
		}
	});

	return model;
};

ObjLoader.createBuffersFromModel_old = function(gl, model) {
	var vertices = [];
	var normals = [];

	// Process each face in the model
	model.faces.forEach(function(face) {
		// Concatenate the vertices of the face to the main array
		vertices.push.apply(vertices, model.vertices[face.vertexIndecies[0]], model.vertices[face.vertexIndecies[1]], model.vertices[face.vertexIndecies[2]]);
		normals.push.apply(normals, model.normals[face.normalIndecies[0]], model.normals[face.normalIndecies[1]], model.normals[face.normalIndecies[2]]);
	});

	var vertexPositionBuffer = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	vertexPositionBuffer.itemSize = 3;
	vertexPositionBuffer.numItems = model.faces.length * 3 * vertexPositionBuffer.itemSize;

	var vertexNormalBuffer = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

	vertexNormalBuffer.itemSize = 3;
	vertexNormalBuffer.numItems = model.faces.length * 3 * vertexNormalBuffer.itemSize;

	return {
		position: vertexPositionBuffer,
		normal: vertexNormalBuffer
	};
};

ObjLoader.createBuffersFromModel = function(gl, model) {
	// Make an array containing all the vertices concatenated together
	var vertices = [];
	model.vertices.forEach(function(vertex) {
		vertices.push.apply(vertices, vertex);
	});

	var vertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);

	vertexPositionBuffer.itemSize = 3;
	vertexPositionBuffer.numItems = model.vertices.length;

	// Make an array containing all the vertix indices concatenated together
	var vertexIndices = [];
	model.faces.forEach(function(face) {
		vertexIndices.push.apply(vertexIndices, face.vertexIndices);
	});

	var vertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.vertices), gl.STATIC_DRAW);

	vertexIndexBuffer.itemSize = 1;
	vertexIndexBuffer.numItems = vertexIndices.length;

	return {
		position: vertexPositionBuffer,
		index: vertexIndexBuffer
	};
};