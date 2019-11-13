import Component from '../Component.js';
import TodoItem from './TodoItem.js';

class TodoList extends Component {
    
    onRender(list) {
        const todos = this.props.todos;
        const onUpdate = this.props.onUpdate;
        const onRemove = this.props.onRemove;

        todos.forEach(todo => {
            
            const todoItem = new TodoItem({ todo, onUpdate, onRemove });
            list.appendChild(todoItem.renderDOM());
        });
        
    }
    renderHTML() {
        return /*html*/`
            <ul class="todo-list"></ul>
        `;
    }
}

export default TodoList;