var step = 0;
var lines = [];
var points = [];
var dragIndex = -1;
var down = 0;
var curve = [];
var cursorPos = [];
var dimensions = [];
var fullscreen = false;
var body = "";
var aniSpeed = 0.5;

var backgroundColor;
var gridColor;
var basicsColor;
var calcColor;
var curveColor;

var slider = document.getElementById('range-slider');
var range = document.getElementById('.range-slider__range');
var value = document.getElementById('.range-slider__value');
var rangeSlider = function(){
    //slider.each(function(){

      //  value.each(function(){
            var value = $(this).prev().attr('value');
            //$(this).html(value);
        //});

        range.on('input', function(){
            //$(this).next(value).html(range["0"].valueAsNumber/100);
            value.innerHTML(range.valueAsNumber/100)
            aniSpeed = range["0"].valueAsNumber/200;
            //console.log(range["0"].valueAsNumber);
        });
    //});
};

window.onload = function(){
    canvas = document.getElementById("canvas");
    gc 		= canvas.getContext("2d");

    body = document.getElementById("body").innerHTML;

    dimensions.push(canvas.width);
    dimensions.push(canvas.height);


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
        cursorPos = [event.clientX, event.clientY];

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

    document.addEventListener("keyup", function(event){
//		console.log(event.key + " - " + cursorPos[0] + "|" + cursorPos[1]);
        if(event.key == "+"){
            var rect = canvas.getBoundingClientRect();
            var x = cursorPos[0] - rect.left;
            var y = cursorPos[1] - rect.top;
            lines.push([x, y]);
            if(lines.length > 1){
                points.push([]);
                for(var i = 0; i < points.length; i++){
                    points[i].push([]);
                }
            }

            document.getElementById("numberInput").value = lines.length - 1;
        }/*else if(event.key == "f" || event.key == "F"){
       fullscreen = !fullscreen;
       if(fullscreen){
       document.getElementById("body").innerHTML = "<canvas width=\"" + window.innerWidth + "\" height=\"" + window.innerHeight + "\" id=\"canvas\"></canvas><br>";
       canvas = document.getElementById("canvas");
       gc 		= canvas.getContext("2d");

       document.documentElement.style.overflow = 'hidden';  // firefox, chrome
       document.body.scroll = "no"; // ie only
       }else{
       document.getElementById("body").innerHTML = body;
       canvas = document.getElementById("canvas");
       gc 		= canvas.getContext("2d");

       document.documentElement.style.overflow = 'auto';  // firefox, chrome
       document.body.scroll = "yes"; // ie only
       }
       }*/
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

    step = step + aniSpeed;
    if(step > 100) step = 0;

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

    if(lines.length > 1){
        curve.push([points[points.length - 1][0][0], points[points.length - 1][0][1]]);
    }
    render();

//	console.log(step);
//	console.log(lines);
//	console.log(points);
}

function render(){
    if(!fullscreen){
        backgroundColor = document.getElementById("backgroundColor").value;
        gridColor 		= document.getElementById("gridColor").value;
        basicsColor 	= document.getElementById("basicsColor").value;
        calcColor 		= document.getElementById("calcColor").value;
        curveColor 		= document.getElementById("curveColor").value;
    }

    //background
    gc.fillStyle = backgroundColor;
    gc.fillRect(0, 0, canvas.width, canvas.height);

    //grid
    var steps = 20;
    if(document.getElementById("gridCheck").checked){
        for(var i = 0; i < canvas.width / steps; i++){
            drawLine([steps * i, 0], [steps * i, canvas.height], gridColor, 0.25);
        }
        for(var i = 0; i < canvas.height / steps; i++){
            drawLine([0, steps * i], [canvas.width, steps * i], gridColor, 0.25);
        }
    }

    //draw base lines + circles
    if(document.getElementById("pointLinesCheck").checked){
        drawLines(lines, basicsColor, 1);
    }
    drawCircles(lines, basicsColor, 2.5, 1);
    drawCircles(lines, basicsColor, 4.5, 1);

    //draw other linse + points
    for(var i = 0; i < points.length; i++){
        if(document.getElementById("calcLinesCheck").checked){
            drawLines(points[i], calcColor, 1);
            drawCircles(points[i], calcColor, 1.5, 1);
        }
    }
    if(lines.length > 0){
        gc.beginPath();
        gc.arc(points[points.length - 1][0][0], points[points.length - 1][0][1], 1.5, 0, 2 * Math.PI, false);
        gc.stroke();
    }

    drawLines(curve, curveColor, 3);
}

function drawLines(list, color, width){
    for(var i = 0; i < list.length - 1; i++){
        drawLine(list[i], list[i + 1], color, width);
    }
}

function drawCircles(list, color, radius, width){ //void ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise); 2.5 4.5
    gc.strokeStyle = color;
    gc.lineWidth = width;
    for(var i = 0; i < list.length; i++){
        gc.beginPath();
        gc.arc(list[i][0], list[i][1], radius, 0, 2 * Math.PI, false);
        gc.stroke();
    }
}

function drawLine(pos1, pos2, color, width){
    gc.strokeStyle = color;
    gc.lineWidth = width;
    gc.beginPath();
    gc.moveTo(pos1[0], pos1[1]);
    gc.lineTo(pos2[0], pos2[1]);
    gc.stroke();
}

rangeSlider();