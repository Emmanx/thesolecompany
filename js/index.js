//possible performance drawback by playing in background continously?
var animation = bodymovin.loadAnimation({
	container: document.querySelector('.loading-screen__animation'),
	renderer: 'svg',
	loop: true,
	autoplay: true,
	path: '../data_.json',
});

gsap.registerPlugin(ScrollTrigger);

//text changer animation
class Slide {
	constructor(el) {
		this.el = el;
		this.txt = new TextFx(el);
	}
}

let slidePlay;
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
		this.switch();
		slidePlay = setInterval(() => this.switch(), 2500);
		// return this.isPlay;
	}

	stop() {
		if (!slidePlay) return;
		clearInterval(slidePlay);
	}
}

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
				start: 'top+=20 bottom',
			},
			delay: 0.3,
			duration: 1.5,
			ease: 'expo',
			y: 0,
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

function slideInLeftAnimation() {
	gsap.utils.toArray('.slide-in-left').forEach((el) => {
		gsap.to(el, {
			scrollTrigger: {
				trigger: el,
				start: 'top+=40 bottom',
			},
			delay: 0.6,
			duration: 1,
			ease: 'ease-in',
			x: 0,
			opacity: 1,
		});
	});
}

function otherAnimations() {
	gsap
		.to('.js-t-line-head', {
			duration: 1,
			ease: 'expo',
			y: 0,
			stagger: 0.2,
		})
		.then(() =>
			document.querySelector('.intro-arrow').classList.remove('hide')
		);

	gsap.to('.js-t-line-stg', {
		duration: 1,
		ease: 'expo',
		y: 0,
		delay: 0.5,
		stagger: 0.3,
	});
	gsap.from('.arrow-section', {
		duration: 1,
		ease: 'expo',
		delay: 0.3,
		opacity: 0,
		x: -30,
		scrollTrigger: '.arrow-section',
	});
}

window.onload = () => {
	setTimeout(() => {
		pageTransitionIn().then(() => {
			document.querySelector('body').classList.remove('is-loading');
		});
		pageTransitionOut().then(() => {
			makeCustomCursor();
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

function pageTransitionOut(data) {
	return gsap
		.timeline({ delay: 1 })
		.to('.page-transition', {
			duration: 0.5,
			scaleX: 0,
			skewX: 0,
			transformOrigin: 'top left',
			ease: 'power1.out',
		})
		.then(() => {
			let slideNode = document.querySelector('.slide');
			if (slideNode) {
				let slide = new TextSlide(slideNode);
				slide.stop();
				slide.play();
			}
			// sequence page animations
			slideUpAnimation();
			lineAnimation();
			slideInLeftAnimation();
			otherAnimations();

			//init form validation
			initFormValidation();
		});
}

//custom cursor
let cursor = document.querySelector('.cursor');

let xMousePos = -200;
let yMousePos = -200;
let lastScrolledTop = 0;
gsap.to(cursor, {
	x: xMousePos,
	y: yMousePos,
});

function makeCustomCursor() {
	if (!window.matchMedia('(pointer: fine)').matches) {
		return;
	}
	cursor.classList.remove('hide');

	let hoverable = document.querySelectorAll('.hoverable, a, button');
	let cursorBlend = document.querySelectorAll(
		'button, h1, h2, h3, h4, h5, p, a, li, dt, img, span'
	);

	function updateCursorScroll(e) {
		if (lastScrolledTop != document.querySelector('html').scrollTop) {
			yMousePos -= lastScrolledTop;
			lastScrolledTop = document.querySelector('html').scrollTop;
			yMousePos += lastScrolledTop;
		}

		gsap.to('.cursor', {
			y: yMousePos - 15,
		});
	}

	function onMouseMove(e) {
		xMousePos = e.pageX;
		yMousePos = e.pageY;

		gsap.to('.cursor', {
			duration: 0.3,
			x: xMousePos - 15,
			y: yMousePos - 15,
			ease: 'slow',
		});
	}

	function onMouseEnter(e) {
		console.log('==> in');
		gsap.to('.cursor', {
			duration: 0.5,
			scale: 0.5,
		});
	}

	function onMouseLeave(e) {
		gsap.to('.cursor', {
			duration: 0.5,
			scale: 1,
		});
	}

	function cursorBlendIn(e) {
		cursor.classList.add('cursor--blend');
	}
	function cursorBlendOut(e) {
		cursor.classList.remove('cursor--blend');
	}

	document.addEventListener('mousemove', onMouseMove);
	window.addEventListener('scroll', updateCursorScroll);
	hoverable.forEach((el) => {
		el.addEventListener('mouseenter', onMouseEnter);
		el.addEventListener('mouseleave', onMouseLeave);
	});

	cursorBlend.forEach((el) => {
		el.addEventListener('mouseenter', cursorBlendIn);
		el.addEventListener('mouseleave', cursorBlendOut);
	});
}

barba.init({
	transitions: [
		{
			name: 'say-hi',
			leave(data) {
				pageTransitionOut(data);
			},
			enter() {
				pageTransitionIn();
				slideUpAnimationWrapper('.slide-up-reveal');
				makeCustomCursor();
			},
		},
	],
});

function initFormValidation() {
	//form DOM nodes
	let form = document.querySelector('.contact-form');
	let inputs = document.querySelectorAll(
		'.contact-form input, .contact-form textarea'
	);
	let submitBtn = document.querySelector('.contact-form button');
	form.addEventListener('submit', submitHandler);
	inputs.forEach((input) => input.addEventListener('focus', clearError));

	//validation helper functions
	function validateEmail(input) {
		let emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		return emailRegex.test(input);
	}

	//Button loading state indicator. Append to form submit button
	let buttonLoader = `
<div class="lds-ellipsis">
<div></div>
<div></div>
<div></div>
</div>
`;

	let submitCount = 0;
	//clear form error on focus
	function clearError(e) {
		console.log('about time ->');
		if (submitCount > 0) {
			e.target.classList.remove('invalid');
			e.target.nextElementSibling.classList.add('hide');
		}
	}

	async function submitHandler(e) {
		e.preventDefault();
		submitCount++;
		let errorCount = 0;

		let validationSchema = {
			fullname: {
				isValid: (value) => value.length > 2,
				message: 'Please enter a valid full name',
			},
			email: {
				isValid: (value) => validateEmail(value),
				message: 'Please enter a valid email address',
			},
			message: {
				isValid: (value) => value.length > 2,
				message: 'Please enter a valid message',
			},
		};

		inputs.forEach((input) => {
			let type = input.getAttribute('name');
			let test = validationSchema[type].isValid(input.value);
			let message = validationSchema[type].message;

			if (!test) {
				errorCount++;
				input.classList.add('invalid');
				input.nextElementSibling.classList.remove('hide');
				input.nextElementSibling.textContent = message;
			}
			console.log(test);
		});

		if (errorCount > 0) {
			return;
		} else {
			let formValues = form.elements;
			let fullname = formValues.namedItem('fullname').value;
			let email = formValues.namedItem('email').value;
			let message = formValues.namedItem('message').value;

			//set button loading state
			submitBtn.innerHTML = buttonLoader;
			submitBtn.disabled = true;

			//submit form. Insert fetch request and subsequent UI feedback code here
			try {
				let response = await fetch(
					`https://us-central1-gaca-e75ac.cloudfunctions.net/contactFormAlert?fullname=${fullname}&email=${email}&message=${message}`
				);
				console.log(response);
			} catch {
				//error handling here
			} finally {
				//unset button loading state
				submitBtn.innerHTML = 'Submit';
				submitBtn.disabled = false;
			}
		}
		return;
	}
}
