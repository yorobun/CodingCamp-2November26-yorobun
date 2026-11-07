// --- Tantangan 1: Light / Dark Mode ---
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const currentTheme = localStorage.getItem('theme') || 'light';

if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggleBtn.innerText = '☀️ Light Mode';
}

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    let theme = 'light';
    if (document.body.classList.contains('dark-mode')) {
        theme = 'dark';
        themeToggleBtn.innerText = '☀️ Light Mode';
    } else {
        themeToggleBtn.innerText = '🌙 Dark Mode';
    }
    localStorage.setItem('theme', theme);
});

// --- Clock & Greeting ---
function updateClock() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString();
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('date').innerText = now.toLocaleDateString('en-US', options);
    
    const hours = now.getHours();
    let greetingText = "Good Morning";
    if (hours >= 12 && hours < 18) {
        greetingText = "Good Afternoon";
    } else if (hours >= 18) {
        greetingText = "Good Evening";
    }
    document.getElementById('greeting').innerText = greetingText;
}
setInterval(updateClock, 1000);
updateClock();


// --- Tantangan 2: CUstom Name in Greeting ---
const userNameDisplay = document.getElementById('user-name-display');
const nameInputContainer = document.getElementById('name-input-container');
const nameInput = document.getElementById('name-input');
const saveNameBtn = document.getElementById('save-name-btn');
const editNameBtn = document.getElementById('edit-name-btn');

let userName = localStorage.getItem('userName') || '';

function updateNameDisplay() {
    if (userName) {
        userNameDisplay.innerText = `, ${userName}`;
        nameInputContainer.classList.add('hidden');
    } else {
        userNameDisplay.innerText = '';
    }
}
updateNameDisplay();

editNameBtn.addEventListener('click', () => {
    nameInputContainer.classList.toggle('hidden');
    nameInput.value = userName;
});

saveNameBtn.addEventListener('click', () => {
    userName = nameInput.value.trim();
    localStorage.setItem('userName', userName);
    updateNameDisplay();
});


// --- Focus Timer & Tantangan 3: Change Podomoro Time ---
let timerInterval;
let defaultMinutes = parseInt(localStorage.getItem('pomodoroTime')) || 25;
let timeLeft = defaultMinutes * 60;
const timerDisplay = document.getElementById('timer-display');
const timerDurationInput = document.getElementById('timer-duration');

timerDurationInput.value = defaultMinutes;

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
updateTimerDisplay();

document.getElementById('set-duration-btn').addEventListener('click', () => {
    let customMins = parseInt(timerDurationInput.value);
    if (customMins > 0) {
        defaultMinutes = customMins;
        localStorage.setItem('pomodoroTime', defaultMinutes);
        clearInterval(timerInterval);
        timerInterval = null;
        timeLeft = defaultMinutes * 60;
        updateTimerDisplay();
    }
});

document.getElementById('start-btn').addEventListener('click', () => {
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                timerInterval = null;
                alert("Focus time is up! Take a break.");
            }
        }, 1000);
    }
});

document.getElementById('stop-btn').addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
});

document.getElementById('reset-btn').addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = defaultMinutes * 60;
    updateTimerDisplay();
});


// --- 3. To-Do List (Local Storage) ---
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <label>
                <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask(${index})">
                <span>${task.text}</span>
            </label>
            <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
        `;
        taskList.appendChild(li);
    });
}

addTaskBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (text !== '') {
        tasks.push({ text: text, completed: false });
        taskInput.value = '';
        saveTasks();
        renderTasks();
    }
});

window.toggleTask = function(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
};

window.deleteTask = function(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
};

renderTasks();


// --- 4. QUICK LINKS (Local Storage) ---
const linkNameInput = document.getElementById('link-name');
const linkUrlInput = document.getElementById('link-url');
const addLinkBtn = document.getElementById('add-link-btn');
const linksContainer = document.getElementById('links-container');

let links = JSON.parse(localStorage.getItem('links')) || [
    { name: 'Google', url: 'https://www.google.com' },
    { name: 'Gmail', url: 'https://mail.google.com' },
    { name: 'Calendar', url: 'https://calendar.google.com' }
];

function saveLinks() {
    localStorage.setItem('links', JSON.stringify(links));
}

function renderLinks() {
    linksContainer.innerHTML = '';
    links.forEach((link) => {
        const a = document.createElement('a');
        a.className = 'quick-link-btn';
        a.href = link.url;
        a.target = '_blank';
        a.innerText = link.name;
        linksContainer.appendChild(a);
    });
}

addLinkBtn.addEventListener('click', () => {
    const name = linkNameInput.value.trim();
    let url = linkUrlInput.value.trim();
    if (name !== '' && url !== '') {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        links.push({ name, url });
        linkNameInput.value = '';
        linkUrlInput.value = '';
        saveLinks();
        renderLinks();
    }
});

renderLinks();