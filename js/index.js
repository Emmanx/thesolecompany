//possible performance drawback by playing in background continously?
var animation = bodymovin.loadAnimation({
	container: document.querySelector('.loading-screen__animation'),
	renderer: 'svg',
	loop: true,
	autoplay: true,
	path: '../data_.json',
});

gsap.registerPlugin(ScrollTrigger);

// let moveIn = gsap
// 	.to('.js-t-line', {
// 		scrollTrigger: 'js-t-line',
// 		duration: 1,
// 		y: 0,
// 		ease: 'ease-out',
// 	})
// 	.pause();

//remake nodes with animation classes
function slideUpAnimationWrapper(selector) {
	let upForAnim = document.querySelectorAll(selector);
	upForAnim.forEach((el) => {
		let content = el.textContent;
		let fragment = new DocumentFragment();
		var oh = document.createElement('span');
		oh.classList.add('oh');
		var jsT = document.createElement('span');
		jsT.classList.add('js-t-line');
		jsT.textContent = content;
		oh.appendChild(jsT);
		fragment.appendChild(oh);
		el.textContent = '';
		el.appendChild(fragment);
	});
}

slideUpAnimationWrapper('.slide-up-reveal');

function slideUpAnimation() {
	gsap.utils.toArray('.js-t-line').forEach((el) => {
		gsap.to(el, {
			scrollTrigger: {
				trigger: el,
				once: false,
			},
			delay: 0.3,
			duration: 1,
			ease: 'expo',
			y: 0,
			onComplete: () => console.log('Im done'),
		});
	});
}

function lineAnimation() {
	gsap.utils.toArray('.divider').forEach((el) => {
		gsap.to(el, {
			scrollTrigger: {
				trigger: el,
			},
			delay: 0.3,
			duration: 1.5,
			ease: 'expo',
			width: '100%',
		});
	});
}

function otherAnimations() {
	gsap.to('.js-t-line-head', {
		duration: 1,
		ease: 'expo',
		y: 0,
		stagger: 0.2,
	});

	gsap.to('.js-t-line-stg', {
		duration: 1,
		ease: 'expo',
		y: 0,
		delay: 0.5,
		stagger: 0.3,
	});
}

window.onload = () => {
	setTimeout(() => {
		pageTransitionIn().then(() => {
			document.querySelector('body').classList.remove('is-loading');
		});
		pageTransitionOut().then(() => {
			// sequence page animations
			slideUpAnimation();
			lineAnimation();
			otherAnimations();
		});
	}, 1000);
};

function pageTransitionIn() {
	return gsap.to('.page-transition', {
		duration: 0.5,
		scaleX: 1,
		transformOrigin: 'bottom right',
	});
}

function pageTransitionOut() {
	return gsap.timeline({ delay: 1 }).to('.page-transition', {
		duration: 0.5,
		scaleX: 0,
		skewX: 0,
		transformOrigin: 'top left',
		ease: 'power1.out',
	});
}

barba.init({
	transitions: [
		{
			name: 'say-hi',
			leave() {
				pageTransitionOut();
			},
			enter() {
				pageTransitionIn();
				let slide = new TextSlide(document.querySelector('.slide'));
				slide.play();
			},
		},
	],
});

class Slide {
	constructor(el) {
		this.el = el;
		this.txt = new TextFx(el);
	}
}

class TextSlide {
	constructor(slideNode) {
		this.slideNode = slideNode;
		this.slideElements = this.slideNode.querySelectorAll('.effect');
		this.elementsFx = Array.from(this.slideElements).map((el) => new Slide(el));
		this.count = this.elementsFx.length;
		this.index = 0;
		this.isPlay;
	}

	//change slide index
	switch() {
		let currentSlide = this.elementsFx[this.index];
		let tempIndex = this.index + 1;
		this.index = tempIndex > this.count - 1 ? 0 : tempIndex;
		let nextSlide = this.elementsFx[this.index];

		var checkEndCnt = 0,
			checkEnd = function () {
				checkEndCnt++;
				if (checkEndCnt === 2) {
					currentSlide.el.classList.remove('slide--current');
					nextSlide.el.classList.add('slide--current');
				}
			};

		currentSlide.txt.hide('fx15', function () {
			currentSlide.el.style.opacity = 0;
			checkEnd();
		});

		nextSlide.txt.hide();
		nextSlide.el.style.opacity = 1;
		nextSlide.txt.show('fx15', function () {
			checkEnd();
		});
	}

	play() {
		this.isPlay = setInterval(() => this.switch(), 2500);
	}

	stop() {
		clearInterval(this.isPlay);
	}
}

let slide = new TextSlide(document.querySelector('.slide'));
slide.play();
