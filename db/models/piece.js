//Module dependencies
//-------------------------------------------------------------------------
var Seq = require('sequelize');

//Piece
//---------------
//Initializes the Piece table.  has fields
//
//name: the name of the piece
//artist: the name of the artist who made the piece
//date: the date at which the piece was made
//tagline: short description of the piece
//description: a string that describes the piece
//
//
//relations
//---------
//hasMany Comment - each piece has many comments
//
//options
//--------
//freezeTableName stops sequalize from changing the table names to plurals
//
//----------------------------------------------------------------------------
module.exports = {
	model:{
		name: {type: Seq.STRING, validate:{
      notNull: true,
      isAlphanumeric:true
		}},
		artist: {type: Seq.STRING, validate:{
      notNull: true,
      isAlphanumeric:true
		}},
		date: {type: Seq.STRING, validate:{
      notNull:true,
      isAlphanumeric:true
		}}
	},
	relations:[
		{hasMany:"comment"}
	]
}
