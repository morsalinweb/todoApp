        const taskTitleInput = document.getElementById('taskTitleInput');
        const taskCategoryInput = document.getElementById('taskCategoryInput');
        const taskInput = document.getElementById('taskInput');
        const dueDateInput = document.getElementById('dueDateInput');
        const priorityInput = document.getElementById('priorityInput');
        const addTaskButton = document.getElementById('addTaskButton');
        const taskList = document.getElementById('todoList');
        const searchTask = document.getElementById('searchTask');
        const filterCategory = document.getElementById('filterCategory');
        const filterPriority = document.getElementById('filterPriority');

        function addTask() {
            const task = {
                id: Date.now().toString(),
                title: taskTitleInput.value.trim(),
                category: taskCategoryInput.value.trim(),
                description: taskInput.value.trim(),
                priority: priorityInput.value,
                dueDate: dueDateInput.value,
                status: 'pending',
                createdAt: new Date().toLocaleString(),
                updatedAt: null,
                completedAt: null
            };

            if (task.title && task.category && task.description) {
                const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
                tasks.push(task);
                saveTasks(tasks);
                loadTasks();

                taskTitleInput.value = '';
                taskCategoryInput.value = '';
                taskInput.value = '';
                priorityInput.value = 'Low';
                dueDateInput.value = '';

            } else {
                alert("Please fill all fields!");
            }
        }

        function loadTasks() {
            taskList.innerHTML = ''; // Clear previous tasks
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            const categories = new Set();
            const priorities = new Set();

            tasks.forEach(task => {
                createTaskElement(task);
                categories.add(task.category);
                priorities.add(task.priority);
            });

            categoriesOption(categories);
            prioritiesOption(priorities);
        }

        function saveTasks(tasks) {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }

        function createTaskElement(task) {
            const div = document.createElement('div');
            div.classList.add('task-item');
            div.setAttribute('data-id', task.id);

            if (task.status === 'completed') {
                div.classList.add('completed');
            }

            div.innerHTML = `
                <h2 class='title'>${task.title}</h2>
                <p class='category'><strong>Category:</strong> ${task.category}</p>
                <p><strong>Task:</strong> ${task.description}</p>
                <p><strong>Due Date:</strong> ${task.dueDate || 'Not Set'}</p>
                <p class='priority'><strong>Priority:</strong> ${task.priority}</p>
                <p><strong>Status:</strong> ${task.status}</p>
                <p><strong>Updated At:</strong> ${task.updatedAt || 'Not Updated'}</p>
                <p><strong>Completed At:</strong> ${task.completedAt || 'Not Completed'}</p>
                <div class='buttons'>
                    <button class='editButton' onclick="editTask('${task.id}')" ${task.status === 'completed' ? 'disabled' : ''}>
                        ${task.status === 'completed' ? 'Cannot Edit' : 'Edit'}
                    </button>
                    <button class='completeButton' onclick="completeTask('${task.id}')" ${task.status === 'completed' ? 'disabled' : ''}>
                        ${task.status === 'completed' ? 'Completed' : 'Complete'}
                    </button>
                </div>
            `;
            taskList.appendChild(div);
        }

        function categoriesOption(categories) {
            filterCategory.innerHTML = '<option value="">Filter by Category</option>'; // Clear old options
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                filterCategory.appendChild(option);
            });
        }

        function prioritiesOption(priorities) {
            filterPriority.innerHTML = '<option value="">Filter by Priority</option>';
            priorities.forEach(priority => {
                const option = document.createElement('option');
                option.value = priority;
                option.textContent = priority;
                filterPriority.appendChild(option);
            });
        }

        function editTask(taskId) {
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            const taskIndex = tasks.findIndex(t => t.id === taskId);

            if (taskIndex !== -1) {
                const task = tasks[taskIndex];

                taskTitleInput.value = task.title;
                taskInput.value = task.description;
                taskCategoryInput.value = task.category;
                dueDateInput.value = task.dueDate;
                priorityInput.value = task.priority;

                addTaskButton.textContent = 'Update Task';

                addTaskButton.onclick = function () {
                    task.title = taskTitleInput.value.trim();
                    task.description = taskInput.value.trim();
                    task.category = taskCategoryInput.value.trim();
                    task.dueDate = dueDateInput.value;
                    task.priority = priorityInput.value;
                    task.updatedAt = new Date().toLocaleString();
                    task.status = 'In Progress';

                    saveTasks(tasks);
                    loadTasks();

                    // Reset the form
                    taskTitleInput.value = '';
                    taskCategoryInput.value = '';
                    taskInput.value = '';
                    priorityInput.value = 'Low';
                    dueDateInput.value = '';

                    // Reset the button
                    addTaskButton.textContent = 'Add Task';
                    addTaskButton.onclick = addTask;
                };
            }
        }

        function completeTask(taskId) {
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            const taskIndex = tasks.findIndex(t => t.id === taskId);

            if (taskIndex !== -1) {
                tasks[taskIndex].status = 'completed';
                tasks[taskIndex].completedAt = new Date().toLocaleString();

                saveTasks(tasks);

                loadTasks();
            }
        }

        searchTask.addEventListener('input', function () {
            const inputVal = this.value.toLowerCase();
            const taskItems = document.querySelectorAll('.task-item');
            taskItems.forEach(ti => {
                const taskTitle = ti.querySelector('.title').textContent.toLowerCase();
                ti.style.display = taskTitle.includes(inputVal) ? '' : 'none';
            });
        });

        filterCategory.addEventListener('change', function () {
            const categoryVal = this.value;
            const taskItems = document.querySelectorAll('.task-item');
            taskItems.forEach(ti => {
                const taskCategory = ti.querySelector('.category').textContent.split(': ')[1];
                ti.style.display = categoryVal === '' || taskCategory === categoryVal ? '' : 'none';
            });
        });

        filterPriority.addEventListener('change', function () {
            const priorityVal = this.value;
            const taskItems = document.querySelectorAll('.task-item');
            taskItems.forEach(ti => {
                const taskPriority = ti.querySelector('.priority').textContent.split(': ')[1];
                ti.style.display = priorityVal === '' || taskPriority === priorityVal ? '' : 'none';
            });
        });

        addTaskButton.addEventListener('click', addTask);

        window.onload = () => {
            loadTasks();
        };
