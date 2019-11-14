// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const client = require('./lib/client');
// Initiate database connection
client.connect();
//Auth
const ensureAuth = require('./lib/auth/ensure-auth');
const createAuthRoutes = require('./lib/auth/create-auth-routes');

const authRoutes = createAuthRoutes({
    selectUser(email) {
        return client.query(`
            SELECT id, email, hash, display_name as "displayName" 
            FROM users
            WHERE email = $1;
        `,
        [email]
        ).then(result => result.rows[0]);
    },
    insertUser(user, hash) {
        return client.query(`
            INSERT into users (email, hash, display_name)
            VALUES ($1, $2, $3)
            RETURNING id, email, hash, display_name as "displayName";
        `,
        [user.email, hash, user.displayName]
        ).then(result => result.rows[0]);
    }
});


// Application Setup
const app = express();
const PORT = process.env.PORT;
app.use(morgan('dev')); // http logging
app.use(cors()); // enable CORS request
app.use(express.static('public')); // server files from /public folder
app.use(express.json()); // enable reading incoming json data


// before ensure auth, but after other middleware:
app.use('/api/auth', authRoutes);
app.use('/api', ensureAuth);

app.get('/api/test', (req, res) => {
    res.json({
        message: `the user's id is ${req.userId}`
    });
});

// API Routes

// *** TODOS ***
app.get('/api/todos', async(req, res) => {

    try {
        const result = await client.query(`
            SELECT *
            FROM todos
            WHERE user_id = $1; 
        `, 
        [req.userId]);

        res.json(result.rows);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }

});


app.post('/api/todos', async(req, res) => {
    const todo = req.body;

    try {
        const result = await client.query(`
            INSERT INTO todos (task, complete, user_id)
            VALUES ($1, $2, $3)
            RETURNING *;
        `,
        [todo.task, todo.complete, req.userId]);

        res.json(result.rows[0]);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
});

app.put('/api/todos/:id', async(req, res) => {
    const id = req.params.id;
    const todo = req.body;

    try {
        const result = await client.query(`
            UPDATE  todos
            SET     task = $2,
                    complete = $3
            WHERE   id = $1
            RETURNING *;
        `, [id, todo.task, todo.complete]);
        res.json(result.rows[0]);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
});

app.delete('/api/todos/:id', async(req, res) => {
    // get the id that was passed in the route:
    const id = req.params.id;
    
    //const id = 0; // ???

    try {
        const result = await client.query(`
            DELETE FROM todos
            WHERE   id = $1
        `, [id]);
        
        res.json(result.rows[0]);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log('server running on PORT', PORT);
});