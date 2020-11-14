'use strict';

//--------------------------------------------------------------------------------------
const showForms = function(form, activeClass, toggleClasses = [], openClasses = [], closeClasses = []) {

	const addFolderForm = document.querySelector(form);

	const toggleElements = [];
	const openElements = [];
	const closeElements = [];

	if (toggleClasses) {
		toggleClasses.forEach(toggleClass => toggleElements.push(document.querySelector(toggleClass)));

		toggleElements.forEach(togglable => {
			togglable.addEventListener('click', () => {
				addFolderForm.classList.toggle(activeClass);
				addFolderForm.querySelector('input[type="text"]').focus();
			});
		});
	}
	if (openClasses) {
		openClasses.forEach(openClass => openElements.push(document.querySelector(openClass)));

		openElements.forEach(openable => {
			openable.addEventListener('click', () => {
				addFolderForm.classList.add(activeClass);
			});
		});
	}
	if (closeClasses) {
		closeClasses.forEach(closeClass => closeElements.push(document.querySelector(closeClass)));

		closeElements.forEach(closable => {
			closable.addEventListener('click', () => {
				addFolderForm.classList.remove(activeClass);
			});
		});
	}
	
};
//--------------------------------------------------------------------------------------

export {showForms};

