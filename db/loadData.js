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
	convertData(rootPath, 'pieces', function(){
		loadData(rootPath, 'pieces', function(){
		  	loadData(rootPath, 'users', function(){
			});
		});
	});
};

function convertData(rootPath, textFile, callback){
	fs.readFile(rootPath + '/'+textFile+'.txt', 'utf8', function(err, data){
		if(err) {
			console.log(err);
		}else{
			var fileName = rootPath+'/'+textFile+'.js';
			fs.writeFileSync(fileName, '{"'+textFile+'":[');
			var lines = data.split('\n');
			for (var i = 0; i < lines.length; i++) {
				if(lines[i] != '' && lines[i].charAt(0) != '#'){
					var data = lines[i].split('<>');
					var name = data[0];
					var artist = data[1];
					var date = data[2];
					var toInsert = '{"name":"'+name+'","artist":"'+artist+'","date":"'+date+'"}';
					if(i != lines.length-1){
						toInsert = toInsert + ',';
					}
					fs.appendFileSync(fileName, toInsert);
				}
			};
			fs.appendFileSync(fileName, ']}');
		}
		console.log('File Converted');
		callback();
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
	            };
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
				    q.push({type: type, name: object["name"], artist: object["artist"], date: object["date"]});
				    break;
				  case 'users':
				    q.push({type: type, name: object["name"], email: object["email"], password: object["password"], rating: object["rating"]});
				    break;
				}
			}
		}
	});
};

