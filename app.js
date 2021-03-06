var express = require('express'),
    logger = require('morgan'),
    path = require('path'),
    bodyParser = require('body-parser');

var app = express();
var routes = require('./routes');
var config = require('./.config');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

//use stuff
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'views')));

app.use('/', routes);


var http = require('http').Server(app);
var io = require('socket.io')(http);
var currUserNames = {};
var obsts;
io.on('connection', function(socket) {
    socket.on('moveData', function(moveObj) {
        //data from mobile (either deviceorientation in prod or mousemove in dev)
        //sorting of usernames is done on front-end (desktop version)
        if (!currUserNames[moveObj.un]) {
            //if user is not currently in the list of users, push em in
            currUserNames[moveObj.un] = 1;
        }
        io.emit('outData', moveObj);
    });
    socket.on('checkName', function(name) {
        var respObj = {
            un: name.un,
            good: false,
            name: name.name
        };
        console.log('checkName', name);
        if (currUserNames[name.un]) {
            respObj.good = true;
        }
        io.emit('nameRes', respObj);
    });
    socket.on('setAppel', function(apl) {
        io.emit('setAppelBak', {
            un: apl.un,
            name: apl.name
        });
    });
    socket.on('remUser',function(res){
        delete currUserNames[res.un]
    })
    socket.on('fireToBack', function(fr) {
        io.emit('fire', {
            un: fr.un
        });
    });
    socket.on('fireRebound', function(fReb) {
        io.emit('fireBuzz', fReb);
    });
    socket.on('hit', function(hitOb) {
        io.emit('hitPhone', hitOb);
    });
    socket.on('userKill', function(stats) {
        currUserNames[stats.atk]++;
        io.emit('statsUpd', currUserNames);
    });
    socket.on('recordObsts', function(res) {
        //first user has created obstacles, so send these forward to each new user
        obsts = res.obstList;
    })
    socket.on('getObsts', function(meh) {
        //first user has created obstacles, so send these forward to each new user
        io.emit('obstsToPlayers', {
            obs: obsts
        })
    })
});
io.on('error', function(err) {
        console.log("SocketIO error was", err)
    })
    //set port, or process.env if not local

http.listen(process.env.PORT || 8080);

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500).send({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500).send({
        message: err.message,
        error: {}
    });
});
