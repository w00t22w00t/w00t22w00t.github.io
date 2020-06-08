(function(){
	const angles = [38, 28, 18, 8, 0, -8, -18, -28, -38];
	
	const timeLine = document.querySelector('.time-line'),
		  dots = document.querySelectorAll('.time-line .rotate'),
		  descWindow = document.querySelector('.desc-block'),
		  windowYear = document.querySelector('.block-year'),
		  line = document.querySelector('.line');
	
	let counter = 4;
	
	dots.forEach(function(item, index) {
		item.addEventListener('click', function(){
			currentYear(this, index);		
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
	
	function onWheel(e) {
		e = e || window.event;
		e.preventDefault ? e.preventDefault() : (e.returnValue = false);
	
		var delta = e.deltaY || e.detail || e.wheelDelta;
	
		if (counter >= 0 && counter <= 8) {
			counter = counter + delta/100;
	
			if( counter > 8) {
				counter = 8;
			}
			else if( counter < 0) {
				counter = 0;
			}
		}
		currentYear(dots[counter], counter);
	}
	
	function currentYear(current, dot){
		for (let i = 0; i < dots.length; i++) {
			if (dots[i] === current) {
				dots[i].classList.add('active-year');
			} else {
				dots[i].classList.contains('active-year') && dots[i].classList.remove('active-year');
			}
		}
	
		timeLine.style.transform = 'rotate(' + angles[dot] + 'deg)';
		descWindow.style.top = -dot * 60 + 'px';
		windowYear.style.top = -dot * 186 + 'px';
		line.style.backgroundPosition = -dot * 16 + 'px';
	}
})();
