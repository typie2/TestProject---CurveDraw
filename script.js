var step = 0;
var lines = [];
var points = [];
var dragIndex = -1;
var down = 0;
var curve = []

window.onload = function(){
	canvas = document.getElementById("canvas");
	gc 		= canvas.getContext("2d");


	document.addEventListener("mousedown", function( event ) {
		down = 1;

		var rect = canvas.getBoundingClientRect();
		var x = event.clientX - rect.left;
		var y = event.clientY - rect.top;

		for(var i = 0; i < lines.length; i++){
			var dX = lines[i][0] - x;
			var dY = lines[i][1] - y;
			if(Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2)) < 5){
				dragIndex = i;
				break;
			}
		}
	}, false);

	document.addEventListener("mouseup", function( event ) {
		down = 0;
		dragIndex = -1;
	}, false);

	document.addEventListener("mousemove", function( event ) {
		var rect = canvas.getBoundingClientRect();
		var x = event.clientX - rect.left;
		var y = event.clientY - rect.top;
		var hover = false;
		for(var i = 0; i < lines.length; i++){
			var dX = lines[i][0] - x;
			var dY = lines[i][1] - y;
			if(Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2)) < 5){
				hover = true;
			}
		}
		if(hover){
			document.getElementById("canvas").style.cursor = "pointer";
		}else{
			document.getElementById("canvas").style.cursor = "default";
		}
		if(dragIndex != -1){
			lines[dragIndex][0] = x;
			lines[dragIndex][1] = y;
		}
	}, false);


	setInterval(update, 1000/20);
}

function changeNumber(){
	if(document.getElementById("numberInput").value <= 1){
		document.getElementById("numberInput").value = 1;		//MIN
	}/*else if(document.getElementById("numberInput").value >= 100){
		document.getElementById("numberInput").value = 100;		//MAX
	}*/
	number = document.getElementById("numberInput").value;

	lines = [];
	points = [];
	for(var i = -1; i < number; i++){
		lines.push([parseInt(Math.random() * canvas.width), parseInt(Math.random() * canvas.height)]);
		if(i < number - 1){
			points.push([]);
			for(var j = 0; j < number - i - 1; j++){
				points[i + 1].push([]);
			}
		}
	}
}

function update(){
	step = (step + 0.5) % 100;

	if(step == 0){
		curve = []
	}
	//calc lines and points
	for(var i = 0; i < lines.length - 1; i++){
		var dX = lines[i + 1][0] - lines[i][0];
		var dY = lines[i + 1][1] - lines[i][1];

		points[0][i] = [lines[i][0] + step * dX / 100, lines[i][1] + step * dY / 100];
	}

	for(var i = 1; i < points.length; i++){
		for(var j = 0; j < points[i].length; j++){
			var dX = points[i - 1][j + 1][0] - points[i - 1][j][0];
			var dY = points[i - 1][j + 1][1] - points[i - 1][j][1];

			points[i][j] = [points[i - 1][j][0] + step * dX / 100, points[i - 1][j][1] + step * dY / 100];
		}
	}

	if(lines.length > 0){
		curve.push([points[points.length - 1][0][0], points[points.length - 1][0][1]]);
	}
	render();

//	console.log(step);
}

function render(){
	//background
	gc.fillStyle = "#C0C0C0";
	gc.fillRect(0, 0, canvas.width, canvas.height);

	//draw base lines + circles
	if(document.getElementById("pointLinesCheck").checked){
		drawLines(lines, "#202020", 1);
	}
	drawCircles(lines, "#202020", 2.5);
	drawCircles(lines, "#202020", 4.5);

	//draw other linse + points
	for(var i = 0; i < points.length; i++){
		if(document.getElementById("calcLinesCheck").checked){
			drawLines(points[i], "#505050", 1);
			drawCircles(points[i], "#505050", 1.5);
		}
	}
	if(lines.length > 0){
		gc.beginPath();
		gc.arc(points[points.length - 1][0][0], points[points.length - 1][0][1], 1.5, 0, 2 * Math.PI, false);
		gc.stroke();
	}

	drawLines(curve, "#DAF7A6", 3);
}

function drawLines(list, color, width){
	gc.strokeStyle = color;
	gc.lineWidth = width;
	for(var i = 0; i < list.length - 1; i++){
		gc.beginPath();
		gc.moveTo(list[i][0], list[i][1]);
		gc.lineTo(list[i + 1][0], list[i + 1][1])
		gc.stroke();
	}
}

function drawCircles(list, color, radius){ //void ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise); 2.5 4.5
	gc.strokeStyle = color;
	for(var i = 0; i < list.length; i++){
		gc.beginPath();
		gc.arc(list[i][0], list[i][1], radius, 0, 2 * Math.PI, false);
		gc.stroke();
	}
}