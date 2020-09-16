function initFormValidation() {
	console.log('something -->');
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

			//submit form. Insert fetch request code here
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

initFormValidation();
