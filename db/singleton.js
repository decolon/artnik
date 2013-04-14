//Need filesystem to access the model files
//--------------------------------------------------------------------------------
var filesystem = require('fs');

//Global Variables
//use these both in setup and in serving the loaded models
//-------------------------------------------------------------------------------
var models = {};
var relationships = {};

//The object holding all the models
//------------------------------------------------------------------------------
var singleton = function singleton(){
	var Sequelize = require("sequelize");
	var sequelize = null;
	var modelsRelativePath = null;
	var modelsRootPath = null;

	//setup
	//----------------------
	//This function sets up the sequalize object.  Depending on how many parameters
	//are given, it calls different sequalize constructors. Then this function
	//calls init to do most of the heavy lifting for setup.  Finally it calls the 
	//callback function. 
	//
	//The callback function is only used in ./app.js to load some modules which need
	//the database to have finished setting up
	//------------------------------------------------------------------------------
	this.setup = function(relativePath, rootPath, callback, isProduction){
		modelsRelativePath = relativePath;
		modelsRootPath = rootPath;	

		var dbOptions = {
		  username: 'root',
		  database: 'artnik',
		  password: '',
		  settings: {
        logging: false,
        define: {
          underscored: true
        }
		  }
		};

		if(isProduction){
		  console.log('HHHHHHHHEEEEEEEEEERRRRRRRRRREEEEEEEEEE IN PRODUCTIONNNNNNNNNNNNNNNNNNNNNN');
			var url = require('url'),
			dbUrl = url.parse(process.env.DATABASE_URL),
			authArr = dbUrl.auth.split(':');
			dbOptions.database = dbUrl.path.substring(1);
			dbOptions.username = authArr[0]; 
			dbOptions.password = authArr[1];
			dbOptions.host = dbUrl.host;
			dbOptions.port = null;
			dbOptions.dialect = 'postgres';
			dbOptions.protocol = 'postgres';

			sequelize = new Sequelize(dbOptions.database, dbOptions.username, dbOptions.password, {
				host: dbOptions.host,
				port: dbOptions.port,
				dialect: dbOptions.dialect,
				protocol: dbOptions.protocol
			});
		}else{
			sequelize = new Sequelize(dbOptions.database, dbOptions.username, dbOptions.password, dbOptions.settings);
		}


		init(function(){
			callback();
		});
	}

	this.Seq = function(){
		return Sequelize;
	};

	//model
	//--------------
	//This function is used to get a specific model (aka table) from the database
	//
	//example
	//--------
	//var User = orm.model('UserModel');
	//
	//-----------------------------------------------------------------------------
	this.model = function(name){
		return models[name];
	}


	//resetDatabase
	//-------------------
	//This function wides the database.  Used before loading test data
	//------------------------------------------------------------------------
	this.resetDb = function(callback){
		sequelize.drop().success(function(){
			init(function(){
				callback(true);
			});	
		}).error(function(error){
			console.log(error);
			callback(false);
		});
	}

	//init
	//----------------
	//This function is responsible for loading all the model files found in
	//the 'models' directory into the database.  First it uses filesystem
	//to get all the files, and for each file it formats it a bit before 
	//calling sequalize.define to create the new table.  After the table
	//is created, it loads the new table object into the models object
	//and loads any relationships into the relationships object
	//
	//The second half initializes all the relationships between object
	//
	//the commented out code is used for debugging
	//
	//TODO understand the second half more, I have not used relationships yet but need to
	//---------------------------------------------------------------------------
	function init(callback){
		filesystem.readdirSync(modelsRootPath).forEach(function(name){
			var object = require(modelsRelativePath + "/" + name);
			var options = object.options || {}
			var modelName = name.replace(/\.js$/i, "");
			models[modelName] = sequelize.define(modelName, object.model, options);
			relationships[modelName] = object.relations;
		});
		for(var name in relationships){
			var relations = relationships[name];
			for(var i=0; i<relations.length; i++){
				for(var relName in relations[i]){
					var related = relations[i][relName];
					models[name][relName](models[related]);
				}
			}
		}
		sequelize.sync()
		callback();
	}

	//NOT SURE WHEN THIS WOULD COME UP
	//TODO figure what this is all about
	if(singleton.caller != singleton.getInstance){
		throw new Error("This object cannot be instanciated");
	}
}

singleton.instance = null;

//NOT REALLY SURE WHEN THIS SHOULD BE USED
//because I don't see where get instance is ever called besides above
//TODO figure this out too
singleton.getInstance = function(){
	if(this.instance === null){
		this.instance = new singleton();
	}
	return this.instance;
}

//Same here WHY ARE WE EXPORTING THIS
//TODO and this too
module.exports = singleton.getInstance();

