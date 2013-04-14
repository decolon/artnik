//Module dependencies
//-------------------------------------------------------------------------
var express = require('express')
  , http = require('http')
  , path = require('path');


var app = express();


var afterDatabaseLoad = function(){
	routes = require('./routes/index');
	api = require('./routes/api');
}


app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  require('./db/singleton.js').setup('./models','./db/models', afterDatabaseLoad, false); 
});

app.configure('production', function() {
  app.use(express.errorHandler());
  require('./db/singleton.js').setup('./models','./db/models', afterDatabaseLoad, true);
});


app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({secret:'placeholder'}));
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(function(req, res, next) {
    if(req.url.match(/^\/test\//) != null) {
      res.sendfile(path.join(__dirname, req.url));
    } else {
      next();
    }
  });
  app.use(app.router);
  app.use(function(req, res, next) {
    throw new Error(req.url + ' not found');
  });
  app.use(function(err, req, res, next) {
    console.log(err);
    res.send(err.message);
  });
});




app.get('/', routes.index);
app.post('/login', routes.manualLogin);
app.post('/newAccount', routes.newAccount);
app.get('/logout', routes.logout);
app.get('/start', routes.loggedInUserHome);
app.get('/partials/:name', routes.partials);

app.get('/piece/all', api.allPieces);
app.get('/piece/:pieceId', api.getPiece);
app.get('/:pieceId/comments', api.pieceComments);
app.get('/comment/:commentId', api.getComment);
app.post('/comment/new', api.newComment);
app.post('/comment/:commentId/like', api.likeComment);


app.get('*', routes.loggedInUserHome);


http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});
