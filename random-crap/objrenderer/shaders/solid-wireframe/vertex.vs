attribute vec2 a_position;
attribute vec2 a_texCoord;
attribute vec3 a_relativePosition;

uniform vec2 u_resolution;

varying vec2 v_texCoord;
varying vec3 v_relativePosition;

void main() {
	gl_Position = vec4((2.0 * a_position / u_resolution - 1.0) * vec2(1, -1), 0, 1);

	v_texCoord = a_texCoord;
	v_relativePosition = a_relativePosition;
}