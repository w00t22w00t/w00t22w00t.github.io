const angles = [38, 28, 18, 8, 0, -8, -18, -28, -38];

const timeLine = document.querySelector('.time-line'),
      dots = document.querySelectorAll('.time-line .rotate'),
      descWindow = document.querySelector('.desc-block'),
      windowYear = document.querySelector('.block-year'),
      line = document.querySelector('.line');

let beforeItem = 0;
let count = 4;
var startx = 0;

dots.forEach(function(item, index) {
	item.addEventListener('click', function(){
		currentYear(this);

		timeLine.style.transform = 'rotate(' + angles[index] + 'deg)';
		descWindow.style.top = -index * 60 + 'px';
		windowYear.style.top = -index * 186 + 'px';
		line.style.backgroundPosition = -index * 16 + 'px';
	});
});

if (timeLine.addEventListener) {
	if ('onwheel' in document) {
	    // IE9+, FF17+, Ch31+
	    timeLine.addEventListener("wheel", onWheel);
	} else if ('onmousewheel' in document) {
	    // устаревший вариант события
	    timeLine.addEventListener("mousewheel", onWheel);
	} else {
	    // Firefox < 17
	    timeLine.addEventListener("MozMousePixelScroll", onWheel);
	}
} else { // IE8-
	timeLine.attachEvent("onmousewheel", onWheel);
}
// timeLine.addEventListener("touchmove", onWheel, false);

function onWheel(e) {
	e = e || window.event;
	e.preventDefault ? e.preventDefault() : (e.returnValue = false);

	var delta = e.deltaY || e.detail || e.wheelDelta;

	if (count >= 0 && count <= 8) {
		count = count + delta/100;

		if( count > 8) {
			count = 8;
		}
		else if( count < 0) {
			count = 0;
		}
	}
	currentYear(dots[count]);
	windowYear.style.top = -count * 186 + 'px';
	descWindow.style.top = -count * 60 + 'px';
	timeLine.style.transform = 'rotate(' + angles[count] + 'deg)';
	line.style.backgroundPosition = -count * 16 + 'px';
}

function currentYear(current){
	for (let i = 0; i < dots.length; i++) {
		if (dots[i] === current) {
			dots[i].classList.add('active-year');
		} else {
			dots[i].classList.contains('active-year') && dots[i].classList.remove('active-year');
		}
	}
}