const client = require('../lib/client');
// import our seed data:
const todos = require('./todos');

const users = require('./users');

run();

async function run() {

    try {
        await client.connect();


        await Promise.all(
            todos.map(todo => {
                return client.query(`
                    INSERT INTO todos (task, complete)
                    VALUES ($1, $2);
                `,
                [todo.task, todo.complete]);
            }),
        );
        
        await Promise.all(
            users.map(user => {
                return client.query(`
                    INSERT INTO users (id, email, hash, display_name)
                    VALUES ($1, $2, $3, $4);
                `,
                [user.id, user.email, user.hash, user.display_name]);
            })
        );

            
        console.log('seed data load complete');
    }
    catch (err) {
        console.log(err);
    }
    finally {
        client.end();
    }
    
}
