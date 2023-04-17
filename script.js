'use strict';



window.addEventListener('DOMContentLoaded', function(){
	const text = `Lorem ipsum dolor sit amet, consectetur.`,
		  textDom = document.querySelector('.writable-text'),
	  	  icons = document.querySelector('header .header__links');
	  	  
	let arr = [],
		countFilling = 0;
	
	arr = text.split('');

	function fillingText(){
		textDom.append(arr[countFilling]);
		countFilling++;
		if (countFilling>arr.length-1) {
			clearInterval(t)
		}
	}

	let t = setInterval(fillingText, 50);

	
	setTimeout(function(){
		icons.classList.add('icons-anim');
	}, 0);
});