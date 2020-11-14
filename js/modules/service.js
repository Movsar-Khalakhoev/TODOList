'use strict';

import {tasks} from './variables';

const postData = function() {
	fetch('http://localhost:3000/tasks', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify(tasks)
	});
};

export {postData};