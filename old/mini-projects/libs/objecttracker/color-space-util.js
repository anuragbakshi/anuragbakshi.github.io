function ColorSpaceUtil() {}

ColorSpaceUtil.scaleToDecimal = function(color) {
	return [color[0] / 255, color[1] / 255, color[2] / 255];
};

ColorSpaceUtil.scaleTo255 = function(color) {
	return [Math.floor(color[0] * 255), Math.floor(color[1] * 255), Math.floor(color[2] * 255)];
};

// rgb is from 0 to 255
ColorSpaceUtil.rgbToHsv = function(rgb) {
	rgb = ColorSpaceUtil.scaleToDecimal(rgb);

	var min = Math.min.apply(Math, rgb);
	var max = Math.max.apply(Math, rgb);
	var range = max - min;
	
	var hsv = [0, 0, max];
	
	if(range !== 0) {
		hsv[1] = range / max;
		
		var rangeR = (((max - rgb[0]) / 6) + (range / 2)) / range;
		var rangeG = (((max - rgb[1]) / 6) + (range / 2)) / range;
		var rangeB = (((max - rgb[2]) / 6) + (range / 2)) / range;
		
		if(rgb[0] == max)
			hsv[0] = rangeB - rangeG;
		else if(rgb[1] == max)
			hsv[0] = (0.33333333) + rangeR - rangeB;
		else if(rgb[2] == max)
			hsv[0] = (0.66666667) + rangeG - rangeR;
		
		if(hsv[0] < 0)
			hsv[0] += 1;
		if(hsv[0] > 1)
			hsv[0] -= 1;
	}
	
	return hsv;
};

// hsv is from 0 to 1
// TODO Fix
ColorSpaceUtil.hsvToRgb = function(hsv) {
	var rgb;

	if (hsv[1] === 0) {
		rgb = [hsv[2], hsv[2], hsv[2]];
	} else {
		var h = (hsv[0] - Math.floor(hsv[0])) * 6.0;
		var f = h - Math.floor(h);
		var p = hsv[2] * (1.0 - hsv[1]);
		var q = hsv[2] * (1.0 - hsv[1] * f);
		var t = hsv[2] * (1.0 - (hsv[1] * (1.0 - f)));

		switch (Math.floor(h)) {
		case 0:
			rgb = [hsv[2], t, p];
			break;

		case 1:
			rgb = [q, hsv[2], p];
			break;

		case 2:
			rgb = [p, hsv[2], t];
			break;

		case 3:
			rgb = [p, q, hsv[2]];
			break;

		case 4:
			rgb = [t, p, hsv[2]];
			break;

		default:
			rgb = [hsv[2], p, q];
			break;
		}
	}

	return ColorSpaceUtil.scaleTo255(rgb);
};

ColorSpaceUtil.rgbToCss = function(rgb) {
	return '#' + rgb[0].toString(16) + rgb[1].toString(16) + rgb[2].toString(16);
};