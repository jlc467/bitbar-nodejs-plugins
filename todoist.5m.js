#!/usr/bin/env /usr/local/bin/node
const bitbar = require('bitbar');
const request = require('sync-request');

// This plugin displays the next 4 tasks due today
// Clicking the task opens it in Todoist

// TODOIST_API_TOKEN found under settings -> integrations
const TODOIST_API_TOKEN = '';
const DONE_MESSAGE = 'Mindfulness';

try {
  const body = request(
    'GET',
    `https://beta.todoist.com/API/v8/tasks?token=${TODOIST_API_TOKEN}&filter="today"`
  ).getBody();

  if (!body) {
    throw new Error('No body found');
  }
  const tasks = JSON.parse(body);
  const bitbarItems = [];
  if (tasks && tasks.length) {
    const sortedTasks = tasks.sort((a, b) => b.priority - a.priority);
    for (let i = 0; i < Math.min(4, sortedTasks.length); i++) {
      const { content, priority, url } = sortedTasks[i];
      const bitbarItem = {
        text: priority === 4 ? `⚡${content}⚡` : content,
        color: priority === 4 ? '#CD0005' : 'yellow'
      };
      if (i === 0) {
        bitbarItems.push({ ...bitbarItem, dropdown: false });
        bitbarItems.push(bitbar.sep);
      }
      bitbarItems.push({ ...bitbarItem, href: url });
    }
  } else {
    bitbarItems.push({ text: DONE_MESSAGE, color: 'green' });
    bitbarItems.push(bitbar.sep);
    bitbarItems.push('Use breath as an anchor to the present moment.');
  }
  bitbar(bitbarItems);
} catch (err) {
  bitbar(['Error :(']);
}
