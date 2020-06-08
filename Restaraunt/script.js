'use strict';
window.addEventListener('DOMContentLoaded', function(){
	let toggle = document.querySelector('.toggle'),
		image = document.querySelector('.header-img'),
		imgBlock = document.querySelector('.header-left');
	
	function changeDisplay(){
		imgBlock.classList.toggle('none');
	}

	function changeSize(){
		image.classList.toggle('header-img-change');
	}

	toggle.addEventListener('click', function(){	
		if (imgBlock.classList.contains('none')) {
			changeDisplay(); 		
			setTimeout(changeSize, 10);
		} else{
			changeSize();
			setTimeout(changeDisplay, 1000);
		}
	})
});