function ObjectTracker(canvas, targetColor, tolerance) {
	this.canvas = canvas;
	this.canvasContext = canvas.getContext('2d');

	this.targetColorRGB = targetColor;
	this.targetColorHSB = ColorSpaceUtil.rgbToHsv(targetColor);
	this.tolerance = tolerance;

	this.p1 = new Point(canvas.width, canvas.height);
	this.p2 = new Point(0, 0);
}

ObjectTracker.prototype.update = function() {
	this.p1.set(this.canvas.width, this.canvas.height);
	this.p2.set(0, 0);

	var imageData = canvasContext.getImageData(0, 0, this.canvas.width, this.canvas.height);
	
	for(var x = 0; x < this.canvas.width; ++x) {
		for(var y = 0; y < this.canvas.height; ++y) {
			var pixelColor = pixel(imageData, x, y);
			var hsv = ColorSpaceUtil.rgbToHsv(ColorSpaceUtil.scaleRgb(pixelColor));

			if(Math.abs(this.targetColorHSB[0] - hsv[0]) < this.tolerance && Math.abs(this.targetColorHSB[1] - hsv[1]) < this.tolerance) {
				this.p1.x = Math.min(this.p1.x, x);
				this.p1.y = Math.min(this.p1.y, y);
				
				this.p2.x = Math.max(this.p2.x, x);
				this.p2.y = Math.max(this.p2.y, y);
			}
		}
	}

	canvasContext.putImageData(imageData, 0, 0);
};

ObjectTracker.prototype.getObjectBounds = function() {
	return this.p2.x !== 0 ? {
		x: this.p1.x,
		y: this.p1.y,
		width: this.p2.x - this.p1.x,
		height: this.p2.y - this.p1.y
	} : null;
};

ObjectTracker.prototype.getCenter = function() {
	return p1.midpoint(p2);
};