function Point(x, y, z) {
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
}

Point.prototype.set = function(x, y, z) {
	this.x = x || this.x;
	this.y = y || this.y;
	this.z = z || this.z;
};

Point.prototype.distanceSq = function(other) {
	var dx = this.x - other.x;
	var dy = this.y - other.y;
	var dz = this.z - other.z;

	return dx * dx + dy * dy + dz * dz;
};

Point.prototype.distance = function() {
	return Math.sqrt(this.distanceSq());
};

Point.prototype.midpoint = function(other) {
	return new Point((this.x - other.x) / 2, (this.y - other.y) / 2, (this.z - other.z) / 2);
};