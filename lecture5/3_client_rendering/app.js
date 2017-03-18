var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();
app.use(bodyParser.json());

var posts = [
    {
        title: 'First post',
        text: 'Hello world!'
    }, {
        title: 'Second post',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    }
];

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/posts', (req,res) => {
    res.status(200).send(posts.slice().reverse());
});

app.post('/submit', (req,res) => {
    posts.push(req.body);
    res.sendStatus(200);
});

app.listen(3003, ()=>console.log('server is starting on port 3003'));
