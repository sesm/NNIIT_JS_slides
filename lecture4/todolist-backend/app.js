const express = require('express');
const sqlite = require('sqlite3');
const bodyParser = require('body-parser');

let db = new sqlite.Database('db.sqlite');
let app = express();
app.use(bodyParser.json());

app.get('/todos', (req, res) => {
    db.all('select * from todos', function(err, data) {
        if(err) {
            res.status(500).send({error: err});
        } else {
            data.forEach(todo=> todo.done = !!todo.done);
            res.status(200).send(data);
        }
    });
});

app.post('/todo', (req, res) => {
    db.run('insert into todos (text) values (?)', req.body.text, function(err, result) {
        if(err) {
            res.status(500).send({error: err});
        } else {
            res.status(200).send({id: this.lastID});
        }
    });
});

app.put('/todo', (req, res) => {
    db.run('update todos set done=(?) where id=(?)', req.body.done, req.body.id, function(err) {
        if(err) {
            res.status(500).send({error: err});
        } else {
            res.sendStatus(200);
        }
    })
});

function inParam (sql, arr) {
    return sql.replace('?#', arr.join(','))
}

app.post('/todos-delete', (req,res) => {
    db.run(inParam('delete from todos where id in (?#)', req.body.ids), function(err){
        if(err) {
            res.status(500).send({error: err});
        } else {
            res.sendStatus(200);
        }
    })
});

app.listen(3001, ()=>console.log('server is starting on port 3001'));
