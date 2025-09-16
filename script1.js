     /* Elements Reference*/
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const clearBtn = document.getElementById('clearBtn');
    const status = document.getElementById('status');

    /* -------------------------
       DATA: tasks array
       Each task is an object:
         { id: number, text: string, completed: boolean }
       Using an array so we can save/restore from localStorage easily.
       ------------------------- */
    let tasks = [];

    /* -------------------------
       LOCAL STORAGE HELPERS
       ------------------------- */
    const STORAGE_KEY = 'my_todo_tasks_v1'; // key used in localStorage

    // Save tasks array to localStorage as JSON
    function saveTasks() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }

    // Load tasks from localStorage (if any) and parse them back to array
    function loadTasks() {
      const raw = localStorage.getItem(STORAGE_KEY);
      tasks = raw ? JSON.parse(raw) : [];
      renderTasks(); // after loading, show them on the page
    }

    /* -------------------------
       RENDERING: create DOM for a single task
       ------------------------- */
    function createTaskElement(task) {
      // <li>
      const li = document.createElement('li');
      li.className = 'task-item';
      li.dataset.id = task.id; // save id on DOM for debugging if needed

      // checkbox to toggle completion
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.addEventListener('change', () => {
        // when checkbox changes, toggle completed value and re-render/save
        toggleComplete(task.id);
      });

      // span that shows task text
      const span = document.createElement('span');
      span.className = 'task-text' + (task.completed ? ' completed' : '');
      span.textContent = task.text;

      // Edit button - uses a prompt for simplicity
      const editBtn = document.createElement('button');
      editBtn.className = 'small-btn';
      editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', () => editTask(task.id));

      // Delete button - removes only this task
      const delBtn = document.createElement('button');
      delBtn.className = 'small-btn';
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', () => deleteTask(task.id));

      // append elements to li in desired order
      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(editBtn);
      li.appendChild(delBtn);

      return li;
    }

    /* -------------------------
       RENDER ALL TASKS
       Clears existing list and appends current tasks
       ------------------------- */
    function renderTasks() {
      // clear existing
      taskList.innerHTML = '';

      if (tasks.length === 0) {
        status.textContent = 'No tasks yet — add something!';
        return;
      } else {
        status.textContent = ''; // clear empty message
      }

      // append each task element created above
      tasks.forEach(task => {
        const el = createTaskElement(task);
        taskList.appendChild(el);
      });
    }

    /* -------------------------
       ADD TASK
       - triggered on form submit
       - validation: trim and disallow empty strings
       ------------------------- */
    function addTask(event) {
      event.preventDefault(); // prevent page reload from form submit

      const text = taskInput.value.trim(); // remove leading/trailing spaces

      if (text === '') {
        // simple inline feedback instead of alert
        status.textContent = 'Please enter a task before adding.';
        return;
      }

      // create a task object. Using Date.now() for a simple unique id
      const newTask = {
        id: Date.now(),
        text: text,
        completed: false
      };

      tasks.push(newTask);  // add to array
      saveTasks();          // persist to localStorage
      renderTasks();        // update UI
      taskInput.value = ''; // clear input for next task
      taskInput.focus();    // focus input to speed up adding
    }

    /* -------------------------
       TOGGLE COMPLETE
       flips completed boolean for a task by id
       ------------------------- */
    function toggleComplete(id) {
      const t = tasks.find(x => x.id === id);
      if (!t) return;
      t.completed = !t.completed;
      saveTasks();
      renderTasks();
    }

    /* -------------------------
       DELETE SINGLE TASK
       ------------------------- */
    function deleteTask(id) {
      // keep all tasks except the one with this id
      tasks = tasks.filter(x => x.id !== id);
      saveTasks();
      renderTasks();
    }

    /* -------------------------
       EDIT TASK
       Here we use a prompt to keep code simple for learning.
       You can replace prompt with inline editing later.
       ------------------------- */
    function editTask(id) {
      const t = tasks.find(x => x.id === id);
      if (!t) return;

      const newText = prompt('Edit task:', t.text);
      // If user pressed Cancel, prompt returns null -> do nothing
      if (newText === null) return;

      const trimmed = newText.trim();
      if (trimmed === '') {
        // If they cleared all text, ignore or you could delete instead.
        status.textContent = 'Task not updated — text cannot be empty.';
        return;
      }

      t.text = trimmed;
      saveTasks();
      renderTasks();
    }

    /* -------------------------
       CLEAR ALL TASKS
       ------------------------- */
    function clearAll() {
      if (!confirm('Clear ALL tasks?')) return; // confirm to avoid accidents
      tasks = [];
      saveTasks();
      renderTasks();
    }

    /* -------------------------
       EVENT LISTENERS
       - form submit for adding
       - clear button for clearing all
       - load tasks when page loads
       ------------------------- */
    taskForm.addEventListener('submit', addTask);
    clearBtn.addEventListener('click', clearAll);

    // load from localStorage on page load
    loadTasks();