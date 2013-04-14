//Module dependencies
//-------------------------------------------------------------------------
var Seq = require('sequelize');

//Comment
//---------------
//Initializes the Comment table.  has fields
//
//short_comment: short spiffy comment that sums up thoughts
//long_comment: long comment which expands on short
//rating: number of up votes
//
//relations
//---------
//belongsTo User - each comment has one user who wrote it
//belongsTo Piece - tells which piece the comment refers to
//
//options
//--------
//freezeTableName stops sequalize from changing the table names to plurals
//
//----------------------------------------------------------------------------
module.exports = {
	model:{
		short_comment: {type: Seq.STRING, validate:{
      notNull: true,
      isAlphanumeric: true
		}},
		long_comment: {type: Seq.TEXT, validate:{
		  notNull: true,
      isAlphanumeric: true
		}}, 
		rating: {type: Seq.INTEGER, defaultValue: 0, validate:{
	    notNull: true,
	    min: 0
		}}
	},
	relations:[
		{belongsTo:"user"},
		{belongsTo:"piece"}
	]
}
