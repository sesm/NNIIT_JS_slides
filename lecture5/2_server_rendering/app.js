var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'ejs');

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
    res.render('index.ejs', {posts: posts.slice().reverse()});
});

app.post('/submit', (req,res) => {
    posts.push(req.body);
    res.redirect('/');
});

app.listen(3002, ()=>console.log('server is starting on port 3002'));
