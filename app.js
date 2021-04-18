import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const tasksLeftSpan = document.querySelector('h2 span');
const form = document.querySelector('form');
const textInput = document.querySelector('form input');
const searchbar = document.querySelector('input.searchbar');
const ulElement = document.querySelector('.ul-list');

const tasksArr = [];

class Task {
   constructor(id, text){
      this.id = id;
      this.text = text;
   }
   
   displayTask = () => {
      const newTask = document.createElement('li');
      newTask.textContent = this.text;
      ulElement.appendChild(newTask);
      tasksLeftSpan.textContent = tasksArr.length;
   
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'REMOVE';
      newTask.appendChild(removeBtn);
      removeBtn.addEventListener('click', (e) => this.removeTask(e));
   }
   
   removeTask = (e) => {
      const tasksInStorage = localStorage.getItem('tasks');
      const tasksParsed = JSON.parse(tasksInStorage);
      const index = tasksParsed.findIndex(task => task.id === this.id);
      tasksArr.splice(index, 1);
      saveTasksToLocalStorage();
      
      e.target.parentNode.remove();
      tasksLeftSpan.textContent = tasksArr.length;
   }
}

const saveTasksToLocalStorage = () => {
   const tasksArrStringified = JSON.stringify(tasksArr);
   localStorage.setItem('tasks', tasksArrStringified);
}

const displayTasksFromStorage = () => {
   const tasksFromStorage = localStorage.getItem('tasks');
   const tasksFromStorageParsed = JSON.parse(tasksFromStorage);
   tasksArr.push(...tasksFromStorageParsed);

   for(let i=0; i < tasksArr.length; i++){
      const taskFromStorage = new Task(tasksArr[i].id, tasksArr[i].text);
      taskFromStorage.displayTask();
   }
}

const init = () => {
   displayTasksFromStorage();
   tasksLeftSpan.textContent = tasksArr.length;
}

const handleSubmit = (e) => {
   e.preventDefault();
   const newTask = new Task(uuidv4(), textInput.value);
   tasksArr.push(newTask);
   newTask.displayTask();
   saveTasksToLocalStorage();
   textInput.value = '';
}

const handleSearch = () => {
   ulElement.innerHTML = '';
   const filteredTasks = tasksArr.filter(task => task.text.includes(searchbar.value));
   filteredTasks.forEach(task => {
      const newTask = new Task(task.id, task.text);
      newTask.displayTask();
   });
}

init();
form.addEventListener('submit', (e) => handleSubmit(e));
searchbar.addEventListener('input', (e) => handleSearch(e));