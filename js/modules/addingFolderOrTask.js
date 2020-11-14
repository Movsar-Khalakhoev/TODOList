'use strict';

import {tasks, folderFormColors} from './variables';
import {renderTasks, renderFolders} from './render';
import {setActiveFolder} from './changeActiveFolder';
import {postData} from './service';

//--------------------------------------------------------------------------------------
const addingFolderOrTask = function(type, buttonClass, inputClass, formClass) {
	const addingButton = document.querySelector(buttonClass);  // Кнопка добавления папки или задачи
	const createForm = document.querySelector(formClass); // Форма добавления папки или задачи
	
	let color; // Переменная, в которую заносится выбранный цвет для папки

	function arrayRandElement(arr) { 
		const rand = Math.floor(Math.random() * arr.length);
		return arr[rand];
	}
	/*
	Функция, которая выбирает рандомный цвет для папки в случае если он не выбран
	*/
	
	addingButton.addEventListener('click', () => {
		const input = document.querySelector(inputClass); // Input формы добавления папки или задачи
		
		if (input.value.trim() && type === 'folder') { // Проверка "есть ли в инпуте что-нибудь"
			const newFolderName = `folder${Object.keys(tasks.folders).length}`; // Новое название папки
			tasks.folders[newFolderName] = {}; // Создание новой папки в переменной tasks.folders
			tasks.folders[newFolderName].name = input.value.trim(); // Занесение имени в созданную папку
			tasks.folders[newFolderName].id = Object.keys(tasks.folders).length - 1; // Занесение id в созданную папку
			if (createForm.querySelector(':checked')) { // Проверка "выбран ли какой-нибудь цвет"
				tasks.folders[newFolderName].circleColor = color; // Занесение выбранного цвета в созданную папку
				createForm.querySelector(':checked').checked = false; // Сброс выбранного цвета
			} else {
				tasks.folders[newFolderName].circleColor = arrayRandElement(folderFormColors); 
				//Занесение случайного цвета в созданную папку в случае если цвет не выбран 
			}
			tasks.folders[newFolderName].tasks = []; // Создание массива для задач
			tasks.folders[newFolderName].performedTasksID = []; // Создание массива для индексов выполненных задач
			renderFolders();
			tasks.activeFolder = `folder${Object.keys(tasks.folders).length - 1}`;
			// Устанавливаем активной папкой только что добавленную
			setActiveFolder();
		} else if (input.value.trim() && type === 'task') {
			const activeFolder = tasks.folders[tasks.activeFolder]; // Активная папка
			activeFolder.tasks.push(input.value.trim());
			renderTasks();
			input.focus();
		}
		postData();
		createForm.querySelector('.input-after').style.backgroundColor = '#4DD599';
		// Изменеиня цвета полоски на зеленый
		input.value = '';
	});

	let maxLength; // Максимальное количетсво символов в Input
	
	if (type === 'folder') {
		maxLength = 23;
		document.querySelector('.left__creating-colors').addEventListener('click', (e) => { 
			// Слушатель для установки выбираемого цвета в переменную color
			if (e.target.classList.contains('left__creating-radio')) {
				color = e.target.style.backgroundColor;
			}
		});
	} else {
		maxLength = 110;
	}
	const input = createForm.querySelector('input[type="text"]'); 
	// Input из формы добавления папки или задачи
	
	input.addEventListener('input', () => { // Слушатель для инпута
		if (input.value.length > maxLength) { // Проверка на количество символов в input
			input.value = input.value.substring(0, input.value.length - 1); // Удаление последнего символа
			createForm.querySelector('.input-after').style.backgroundColor = '#DC143C'; 
			// Изменеиня цвета полоски на красный
		} else {
			createForm.querySelector('.input-after').style.backgroundColor = '#4DD599';
			// Изменеиня цвета полоски на зеленый
		}
	});
};
//--------------------------------------------------------------------------------------

export {addingFolderOrTask};