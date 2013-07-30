var express = require('express');
var path = require('path');
var http = require('http');

// Cheesy hack: Override the RegExp so that it parses text/plain, too.
express.json.regexp = /^(application\/([\w!#\$%&\*`\-\.\^~]*\+)?json)|(text\/plain)$/i;

var app = express();

app.set('port', +process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());

app.get('/', function(req, res) {
    return res.sendfile(path.join(__dirname, 'index.html'));
});

app.get('/data', function(req, res) {
    res.set('Access-Control-Allow-Origin', req.get('Origin'));
    res.set('Access-Control-Allow-Credentials', 'true');
    res.cookie('cookie', 'value');
    return res.json({ foo: 42 });
});

app.options('/data', function(req, res) {
    res.set('Access-Control-Allow-Origin', req.get('Origin'));
    res.set('Access-Control-Allow-Credentials', 'true');
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).send();
});

app.post('/data', function(req, res) {
    res.set('Access-Control-Allow-Origin', req.get('Origin'));
    res.set('Access-Control-Allow-Credentials', 'true');
    console.log(req.cookies.cookie);
    return res.json(req.body);
});

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

// Start another server to act as the other origin.
http.createServer(app).listen(app.get('port') + 1, function() {
    console.log('Other Express server listening on port ' + (app.get('port') + 1));
});
