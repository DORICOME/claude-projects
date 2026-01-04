class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.filterBtns = document.querySelectorAll('.filter-btn');

        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.render();
            });
        });

        this.render();
    }

    addTodo() {
        const text = this.todoInput.value.trim();
        if (text === '') {
            alert('タスクを入力してください');
            return;
        }

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.push(todo);
        this.todoInput.value = '';
        this.saveTodos();
        this.render();
    }

    deleteTodo(id) {
        if (confirm('このタスクを削除しますか？')) {
            this.todos = this.todos.filter(todo => todo.id !== id);
            this.saveTodos();
            this.render();
        }
    }

    toggleTodo(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }

    editTodo(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            const newText = prompt('タスクを編集:', todo.text);
            if (newText !== null && newText.trim() !== '') {
                todo.text = newText.trim();
                this.saveTodos();
                this.render();
            }
        }
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            default:
                return this.todos;
        }
    }

    render() {
        const filteredTodos = this.getFilteredTodos();
        this.todoList.innerHTML = '';

        if (filteredTodos.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.padding = '20px';
            emptyMessage.style.color = '#999';
            emptyMessage.textContent = 'タスクがありません';
            this.todoList.appendChild(emptyMessage);
        } else {
            filteredTodos.forEach(todo => {
                const li = document.createElement('li');
                li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'todo-checkbox';
                checkbox.checked = todo.completed;
                checkbox.addEventListener('change', () => this.toggleTodo(todo.id));

                const span = document.createElement('span');
                span.className = 'todo-text';
                span.textContent = todo.text;

                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'todo-actions';

                const editBtn = document.createElement('button');
                editBtn.className = 'edit-btn';
                editBtn.textContent = '編集';
                editBtn.addEventListener('click', () => this.editTodo(todo.id));

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.textContent = '削除';
                deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));

                actionsDiv.appendChild(editBtn);
                actionsDiv.appendChild(deleteBtn);

                li.appendChild(checkbox);
                li.appendChild(span);
                li.appendChild(actionsDiv);

                this.todoList.appendChild(li);
            });
        }

        this.updateStats();
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(todo => todo.completed).length;
        const active = total - completed;

        document.getElementById('totalTasks').textContent = `総タスク数: ${total}`;
        document.getElementById('completedTasks').textContent = `完了: ${completed}`;
        document.getElementById('activeTasks').textContent = `未完了: ${active}`;
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
