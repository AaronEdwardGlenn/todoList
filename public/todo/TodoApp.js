import Component from '../Component.js';
import Header from '../common/Header.js';
import Loading from '../common/Loading.js';
import AddTodo from './AddTodo.js';
import TodoList from './TodoList.js';
import { getTodos, addTodo, updateTodo, removeTodo } from '../services/todo-api.js';

class TodoApp extends Component {

    async onRender(dom) {
        const header = new Header({ title: 'Things I Need Todos' });
        dom.prepend(header.renderDOM());
        
        const main = dom.querySelector('main');
        const error = dom.querySelector('.error');

        const loading = new Loading({ loading: true });
        dom.appendChild(loading.renderDOM());
//Instantiate Form Component
        const addTodoComponent = new AddTodo({
            onAdd: async newTodo => {
                loading.update({ loading: true });
                error.textContent = '';

                try {
                    const thisTodo = await addTodo(newTodo);
                    const todos = this.state.todos;
                    todos.push(thisTodo);
                    todoList.update({ todos }); //???
                }
                catch (err) {
                    // display error
                    error.textContent = err;
                    // rethrow the error so form knows not to clear the input:
                    throw err;
                }
                finally {
                    loading.update({ loading: false });
                }
            },
            
        });
//renderDOM
        main.appendChild(addTodoComponent.renderDOM());

//Instantiate List Component
        const todoList = new TodoList({ 
            todos: [],
            onUpdate: async todo => {
                loading.update({ loading: true });
                error.textcontent = '';

        // initial todo load:
                try {
                    const todos = await updateTodo();
                    //saving state
                    const todoState = this.state.todos;
                    const index = todoState.indexOf(todo);
                    todos.splice(index, 1, todos); //removed updated as 3rd param
                    todos.push(todo);
                    todoList.update({ todos });
                }
                catch (err) {
                    console.log(err); }
                finally {
                    loading.update({ loading: false });
                }
            },
            onRemove: async todo => {
                loading.update({ loading: true });
                error.textContent = '';
    
                try {
                    await removeTodo(todo.id);
                    const todos = this.state.todos;
                    const index = todos.indexOf(todo);
                    todos.splice(index, 1);
                    
                }
    
                catch (err) {
                    //main.appendChild(err.renderDOM());
                        // display error
                    error.textContent = err;
                        // rethrow the error so form knows not to clear the input:
                    throw err;
                }
                finally {
                    loading.update({ loading: false });
                }
            }
        });

        main.appendChild(todoList.renderDOM());

//default load:
        try {
            const todos = await getTodos();
            this.state.todos = todos;

            todoList.update({ todos });
        }
        catch (err) {

            //main.appendChild(error.renderDOM());
            console.log (err);
        }
        finally {
            loading.update({ loading: false });
        }
    }

    renderHTML() {
        return /*html*/`
            <div>
                <!-- header goes here -->
                <!-- show errors: -->
                <p class="error"></p>
                <main>
                    <!-- add todo goes here -->
                    <!-- todo list goes here -->
                </main>
            </div>
        `;
    }
}

export default TodoApp;