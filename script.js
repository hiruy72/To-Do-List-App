document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const taskCounter = document.getElementById('taskCounter');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';
    
    
    function renderTasks() {
        taskList.innerHTML = '';
        
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'all') return true;
            if (currentFilter === 'active') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            return true;
        });
        
        filteredTasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.className = 'task-item';
            
            taskItem.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
                <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
                <div class="task-actions">
                    <button class="edit-btn" data-id="${task.id}"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" data-id="${task.id}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            
            taskList.appendChild(taskItem);
        });
        
        updateTaskCounter();
    }
    

    function updateTaskCounter() {
        const activeTasks = tasks.filter(task => !task.completed).length;
        taskCounter.textContent = `${activeTasks} ${activeTasks === 1 ? 'task' : 'tasks'} remaining`;
    }
    
   
    function addTask() {
        const text = taskInput.value.trim();
        if (text) {
            const newTask = {
                id: Date.now(),
                text,
                completed: false
            };
            tasks.push(newTask);
            saveTasks();
            taskInput.value = '';
            renderTasks();
        }
    }
    
 
    function toggleTaskCompletion(taskId) {
        tasks = tasks.map(task => {
            if (task.id === taskId) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        saveTasks();
        renderTasks();
    }
    

    function editTask(taskId) {
        const task = tasks.find(task => task.id === taskId);
        if (!task) return;
        
        const newText = prompt('Edit your task:', task.text);
        if (newText !== null && newText.trim() !== '') {
            task.text = newText.trim();
            saveTasks();
            renderTasks();
        }
    }
    

    function deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            tasks = tasks.filter(task => task.id !== taskId);
            saveTasks();
            renderTasks();
        }
    }
    
 
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    

    function setActiveFilter(filter) {
        currentFilter = filter;
        filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        renderTasks();
    }
    
    // Event listeners
    addTaskBtn.addEventListener('click', addTask);
    
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    taskList.addEventListener('click', function(e) {
        if (e.target.classList.contains('task-checkbox')) {
            const taskId = parseInt(e.target.dataset.id);
            toggleTaskCompletion(taskId);
        } else if (e.target.classList.contains('edit-btn') || e.target.closest('.edit-btn')) {
            const btn = e.target.classList.contains('edit-btn') ? e.target : e.target.closest('.edit-btn');
            const taskId = parseInt(btn.dataset.id);
            editTask(taskId);
        } else if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
            const btn = e.target.classList.contains('delete-btn') ? e.target : e.target.closest('.delete-btn');
            const taskId = parseInt(btn.dataset.id);
            deleteTask(taskId);
        }
    });
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            setActiveFilter(this.dataset.filter);
        });
    });
    
    // Initial render
    renderTasks();
});