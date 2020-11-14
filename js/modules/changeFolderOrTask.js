'use strict';

import {tasks} from './variables';
import {renderTasks, renderFolders} from './render';
import {setActiveFolder} from './changeActiveFolder';
import {postData} from './service';

const delOrEditFolderOrTask = function(type, containerClass) {
	const container = document.querySelector(containerClass);
	const activeFolder = tasks.folders[tasks.activeFolder]; // Переменная для облегения обращения к активной папке
	let editableElement;
	container.addEventListener('click', (e) => {
		const element = e.target.parentNode.parentNode.parentNode;
		if (e.target.classList.contains('delete-overlay')) {
			deleteFolderOrTask(type, element);
		} else if(e.target.classList.contains('edit-overlay')) {
			editFolderOrTask(type, element);
		} else if (e.target.classList.contains('edit-save')) {
			editSave(type, element, editableElement);
		} else if (e.target.classList.contains('edit-cancel')) {
			editCancel(type,element, editableElement);
		} else if (e.target.classList.contains('change-overlay')) {
			changeTaskStatus(element);
		}
	});
	/*
	Функция слушает клики в контейнере задач или папок
	1 аргумент - задача или папка
	2 аргумент - класс контейнера задач или папок
	*/

	const deleteFolderOrTask = function(type, element) {
		const elementId = +element.getAttribute('id'); // Id задачи или папки
		if (type === 'task') { // Условие "если элемент - это задача"
			const activeFolder = tasks.folders[tasks.activeFolder]; // Активная задача
			const elementCheckbox = element.querySelector('input[type="checkbox"]'); // Чекбокс задачи
			activeFolder.tasks.splice(elementId, 1); // Вырезаем задачу из массива задач активной папки
			activeFolder.performedTasksID.forEach((id, index) => { // Проверяем, если это была выполненная задача, то
				if (id > elementId) {																 // в массиве выполненных задач уменьшаем Id всех нижестоящих задач
					activeFolder.performedTasksID[index]--;
				}
			});
			if (elementCheckbox.checked) { // Если задача была выполнена, то вырезаем её Id из массива выполненных задач
				activeFolder.performedTasksID.splice(activeFolder.performedTasksID.indexOf(elementId), 1);
			}
			renderTasks(); // Рендер задач
			postData();
		} else if(type === 'folder') { // Условие "если элемент - эт папка"
			for (let folder in tasks.folders) {
				if (elementId == tasks.folders[folder].id) {
					const slisedArrNum = Object.keys(tasks.folders).slice(elementId + 1).map(folder => +folder.slice(-1)); 
					// Массив Id нижестоящих папок 
					slisedArrNum.forEach(numb => { // Копируем объект с Id 'x' в объект с Id 'x - 1' 
						tasks.folders[`folder${numb}`].id = numb - 1;
						tasks.folders[`folder${numb - 1}`] = JSON.parse(JSON.stringify(tasks.folders[`folder${numb}`]));
					});
					delete tasks.folders[`folder${Object.keys(tasks.folders).length - 1}`]; // Удаляем последний объект в tasks.folders
					renderFolders(); // Рендер папок
					tasks.activeFolder = 'folder0'; // Устанавливаем активной папкой первую папку
					setActiveFolder();
					postData();
					break;
				}
			}
		}
	};
	/*
	Функция удаления задачи или папки.
	1 аргумент - какой тип элемента: задача или папка
	2 аргумент - сам элемент задачи или папки
	*/
	const editFolderOrTask = function(type, element) {
		const elementId = +element.getAttribute('id');
		editableElement = element.innerHTML;
		if (type === 'task') {
			element.style.padding = 0;
			addEditFormToTask(element);
		} else if (type === 'folder') {
			tasks.activeFolder = `folder${elementId}`;
			setActiveFolder();
			addEditFormToFolder(element);
		}
	};

	const addEditFormToTask = function(task) {
		let editForm = `
		<div class="right__task-form">
			<input class="right__task-form-input" type="text" value="${task.querySelector('.right__task-text').innerHTML}">
			<div class="right__task-form-buttons">
				<button class="right__task-form-save edit-save primary-button">Сохранить</button>
				<button class="right__task-form-cancel edit-cancel secondary-button">Отмена</button>
			</div>
		</div>
		`;
		task.innerHTML = editForm;
	};

	const addEditFormToFolder = function(folder) {
		let editForm = `
		<div class="left__folder-form">
			<input class="left__folder-form-input" type="text" value="${folder.querySelector('.left__folder-text').innerHTML}">
			<div class="left__folder-form-buttons">
				<button class="left__folder-form-save edit-save primary-button">&#10004;</button>
				<button class="left__folder-form-cancel edit-cancel secondary-button">&#10008;</button>
			</div>
		</div>
		`;
		folder.innerHTML = editForm;
	};

	const editSave = function(type, element, editableElement) {
		const elementId = +element.getAttribute('id');
		const elementInput = element.querySelector('input[type="text"]');
		element.innerHTML = editableElement;
		element.querySelector('.element-text').textContent = elementInput.value;
		if (type === 'task') {
			activeFolder.tasks[elementId] = elementInput.value;
			element.style = '';
		} else if (type === 'folder') {
			tasks.folders[`folder${elementId}`].name = elementInput.value;
			setActiveFolder();
		}
		postData();
	};

	const editCancel = function(type, element, editableElement) {
		element.style = '';
		element.innerHTML = editableElement;
	};

	const changeTaskStatus = function(element) {
		const activeFolder = tasks.folders[tasks.activeFolder];
		const elementId = +element.getAttribute('id');
		const arrId = activeFolder.performedTasksID.indexOf(elementId);
		if (arrId == -1) {
			activeFolder.performedTasksID.push(elementId);
		} else {
			activeFolder.performedTasksID.splice(arrId, 1);
		}
		postData();
	};
};

export {delOrEditFolderOrTask};