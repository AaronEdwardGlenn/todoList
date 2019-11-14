import Component from '../Component.js';

class AddTodo extends Component {

    onRender(formDom) {
        const onAdd = this.props.onAdd;
        const form = formDom.querySelector('form');
        const input = formDom.querySelector('input[name=newTodo]');
        
        form.addEventListener('submit', async event => {
            event.preventDefault();
            const newTodo = {
                task: input.value,
                complete: false
            };

            try {
                await onAdd(newTodo);
                // this only runs if no error:
                form.reset();
                document.activeElement.blur();
            }
            catch (err) {
                // nothing to do as App will show error,
                // but will keep form from clearing...
            }
        });
    }

    renderHTML() {
        return /*html*/`
        <section class="form-section">
        <form>
            <input name="newTodo" required>
            <button>Add New Task</button>
        </form>
    </section>
        `;
    }
}

export default AddTodo;