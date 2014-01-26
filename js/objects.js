//Point object
function makePoint(startX, startY)
{
	this.startX = startX;
	this.startY = startY;
	this.type = 'point';
}
//Line object
function makeLine(startX, startY, endX, endY)
{
	this.startX = startX;
	this.startY = startY;
	this.endX = endX;
	this.endY = endY;
	this.type = 'line'; 
}
//Circle object
function makeCircle(startX, startY, diameter)
{
	this.startX = startX;
	this.startY = startY;
	this.diameter = diameter;
	this.type = 'circle';
}
//Polygon object
function makePolygon(angles)
{
	this.angles = angles;
	this.type = 'polygon';
}