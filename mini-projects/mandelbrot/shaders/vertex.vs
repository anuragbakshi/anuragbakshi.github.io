attribute vec2 a_position;
attribute vec2 a_complexCoord;

varying vec2 v_complexCoord;

void main() {
	gl_Position = vec4((a_position * 2.0 - 1.0) * vec2(1, -1), 0, 1);

	v_complexCoord = a_complexCoord;
}