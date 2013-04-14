//CODE ADAPTED FROM
//https://github.com/braitsch/node-login
//------------------------------------------------------------------------------

//Module Dependencies
//------------------------------------------------------------------------------
var crypto = require('crypto');
var moment = require('moment');
var orm = require('../db/singleton.js');

//Gets UserModel table from the orm and stores it in User
//Will use this extensively for checking log in attempts and 
//creating new accounts
//-------------------------------------------------------------------------------
var User = orm.model('user');

//manualLogin
//--------------
//This function is used to make sure the supplied username and password are valid.
//First it attempts to get a user with the username.  If it fails it throws an error.
//Then it checks to see if the supplied password, when hashed, is the same as that 
//users password.  If not, an error is sent to the callback.  If both tests are passed,
//the user is sent back with no error
//
//TODO have more helpful error messages
//----------------------------------------------------------------------------------
exports.manualLogin = function(email, password, callback){
	User.find({where:{email:email}}).success(function(user){
		if(user != undefined){
			//GET RID OF PASSING USER TO VALIDATE AFTER BATCH UPLOAD HASHES
			validatePassword(email, password, user.password, function(err, res){
				if(res){
					callback(null, user);
				}else{
					callback('invalid-username-or-password');
				}
			});
		}else{
			callback('user-not-found');
		}
	});
}

//addNewAccount
//-------------------------
//This function creates a new user.  First it checks to make sure the given username
//and email are not being used by another user.  This function will throw an error
//if either one is not unique.  
//
//After getting through the tests, addNewAccount hashes the supplied password,
//replaces the text password with the hashed password, and then uses User,create
//to create the new user
//
//the callback is used for error messages and logging in the user.  See
//./routes/index.js -> newAccount for more information
//---------------------------------------------------------------------------------
exports.addNewAccount = function(newData, callback){
	User.find({where:{email:newData.email}}).success(function(user){
		if(user != undefined){
		  console.log('email-taken');
			callback('email-taken');
		}else{
			saltAndHash(newData.password, function(hash){
				newData.password = hash;
				User.create(newData);
				callback(null);
			});
		}
	});
}


//HELPER METHODS
//--------------------------------------------------------------------------------

//generateSalt
//--------------------
//Generates a salt
//
//TODO make sure this is valid, secure code
//--------------------------------------------------------------------------------
var generateSalt = function(){
	var set = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
	var salt = '';
	for(var i=0; i<10; i++){
		var p = Math.floor(Math.random()*set.length);
		salt += set[p];
	}
	return salt;
}

//md5
//------
//Hashing Algorithm
//
//TODO change to a more secure one, sha1? 
//---------------------------------------------------------------------------------
var md5 = function(str){
	return crypto.createHash('md5').update(str).digest('hex');
}

//saltAndHash
//----------------
//gets a salt and appends it to the hashed password + salt.  This hole beautiful 
//mess is then returned in the callback
//--------------------------------------------------------------------------------
var saltAndHash = function(password, callback){
	var salt = generateSalt();
	callback(salt+md5(password + salt));
}

//validatePassword
//-----------------
//This function takes a plain password and a hashed password and checks
//to see if they are the same.  First it gets the salt from the hashed
//password.  Then it hashes the plain password and returns via the 
//callback weather or not the passwords are the same
//------------------------------------------------------------------------------
var validatePassword = function(email, plainPassword, hashedPassword, callback){
	var salt = hashedPassword.substr(0, 10);
	var validHash = salt + md5(plainPassword + salt);
	callback(null, validHash === hashedPassword);
}




