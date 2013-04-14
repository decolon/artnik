//Module dependencies
//------------------------------------------------------------------------------
var AM = require('../modules/account-manager');
//partials
//------------
//This function renders the partials.  Is called extensively by angular behind
//the scene to render all the pieces of the page.  Be careful when playing
//around with partials, it can do unexpected things
//
//This implementation also takes care of someone trying to see user pages
//even if they are not logged in.  If there is no current session (i.e. not
//logged in) and they are requesting a partial that is not publicly accessible,
//then the request is redirected to the signup page
//----------------------------------------------------------------------------
exports.partials = function(req, res){
		var name = req.params.name;
		if(req.session.user == null){
			if(name != 'signin' && name != 'signup'){
				name = 'signin';
			}
		}
		if(req.session.user != null && (name == 'signin' || name == 'signup')){
			name = 'instructions';
		}
		res.render('partials/' + name);
};

//manualLogin
//-------------------------------
//This function is called when a user is trying to log in with entered data
//instead of with cookies.  (ie through the signin page)
//
//AM.manualLogin does all the grunt work.  All this does is direct to specific
//pages and create cookies if the user specified remember-me to be true.  If there
//is a problem it sends an error, if everything is fine it redirects to user
//--------------------------------------------------------------------------------
exports.manualLogin = function(req, res){
	var email = req.body.email;
	var password = req.body.password;
	AM.manualLogin(email, password, function(e, user){
		if(!user){
			//TODO, change this to be nicer, and to work
			res.send(e, 404);
		}else{
			req.session.user = user;
			if(req.param('remember-me') === 'true'){
				res.cookie('user', user.username, {maxAge: 900000});
				res.cookie('password', user.password, {maxAge: 900000});
			}
			res.redirect('/choosePiece');
		}
	});
};

exports.loggedInUser = function(req, res){
	res.send(req.session.user);
};

//loggedInUserHome
//-------------------
//This function checks to see if the user already is in a session (ie logged in)
//If they are not, they are redirected to the home page
//
//If they are then it renders loggedIn.  This lets the user navigate through the
//logged in pages by entering the pages into the url box, but does not allow non
//logged in people to access private pages through the url box
//--------------------------------------------------------------------------------
exports.loggedInUserHome = function(req, res){
	if(req.session.user == null){
		res.redirect('/');
	}else{
		res.render('loggedIn');
	}
};

exports.index = function(req, res){
	if(req.session.user == null){
		res.render('index');
	}else{
		res.redirect('/choosePiece');
	}
};

//logout
//------------------
//This function takes care of logging out.  It clears all cookies and then
//destroys the session.  After the session is destroyed, it redirects to
//the public home page
//-----------------------------------------------------------------------------
exports.logout = function(req, res){
//	res.clearCookie('username');
//	res.clearCookie('password');
	req.session.destroy(function(e){
		res.redirect('/');
	});
};

//newAccount
//--------------------
//This function takes care of creating a new user account.  First it uses
//AM.addAccount to create the new account and then it uses AM.manualLogin
//to bring the new user to their hompage
//
//If something goes wrong with creating the account then this function throws
//and error.  
//------------------------------------------------------------------------------
exports.newAccount = function(req, res){
	AM.addNewAccount({
		name: req.body.name,
		email: req.body.email,
		authority: 0,
		password: req.body.password
	}, function(e){
		if(e){
			res.send(e, 404);
		}else{
			console.log('About to log in');
			AM.manualLogin(req.body.email, req.body.password, function(e, user){
				console.log('Logging in');
				req.session.user = user;
				res.redirect('/choosePiece');
			});
		}
	});
}

