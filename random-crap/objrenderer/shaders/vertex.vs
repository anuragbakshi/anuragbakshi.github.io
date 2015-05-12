uniform mat4 u_modelViewMatrix;
uniform mat4 u_projectionMatrix;

attribute vec3 a_vertexPosition;

void main(void) {
	gl_Position = u_projectionMatrix * u_modelViewMatrix * vec4(a_vertexPosition, 1);
}