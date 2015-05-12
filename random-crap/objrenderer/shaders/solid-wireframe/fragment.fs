precision mediump float;

uniform sampler2D u_image;

varying vec2 v_texCoord;
varying vec3 v_relativePosition;

void main() {
	vec4 pixel = texture2D(u_image, v_texCoord);

	float brightness = (pixel.w + pixel.x + pixel.y) / 3.0;

	// float levels = 10.0;
	// for (float i = 0.0; i < 10.0; ++i) {
	// 	float val = i / levels;
	// 	if (brightness > val)
	// 		gl_FragColor = vec4(val, val, val, 1);
	// }

	if (any(lessThan(v_relativePosition, vec3(0.01))))
		gl_FragColor = vec4(1, 1, 1, 1);
	else
		gl_FragColor = texture2D(u_image, v_texCoord);
}