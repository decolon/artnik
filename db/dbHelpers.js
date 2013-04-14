//Get the orm
var orm = require('./singleton.js');
var fs = require('fs');

//Get all the tables
var Piece = orm.model('piece');
var Comment = orm.model('comment');
var User = orm.model('user');

//##############################################################################################
//  ADD METHODS
//  -----------------------
//  WHEN YOU WANT TO MAKE A NEW ONE OF ANYTHING, USE ONE OF THESE
//
//  all parameters are required and must be valid.  Check them before calling the method.  
//  If anything going wrong the callback will return null and the console will log the error
//  ---------------------------------------------------------------------------------------------
//##############################################################################################

//    ADD PIECE
//    ---------------------------------------------------------------------------------------------
exports.addPiece = function(name, artist, date, tagline, description, callback){
	Piece.create({name:name, artist:artist, date:date, tagline:tagline, description:description}).success(function(piece){
		if(callback)callback(piece);	
	}).error(function(error){
		console.log(error);
		console.log(name);
		if(callback)callback(null);
	});
};

//    ADD USER
//    ---------------------------------------------------------------------------------------------
exports.addUser = function(name, email, password, rating, callback){
	User.create({name:name, email:email, password:password, rating:rating}).success(function(user){
		if(callback)callback(user);
	}).error(function(error){
		console.log(error);
		if(callback)callback(null);
	});
}


//    ADD Comment
//    ---------------------------------------------------------------------------------------------
exports.addComment = function(short_comment, long_comment, user, piece, callback){
	Comment.create({short_comment:short_comment, long_comment:long_comment, rating:0}).success(function(comment){
		comment.setUser(user);
		comment.setPiece(piece);
		if(callback)callback(comment);	
	}).error(function(error){
		console.log(error);
		if(callback)callback(null);
	})
};

//    ADD Comment with Ids 
//    ---------------------------------------------------------------------------------------------
exports.addCommentWithIds = function(short_comment, long_comment, user_id, piece_id, callback){
  User.find(user_id).success(function(user){
    Piece.find(piece_id).success(function(piece){
      Comment.create({short_comment:short_comment, long_comment:long_comment, rating:0}).success(function(comment){
        comment.setUser(user);
        comment.setPiece(piece);
        if(callback)callback(comment);	
      }).error(function(error){
        console.log(error);
        if(callback)callback(null);
      });
    }).error(function(error){
      console.log(error);
      if(callback)callback(null);
    });  
  }).error(function(error){
    console.log(error);
    if(callback)callback(null);
  });
};


//##############################################################################################
//
//     GETTER METHODS
//   -------------------------------------
//   WHEN YOU WANT TO GET SOMETHING, USE ONE OF THESE
//
//   BROKEN DOWN MY TABLE
//##############################################################################################



//PIECE GETTERS
//-------------------------------------------------------------------------------------------
exports.getPieceWithName = function(pieceName, callback){
	Piece.find({where:{name:pieceName}}).success(function(piece){
		if(callback)callback(piece);
	}).error(function(error){
		console.log(error);
		if(callback)callback(null);
	});
};

exports.getPieceWithId = function(pieceId, callback){
	Piece.find({where:{id:pieceId}}).success(function(piece){
		if(callback)callback(piece);
	}).error(function(error){
		console.log(error);
		if(callback)callback(null);
	});
};

exports.getAllPieces = function(callback){
	Piece.all().success(function(result){
		callback(result);
	}).error(function(error){
		console.log(error);
		if(callback)callback(null);
	});
}

//USER GETTERS
//-------------------------------------------------------------------------------------------

exports.getUserWithEmail = function(email, callback){
	User.find({where:{email:email}}).success(function(user){
		if(callback)callback(user);
	}).error(function(error){
		console.log(error);
		if(callback)callback(null);
	});
};

exports.getUserWithId = function(userId, callback){
	User.find({where:{id:userId}}).success(function(user){
		if(callback)callback(user);
	}).error(function(error){
		console.log(error);
		if(callback)callback(null);
	});
};


// COMMENT GETTERS
//-------------------------------------------------------------------------------------------
exports.getCommentWithId = function(commentId, callback){
	Comment.find({where:{id:commentId}}).success(function(comment){
		if(callback)callback(comment);
	}).error(function(error){
		console.log(error);
		if(callback)callback(null);
	});
};

exports.getAllCommentsForPiece = function(piece, callback){
	piece.getComments().success(function(result){
		callback(result);
	}).error(function(error){
		console.log(error);
		if(callback)callback(null);
	});
}


