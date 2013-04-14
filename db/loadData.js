var dbHelpers = require('./dbHelpers');
var fs = require('fs');
var async = require('async');
var orm = require('./singleton.js');
var AM = require('../modules/account-manager');



//#########################################################################
//   DELETE EVERYTHING
//#########################################################################

exports.deleteAllData = function(callback){
	orm.resetDb(function(bool){
		if(bool){
			callback();
		}else{
			console.log('Coult not delete database');
		}
	});
};



//##################################################################################
//
//    Batch Upload
//    --------------------------------
//    Each table has its own method
//    TODO: TRY TO NOT REUSE SO MUCH CODE
//    TODO: MAKE A METHOD THAT IS DOESNT NEED TO ADD THE ENTIRE DATABASE
//
//#################################################################################

exports.batchUpload = function(rootPath){
	loadData(rootPath, 'pieces', function(){
  	loadData(rootPath, 'users', function(){
  	  dbHelpers.addCommentWithIds('This is a painting', 'no really, it is a cool painting', 1, 1);
  	  dbHelpers.addCommentWithIds('The mona lisa is cool', 'beliece me', 2, 1);
  	  dbHelpers.addCommentWithIds('This sucks', 'I dont like it', 3, 1);
  	  dbHelpers.addCommentWithIds('I think its great now', 'I changed my mind', 3, 1);
  	  dbHelpers.addCommentWithIds('Why', 'Am i still looking at this', 4, 1);
  	  dbHelpers.addCommentWithIds('Sharks', 'are cooler than this', 5, 1);
  	  dbHelpers.addCommentWithIds('I like chocolate', 'no, that was not relevant', 1, 1);
  	  dbHelpers.addCommentWithIds('This is sparta', 'and this is greece', 2, 1);
  	  dbHelpers.addCommentWithIds('To be', 'or not to be', 3, 1);
  	  dbHelpers.addCommentWithIds('we put our hand up', 'na na na na na na', 1, 1);
		});
	});
};


function loadData(rootPath, type, callback){
	fs.readFile(rootPath + '/'+type+'.js', 'utf8', function(err, data){
		if(err){
			console.log(err);
		}else{
			var q = async.queue(function(task, callback){
			//MAKE SURE TO PUT CALLBACK
        switch(task.type){
          case 'pieces':
            dbHelpers.addPiece(task.name, task.artist, task.date, task.tagline, task.description, function(piece){
              callback();
            });
            break;
          case 'users':
            var newData = {
              name: task.name,
              email: task.email,
              password: task.password,
              rating: task.rating
            }
            AM.addNewAccount(newData, function(){
              callback();
            });
            break;
        }
			}, 1);
			q.drain = function(){
				callback(null);
			};

			var object = JSON.parse(data);
			var dataArray = object[type];
			for(var i=0; i< dataArray.length; i++){
				var object = dataArray[i];
				switch(type){
				  case 'pieces':
				    q.push({type: type, name: object["name"], artist: object["artist"], date: object["date"], tagline: object["tagline"], description: object["description"]});
				    break;
				  case 'users':
				    q.push({type: type, name: object["name"], email: object["email"], password: object["password"], rating: object["rating"]});
				    break;
				}
			}
		}
	});
};

