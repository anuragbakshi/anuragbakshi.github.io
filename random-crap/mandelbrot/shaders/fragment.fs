precision mediump float;

varying vec2 v_complexCoord;

void main() {
	vec2 pos = v_complexCoord; // c
	vec2 val = pos; // Z (skipping first iteration because Z = 0)

	vec2 squared = pos * pos;
	
	float iteration;
	for(float i = 0.0; i < 10000.0; ++i) {
		val.y = 2.0 * (val.x * val.y);
		val.x = squared.x - squared.y;
		val += pos;
		squared = val * val;

		if((squared.x + squared.y) > 4.0) {
			iteration = i;
			break;
		}
	}

	//  && (squared.x + squared.y) < 4.0

	gl_FragColor = vec4(iteration / 50.0, 0, 0, 1);
}