#!/usr/bin/env /usr/local/bin/node
const bitbar = require('bitbar');
const request = require('sync-request');

// This plugin displays the next 4 tasks due today
// Clicking the task opens it in Todoist

// TODOIST_API_TOKEN found under settings -> integrations
const TODOIST_API_TOKEN = '';
const DONE_MESSAGE = 'Mindfulness';

try {
  const res = request(
    'GET',
    `https://beta.todoist.com/API/v8/tasks?token=${TODOIST_API_TOKEN}&filter="today"`
  );

  const body = res.getBody();
  if (body) {
    bodyJSON = JSON.parse(body);
  }
  const tasks = [];
  if (bodyJSON && bodyJSON.length) {
    for (var i = 0; i < Math.min(4, bodyJSON.length); i++) {
      if (bodyJSON[i].content) {
        const task = { text: bodyJSON[i].content, color: 'yellow' };
        if (i === 0) {
          tasks.push({ ...task, dropdown: false });
          tasks.push(bitbar.sep);
        }
        tasks.push({ ...task, href: bodyJSON[i].url });
      }
    }
  } else {
    tasks.push({ text: DONE_MESSAGE, color: 'green' });
    tasks.push(bitbar.sep);
    tasks.push('Use breath as an anchor to the present moment.');
  }
  bitbar(tasks);
} catch (err) {
  bitbar(['Error :(']);
}
