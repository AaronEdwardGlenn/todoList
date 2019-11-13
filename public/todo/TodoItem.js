import Component from '../Component.js';


class TodoItem extends Component {

    onRender(list) {
        const todo = this.props.todo;
        const onUpdate = this.props.onUpdate;
        const onRemove = this.props.onRemove;

        const checkbox = list.querySelector('input[name=is-complete]');
        checkbox.addEventListener('click', () => {
            todo.complete = !todo.complete;
            onUpdate(todo);
        });

        const deleteButton = list.querySelector('.delete-button');
        deleteButton.addEventListener('click', () => {
            const confirmed = confirm(`Are you sure you want to remove "${todo.task}"?`);
            if (confirmed) {
                onRemove(todo);
                location.reload(); 
            }
        });
        
    }

    renderHTML() {
        const todo = this.props.todo;

        return /*html*/`
            <li class='todo-item'>
                <div><input id="is-complete" name="is-complete" type="checkbox"></div>
                <div class='task-container'>
                    <p>"${todo.task}"</p>
                </div>
                <div><button class='delete-button'>delete</button></div>
            </li>
        `;
    }
}

export default TodoItem;