var express = require('express');
var sqlite = require('sqlite3');
var bodyParser = require('body-parser');

var db = new sqlite.Database('db.sqlite');
var app = express();
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next();
});

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
    db.run('insert into todos (text, done) values (?, 0)', req.body.text, function(err, result) {
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

app.post('/todos-delete', (req, res) => {
    db.run(inParam('delete from todos where id in (?#)', req.body.ids), function(err){
        if(err) {
            res.status(500).send({error: err});
        } else {
            res.sendStatus(200);
        }
    })
});

app.listen(3001, ()=>console.log('server is starting on port 3001'));
