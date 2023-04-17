(function() {
'use strict'
let options = {
	bttnJoke: document.querySelector('.get-joke-bttn'),
	bttnsCategory:  document.querySelectorAll('.category label input'),
	searchBttn: document.querySelector('.search input'),
	myInput: document.querySelectorAll('.mode__item input'),
	currentJokes: [],
	dataJokes:[]
}


class Mode{
	constructor(args) {
		this.bttnsCategory = args.bttnsCategory;
		this.searchBttn = args.searchBttn;
		this.myInput = args.myInput;
		this.mode = null;

		this.bttnsCategory.forEach((elem, index) => {
			elem.addEventListener('click', (e) => {
				this.mode = 'random?category=' + elem.value;
			});
		});

		this.searchBttn.addEventListener('change', (e) => {
			this.mode = 'search?query=' + this.searchBttn.value;
		});
	}


	chooseMode(){
		this.myInput.forEach((item, index) => {
			item.addEventListener('change', (e) => {
				if(e.target.value === 'random') {
					this.mode = 'random';
				} else if(e.target.value === 'category') {
					this.mode = null;
					
				} else if(e.target.value === 'search') {
					this.mode = null;
					if(this.searchBttn.value){
						this.mode = 'search?query=' + this.searchBttn.value;
					}
				}
			});
		})
	}
}



class Joke extends Mode {
	constructor(args) {
		super(args);
		this.bttnJoke = args.bttnJoke;
	}

	getJoke(goPrint, callback) {
		let request = new XMLHttpRequest();
		request.open('GET', `https://api.chucknorris.io/jokes/${this.mode != null ? this.mode : ''}`);
		request.setRequestHeader('Content-type', 'application/json; charser=utf-8');
		request.send();

		request.addEventListener('readystatechange',(e) => {
			if (request.readyState === 4) {
				if (request.status == 200) {
					let data = JSON.parse(request.response);

					if (!data.total) {
						let t = Date.parse(new Date()) - Date.parse(data.updated_at);
						data.hours = Math.floor((t/(1000*60*60)));
						goPrint(data);
						callback();
					} else {
						data.result = data.result.map(function(item){
							let t = Date.parse(new Date()) - Date.parse(item.updated_at);
							item.hours = Math.floor((t/(1000*60*60)));
							goPrint(item);
							callback();
						});
					}
				}
			}
		});
	}
}

class JokePrinter extends Joke {
	constructor(args) {
		super(args);
		this.currentJokes = args.currentJokes;
		this.count = 0;
		this.dataJokes = args.dataJokes;

		this.bttnJoke.addEventListener('click', (e) => {
			this.getJoke(data => this.jokeToHtml(data), this.transferToFavourite);
		});
	}

	jokeToHtml(data, place = '.joke-root', heart = 'far',count = this.count) {
		this.dataJokes[count] = data;
		let jokeWindow = document.createElement('div');
		jokeWindow.classList.add('single-joke');
		jokeWindow.insertAdjacentHTML('afterBegin',`
			<div class="joke-container">
				<div class="joke-box">
					<div class="joke-container__icon">
						<img src="img/message.png" alt="message">
					</div>
					<div class="joke">
						<i class="${heart} fa-heart simple-heart"></i>
						<p class="joke-id">ID: <a href="${data.url}" class="link-joke">${data.id}</a></p>
						<p class="joke-text">${data.value}</p>
						<div class="joke-footer">
							<div class="joke-update">
								<span>Last update: ${data.hours} hours ago</span>
							</div>
							<div class="joke-category">${data.categories[0] != null ? data.categories[0] : ''}</div>
						</div>
					</div>
				</div>
			</div>
		`);
		if (data.categories[0] === null || data.categories[0] === undefined) {
			jokeWindow.querySelector('.joke-category').remove();
		}
		document.querySelector(place).prepend(jokeWindow);
		this.jokeWindow = jokeWindow;
	}
}

class FavouriteJokes extends JokePrinter {
	constructor(args) {
		super(args);
		this.favouriteJokes = [];
	}

	transferToFavourite = () => {
		this.currentJokes[this.count] = this.jokeWindow;
		
		let count = this.count;
		let heart = this.currentJokes[this.count].querySelector('.simple-heart');
		heart.addEventListener('click', (e) => {
			if(this.currentJokes[count].parentNode.classList.contains('joke-root')) {
				localStorage.setItem(this.dataJokes[count].id, JSON.stringify(this.dataJokes[count]))
				heart.classList.remove('far');
				heart.classList.add('fas');
				document.querySelector('.favourites__body').prepend(this.currentJokes[count]);
			} else {
				localStorage.removeItem(this.dataJokes[count].id);
				heart.classList.remove('fas');
				heart.classList.add('far');
				document.querySelector('.joke-root').prepend(this.currentJokes[count]);
			}
		});
		this.count++;
	}

	showFavoriteJokes() {
		if (localStorage.length) {
			for(let i = 0; i < localStorage.length; i++) {
				let key = localStorage.key(i);
				this.jokeToHtml(JSON.parse(localStorage.getItem(key)), '.favourites__body', 'fas', i);
				this.favouriteJokes[i] = this.jokeWindow;
				let heart = this.favouriteJokes[i].querySelector('.simple-heart');

				heart.addEventListener('click', (e) => {
					if(this.favouriteJokes[i].parentNode.classList.contains('joke-root')){
						localStorage.setItem(this.dataJokes[i].id, JSON.stringify(this.dataJokes[i]))
						heart.classList.remove('far');
						heart.classList.add('fas');
						document.querySelector('.favourites__body').prepend(this.favouriteJokes[i]);
					} else{
						localStorage.removeItem(key);
						heart.classList.remove('fas');
						heart.classList.add('far');
						document.querySelector('.joke-root').prepend(this.favouriteJokes[i]);
					}
				});
			}
		}
	}
}


window.addEventListener('DOMContentLoaded', () => {
	let joke = new FavouriteJokes(options);
	joke.chooseMode();
	joke.showFavoriteJokes();
});

})();

(function() {
	'use strict'
	const toggle = document.querySelector(".favourites__hamburger"),
		favBody = document.querySelector('.favourites'),
		favHeader = document.querySelector('.favourites__header'),
		overlay = document.querySelector('.favourites__overlay'),
		container = document.querySelector('.container');


	toggle.addEventListener( "click", function(e) {
		e.preventDefault();
		this.classList.toggle("is-active");
		favBody.classList.toggle("is-active");
		favHeader.classList.toggle("is-active");
		overlay.classList.toggle("is-active");
		container.classList.toggle("is-active");
	});

})();