import Project from './project';
import { Task, sortTasks } from './task';
import '@fortawesome/fontawesome-free/js/all';

const projectsContainer = document.querySelector('.projects__list');
const projectForm = document.querySelector('.projects__form');
const projectInput = document.querySelector('.projects__form__input');
const tasksContainer = document.querySelector('.todos');
const projectTitle = document.querySelector('.todos__title');
const pendingTasksCounter = document.querySelector('.todos__count');
const projectDeleteButton = document.querySelector('.projects__delete_button');

const taskTemplate = document.getElementById('task-template');
const projectTasks = document.querySelector('.todos__all-tasks');
const taskForm = document.getElementById('todos-form');
const newTaskButton = document.querySelector('.todos__new-task-button');
const taskTitleElement = document.querySelector('.todos__input');
const taskDescriptionElement = document.getElementById('description');
const taskDueDateElement = document.getElementById('due-date');
const taskPriorityElement = document.getElementById('priority');
const taskCreatorElement = document.querySelector('.todos__creator');
const editTaskFormElement = document.getElementById('todos-edit-form');
const taskEditTitleElement = document.getElementById('title2');
const taskEditDescriptionElement = document.getElementById('description2');
const taskEditDueDateElement = document.getElementById('due-date2');
const taskEditPriorityElement = document.getElementById('priority2');

const projectsKey = 'myProjects';
const selectedProjectIdKey = 'mySelectedProjectId';
const selectedTaskIdKey = 'mySelectedTaskId';
let projects = JSON.parse(localStorage.getItem(projectsKey)) || [{ id: Date.now().toString(), name: 'General', tasks: [] }];

let selectedProjectId = JSON.parse(localStorage.getItem(selectedProjectIdKey));
let selectedTaskId = JSON.parse(localStorage.getItem(selectedTaskIdKey));

// Utility Functions
const removeElements = (parentElement) => {
  while (parentElement.lastChild) {
    parentElement.removeChild(parentElement.lastChild);
  }
};

const renderProjects = () => {
  projects.forEach((project) => {
    const projectItem = document.createElement('li');
    projectItem.classList.add('projects__item');
    projectItem.setAttribute('id', `${project.id}`);
    if (project.id === selectedProjectId) {
      projectItem.classList.add('projects__item--active');
    }
    projectItem.innerText = project.name;
    projectsContainer.appendChild(projectItem);
  });
};

const renderTasks = (selectedProject) => {
  selectedProject.tasks.forEach((task) => {
    const taskElement = document.importNode(taskTemplate.content, true);
    const checkBox = taskElement.querySelector('.todos__item');
    checkBox.id = task.id;
    checkBox.checked = task.completed;
    const taskLabel = taskElement.querySelector('.todos__label');
    taskLabel.htmlFor = task.id;
    taskLabel.innerHTML = `${task.name}  &nbsp; - &nbsp;  due on ${task.dueDate}`;
    taskLabel.style.fontWeight = 'bold';
    if (task.priority === 1) {
      taskLabel.style.color = '#ff0000';
    } else if (task.priority === 2) {
      taskLabel.style.color = '#f5f50f';
    } else {
      taskLabel.style.color = '#61f30d';
    }
    const descriptP = taskElement.getElementById('descrip');
    descriptP.innerText = task.description;
    const priorityP = taskElement.getElementById('prio');
    if (task.priority === 1) {
      priorityP.innerText = 'Priority : High';
    } else if (task.priority === 2) {
      priorityP.innerText = 'Priority : Medium';
    } else {
      priorityP.innerText = 'Priority : Low';
    }
    const taskDetails = taskElement.querySelector('.todos__task-details');
    taskDetails.style.display = 'none';
    projectTasks.appendChild(taskElement);
  });
};

const renderPendingTasksCount = (selectedProject) => {
  const pendingTasksCount = selectedProject.tasks.filter((task) => !task.completed).length;
  const pendingTasksDescription = pendingTasksCount === 1 ? 'task' : 'tasks';
  pendingTasksCounter.innerText = `${pendingTasksCount} ${pendingTasksDescription} pending.`;
};

const renderProjectsAndTasks = () => {
  removeElements(projectsContainer);
  renderProjects();
  if (selectedProjectId === null) {
    tasksContainer.style.display = 'none';
  } else {
    tasksContainer.style.display = '';
    const selectedProject = projects.find((project) => project.id === selectedProjectId);
    projectTitle.innerText = selectedProject.name;
    renderPendingTasksCount(selectedProject);
    removeElements(projectTasks);
    renderTasks(selectedProject);
  }
};

const save = () => {
  localStorage.setItem(projectsKey, JSON.stringify(projects));
  localStorage.setItem(selectedProjectIdKey, JSON.stringify(selectedProjectId));
  localStorage.setItem(selectedTaskIdKey, JSON.stringify(selectedTaskId));
};

const saveRender = () => {
  save();
  renderProjectsAndTasks();
};
// Event Listeners
projectForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newProjectValue = projectInput.value;
  if (newProjectValue === null || newProjectValue === '') return;
  const newProject = Project(newProjectValue);
  projects.push(newProject);
  projectInput.value = null;
  saveRender();
});

projectsContainer.addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    selectedProjectId = e.target.id;
    projectTasks.style.display = '';
    newTaskButton.style.display = '';
    taskCreatorElement.classList.add('hide');
    saveRender();
  }
});

projectDeleteButton.addEventListener('click', () => {
  projects = projects.filter((project) => project.id !== selectedProjectId);
  selectedProjectId = null;
  saveRender();
});

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const taskName = taskTitleElement.value;
  const taskDescription = taskDescriptionElement.value;
  const taskDueDate = taskDueDateElement.value;
  const taskPriority = parseInt(taskPriorityElement.value, 10);
  if (taskName === null || taskName === '') return;
  const newTask = Task(taskName, taskDescription, taskDueDate, taskPriority);
  taskTitleElement.value = null;
  taskDescriptionElement.value = null;
  taskDueDateElement.value = null;
  taskPriorityElement.value = null;
  const selectedProject = projects.find((project) => project.id === selectedProjectId);
  selectedProject.tasks.push(newTask);
  sortTasks(selectedProject.tasks);
  saveRender();
  projectTasks.style.display = '';
  newTaskButton.style.display = '';
  taskCreatorElement.classList.add('hide');
});

editTaskFormElement.addEventListener('submit', (e) => {
  e.preventDefault();
  const selectedProject = projects.find((project) => project.id === selectedProjectId);
  const selectedTask = selectedProject.tasks.find((task) => task.id === selectedTaskId);
  const taskName = taskEditTitleElement.value;
  const taskDescription = taskEditDescriptionElement.value;
  const taskDueDate = taskEditDueDateElement.value;
  const taskPriority = parseInt(taskEditPriorityElement.value, 10);

  if (taskName === null || taskName === '') return;
  selectedTask.name = taskName;
  selectedTask.description = taskDescription;
  selectedTask.dueDate = taskDueDate;
  selectedTask.priority = taskPriority;
  sortTasks(selectedProject.tasks);
  saveRender();
  projectTasks.style.display = '';
  newTaskButton.style.display = '';
  taskCreatorElement.classList.add('hide');
});

projectTasks.addEventListener('click', (e) => {
  const activeProject = projects.find((project) => project.id === selectedProjectId);

  if (e.target.tagName === 'INPUT') {
    const selectedTask = activeProject.tasks.find((task) => task.id === e.target.id);
    selectedTaskId = selectedTask.id;
    selectedTask.completed = e.target.checked;
    save();
    renderPendingTasksCount(activeProject);
  } else if (e.target.dataset.id === 'deleteSelectedTask') {
    const activeCheckBox = e.target.parentNode.firstChild.firstChild;
    activeProject.tasks = activeProject.tasks.filter((task) => !(task.id === activeCheckBox.id));
    saveRender();
  } else if (e.target.tagName === 'LABEL') {
    const taskDetails = e.target.parentNode.parentNode.parentNode.lastChild;
    e.target.style.fontSize = '1.4rem';
    taskDetails.style.display = '';
  } else if (e.target.id === 'edit') {
    taskCreatorElement.classList.remove('hide');
    taskForm.style.display = 'none';
    editTaskFormElement.style.display = '';
    projectTasks.style.display = 'none';
    newTaskButton.style.display = 'none';
    const activeTask = activeProject.tasks.find((task) => task.id === selectedTaskId);
    taskEditTitleElement.value = `${activeTask.name}`;
    taskEditDescriptionElement.value = `${activeTask.description}`;
    taskEditPriorityElement.value = activeTask.priority;
    taskEditDueDateElement.value = activeTask.dueDate;
  }
});

newTaskButton.addEventListener('click', () => {
  taskCreatorElement.classList.remove('hide');
  editTaskFormElement.style.display = 'none';
  projectTasks.style.display = 'none';
  newTaskButton.style.display = 'none';
});

taskCreatorElement.addEventListener('click', (e) => {
  if (e.target.id === 'close') {
    taskCreatorElement.classList.add('hide');
    projectTasks.style.display = '';
    newTaskButton.style.display = '';
  }
});
renderProjectsAndTasks();