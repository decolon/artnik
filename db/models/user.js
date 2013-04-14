//Module dependencies
//-------------------------------------------------------------------------
var Seq = require('sequelize');

//User
//---------------
//Initializes the User table.  has fields
//
//email: users email
//name: the users name as they would like it displayed 
//password: the users hashed and salted password
//rating: integer value for total number of up votes this user has gotten
//
//relations
//---------
//hasMany Comment - each user has many comments
//
//options
//--------
//freezeTableName stops sequalize from changing the table names to plurals
//
//----------------------------------------------------------------------------
module.exports = {
	model:{
		name: {type: Seq.STRING, unique:true, validate:{
      notNull: true,
      isAlphanumeric: true
		}},
		email: {type: Seq.STRING, unique:true, validate:{
		  isEmail: true,
		  notNull: true
		}},
		password: {type: Seq.STRING, validate:{
      notNull:true,
		}},
		rating: {type: Seq.INTEGER, defaultValue: 0, validate:{
	    min: 0,
	    notNull: true
		}}
	},
	relations:[
		{hasMany:"comment"}
	]
}
