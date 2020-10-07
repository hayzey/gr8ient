// var canvas = new fabric.Canvas("gradient-canvas");
var canvas = new fabric.StaticCanvas("gradient-canvas");
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
var mouseX = 0;
var mouseY = 0;
var point1 = {};
var point2 = {};

// var myColorStops;
var sliderPoints;
var myColorStops = [
	{
		color: "#0000AA",
		offset: "0",
		opacity: 1
	},
	{ /* This is the last color stop! */
		color: "#52FFFB",
		offset: "0.8",
		opacity: 1
	},
	{
		color: "#0076B2",
		offset: "0.3",
		opacity: 1
	}
];

var updateColorStops = function(stopObjects) {
	// myColorStops = [
	// 	{
	// 		color: "#000000",
	// 		offset: "0",
	// 		opacity: 1
	// 	},
	// 	{
	// 		color: "#ffffff",
	// 		offset: "1",
	// 		opacity: 1
	// 	},
	// 	{
	// 		color: "#666666",
	// 		offset: "0.5",
	// 		opacity: 1
	// 	}
	// ];

	myRect.fill.colorStops = stopObjects;
};

var updatePoints = function() {
	point1.x = parseInt($("#point1").css("left").slice(0,-2)) + 8;
	point1.y = parseInt($("#point1").css("top").slice(0,-2)) + 8;
	point2.x = parseInt($("#point2").css("left").slice(0,-2)) + 8;
	point2.y = parseInt($("#point2").css("top").slice(0,-2)) - 18;
};

function resetGradient(x1, y1, x2, y2) {
	myRect.setGradient("fill", {
		x1: x1,
		y1: y1,
		x2: x2,
		y2: y2,
		colorStops: {}
	});
	myRect.fill.colorStops = myColorStops;
	// canvas.renderAll();
}

canvas.setWidth(canvasWidth);
canvas.setHeight(canvasHeight);

var myRect = new fabric.Rect({
	left: 0,
	top: 0,
	width: canvasWidth,
	height: canvasHeight
});

myRect.setGradient("fill", {
	x1: 0,
	x2: 0,
	y1: 0,
	y2: myRect.height,
	colorStops: {}
});

updateColorStops(myColorStops);
// myRect.fill.colorStops = myColorStops;
canvas.add(myRect);

// Can draw line between two end points
var myLine = new fabric.Line([canvasWidth/2+8, 0, canvasWidth/2+8, canvasHeight-6], {
	stroke: "white",
	strokeWidth: 10
});

// canvas.add(myLine);


// Event listeners

// First draggable div
$("#point1.gradient-direction-point").draggable({
	drag: function() {
		// Get coords
		updatePoints();
		// Change position of line endpoint
		// myLine.set("x1", point1.x);
		// myLine.set("y1", point1.y);
		// Set gradient again
		myRect.setGradient("fill", {
			x1: point1.x,
			y1: point1.y,
			x2: point2.x,
			y2: point2.y,
			colorStops: {}
		});
		// myRect.fill.colorStops = myColorStops;
		updateColorStops(myColorStops);
		// resetGradient(xVal, yVal);

		// Re-render canvas
		canvas.renderAll();
	}
});

// Second draggable div
$("#point2.gradient-direction-point").draggable({
	drag: function() {
		// Get coords
		updatePoints();
		// Change position of line endpoint
		// myLine.set("x2", point2.x);
		// myLine.set("y2", point2.y);
		// Set gradient again
		myRect.setGradient("fill", {
			x1: point1.x,
			y1: point1.y,
			x2: point2.x,
			y2: point2.y,
			colorStops: {}
		});
		// myRect.fill.colorStops = myColorStops;
		updateColorStops(myColorStops);

		// Re-render canvas
		canvas.renderAll();
	}
});


$("#color-point-slider").slider(); // Initialise slider instance
// Color point slider
function initSlider() {
	$("#color-point-slider").slider("destroy"); // Have to destroy slider each time to force refresh

	colorOffsets = [];
	for (i in myColorStops) {
		colorOffsets.push(myColorStops[i].offset * 100);
	}
	console.log(colorOffsets);

	// And re-init...
	$("#color-point-slider").slider({
		// values: [0, 100, 30],
		values: colorOffsets,
		change: function() {
			sliderPoints = $("#color-point-slider").slider("option","values");
			for (i in sliderPoints) {
				myColorStops[i].offset = sliderPoints[i] / 100;
			}
			canvas.renderAll();
			moveColorInputs();
		}
	});
}

initSlider();

// Get slider point positions
// $("#color-point-slider").change(function(event) {
	// sliderPoints = $("#color-point-slider").slider("option","values");
	// for (i in sliderPoints) {
	// 	myColorStops[i].offset = sliderPoints[i] / 100;
	// }
	// console.log('yes');
// });

// Set slider point positions
// $("#color-point-slider").slider("option", "values", []);


function moveColorInputs() {
	$(".color-choice").each(function(index){
		// console.log($(this));
		// console.log($(this).css("left"));
		sliderPoints = $("#color-point-slider").slider("option","values");
		$(this).css("left", sliderPoints[index] + "%");
	});
}

moveColorInputs();

// $(".color-choice").change(function(){
// 	myColorStops[$(this).index()].color = $(this).val();
// 	canvas.renderAll();
// 	console.log('yes');
// });

$("#color-choices-container").on("change", ".color-choice", function(){
	myColorStops[$(this).index()].color = $(this).val();
	canvas.renderAll();
	console.log('yes');
});

function addColor() {
	newColor = {
		color: "#000000",
		offset: "1",
		opacity: 1
	};
	myColorStops.push(newColor);
	points = $("#color-point-slider").slider("option","values");
	points.push(newColor.offset * 100);
	$("#color-point-slider").slider("option","values",points);

	colorInput = '<input class="color-choice" type="color" value="#000000" style="left: 100%">';
	$("#color-choices-container").append(colorInput);
}


$("#add").click(function(){
	addColor();
	initSlider();
	canvas.renderAll();
});

$("#reset").click(function(){
	alert("This doesn't do anything yet...");
});

function hideControls() {
	$("#controls-container").hide();
	$("#show").show();
	// $("#point1").hide();
	// $("#point2").hide();
}

function showControls() {
	$("#controls-container").show();
	$("#show").hide();
	// $("#point1").show();
	// $("#point2").show();
}

$("#hide").click(function(){
	hideControls();
});


$("#show").click(function(){
	showControls();
});