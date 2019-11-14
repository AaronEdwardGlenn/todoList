import Component from '../Component.js';
import Header from '../common/Header.js';
import SignUp from './SignUp.js';
import SignIn from './SignIn.js';
import { signUp as userSignUp, signIn as userSignIn } from '../services/todo-api.js';

function success(user) {
    localStorage.setItem('TOKEN', user.token);
    localStorage.setItem('USER', user.displayName);
    const searchParams = new URLSearchParams(location.search);
    location = searchParams.get('redirect') || './todo.html';
}

class App extends Component {

    onRender(dom) {
        const header = new Header();
        dom.prepend(header.renderDOM());
    

        const user = localStorage.getItem('USER');
        if (user) {
            const logout = dom.querySelector('.logout');
            logout.addEventListener('click', () => {
                localStorage.removeItem('TOKEN');
                localStorage.removeItem('USER');
                this.update();
            });
            return;
        }

        const errors = dom.querySelector('.errors');
        const signUpContainer = dom.querySelector('#signup-container');
        const signInContainer = dom.querySelector('#signin-container');
    
        const signUp = new SignUp({
            onSignUp: async newUser => {
                errors.textContent = '';
                try {
                    const user = await userSignUp(newUser);
                    success(user);
                }
                catch (err) {
                    errors.textContent = err;
                    throw err;
                }
            }
        });
        
        signUpContainer.appendChild(signUp.renderDOM());
    
        const signIn = new SignIn({
            onSignIn: async credentials => {
                errors.textContent = '';
                try {
                    const user = await userSignIn(credentials);
                    success(user);
                }
                catch (err) {
                    errors.textContent = err;
                    throw err;
                }
            }
        });
        signInContainer.appendChild(signIn.renderDOM());

        const switchToSignIn = dom.querySelector('#signin-button');
        switchToSignIn.addEventListener('click', () => {
            signInContainer.classList.remove('no-display');
            signUpContainer.classList.add('no-display');
        });
    
        const switchToSignUp = dom.querySelector('#signup-button');
        switchToSignUp.addEventListener('click', () => {
            signUpContainer.classList.remove('no-display');
            signInContainer.classList.add('no-display');
        });
    }


    renderHTML() {
        const user = localStorage.getItem('USER');

        if (user) {
            return /*html*/`
            <div>
                <!-- header goes here -->
                <main>
                    <section class="user-display">
                        <p>
                            Signed in as ${user}
                        </p>
                        <p>
                            <button class="logout">Logout</button>
                        </p>
                    </section>
                </main>
            </div>
        `;
        }

        return /*html*/`
        <div>
            <!-- header goes here -->
            <main>
                <p class="errors"></p>
                
                <section class="no-display" id="signup-container">
                    <p class="switch">
                        <button id="signin-button">Already a User?</button>
                    </p>
                    <!-- SignUp goes here -->
                </section>

                <section id="signin-container">
                    <p class="switch">
                        <button id="signup-button">Need to create an Account?</button>
                    </p>
                    <!-- SignIn goes here -->
                </section>
            </main>
        </div>
    `;
    }
}

export default App; 