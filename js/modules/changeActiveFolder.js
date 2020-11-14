'use strict';

import {tasks} from './variables';
import {renderTasks} from './render';
import {postData} from './service';

const changeActiveFolder = function() {
	document.querySelector('.left__folders').addEventListener('click', (e) => {
		if (e.target.classList.contains('left__folder-overlay')) {
			tasks.activeFolder = `folder${e.target.parentNode.getAttribute('id')}`;
			setActiveFolder();
			postData();
		}
	});
};

function setActiveFolder(id = tasks.activeFolder) {
	if (Object.keys(tasks.folders).length == 0) {
		document.querySelector('.right__header-text').textContent = '';
		document.querySelector('.right__tasks').textContent = 'Задачии отсутствуют';
		document.querySelector('.right__create').style.display = 'none';
		document.querySelector('.right__header').style.display = 'none';
		document.querySelector('.right__tasks').style.cssText = 'border: none; font-size: 25px; color: #767676; margin-top: 80px;';
		return;
	} else {
		document.querySelector('.right__create').style = '';
		document.querySelector('.right__header').style = '';
		document.querySelector('.right__tasks').style = '';
	}
	for (let folder in tasks.folders) { // Заносим в объект tasks техническое название активируемой папки
		if (tasks.folders[folder].id == id) {
			tasks.activeFolder = folder;
		}
	}
	const activeFolder = tasks.folders[tasks.activeFolder]; // Переменная для облегения обращения к активной папке


	document.querySelectorAll('.left__folder').forEach(folder => { // Подсветка активируемой папки
		folder.id == activeFolder.id ?
			folder.classList.add('left__folder-active')
		:
			folder.classList.remove('left__folder-active');

	});
	document.querySelector('.right__header-text').textContent = activeFolder.name;
	// Смена заголовка на заголовок активируемой папки
	renderTasks(); // Рендер задач из активируемой папки
}

export {changeActiveFolder};
export {setActiveFolder};