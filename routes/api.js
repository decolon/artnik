//Required Modules
//-----------------------------
var orm = require('../db/singleton');
var dbHelpers = require('../db/dbHelpers');
var dbLoader = require('../db/loadData.js');
var async = require('async');

//dbLoader.deleteAllData(function(){
//	dbLoader.batchUpload('./db/batchUpload');
//});

exports.allPieces = function(req, res){
	dbHelpers.getAllPieces(function(result){
		var toReturn = [];
		for(var piece in result){
			var tmp = {
		    name: result[piece].name,	
		    artist: result[piece].artist,	
		    date: result[piece].date,
		    tagline: result[piece].tagline,	
		    description: result[piece].description,	
		    id: result[piece].id,
		    created_at: result[piece].created_at,	
		    updated_at: result[piece].updated_at	
			};
			toReturn.push(tmp);
		}
		res.send(toReturn);
	});
};

exports.getPiece = function(req, res){
  var pieceId = req.params.pieceId;
  dbHelpers.getPieceWithId(pieceId, function(piece){
    var toReturn = {
      name: piece.name,
      artist: piece.artist,
      date: piece.date,
      description: piece.description,
      id: piece.id,
      created_at: piece.created_at,
      updated_at: piece.updated_at
    };
    res.send(toReturn);
  });
}

exports.getComment = function(req, res){
  var commentId = req.params.commentId;
  dbHelpers.getCommentWithId(commentId, function(comment){
    comment.getUser().success(function(user){
      var toReturn = {
        short_comment: comment.short_comment,
        long_comment: comment.long_comment,
        rating: comment.rating,
        id: comment.id,
        created_at: comment.created_at,
        updated_at: comment.updated_at,
        user_email : user.email,
        user_name : user.name
      };
      console.log(toReturn);
      res.send(toReturn);
    }).error(function(error){
      console.log(error);
    });
  });
}

exports.likeComment = function(req, res){
  var commentId = req.params.commentId;
  dbHelpers.getCommentWithId(commentId, function(comment){
    comment.getUser().success(function(user){
      comment.rating++;
      user.rating++;
      comment.save();
      user.save();
    }).error(function(error){
      console.log(error);
    });
  });
}

exports.newComment = function(req, res){
  console.log('HERE');
	var short_comment = req.body.short_comment;
	var long_comment = req.body.long_comment;
	var rating = 0;
	var userEmail = req.session.user.email;
	var pieceId = req.body.pieceId;
	console.log(short_comment, long_comment, pieceId, userEmail);
	dbHelpers.getPieceWithId(pieceId, function(piece){
    dbHelpers.getUserWithEmail(userEmail, function(user){
      dbHelpers.addComment(short_comment, long_comment, user, piece, function(comment){
        console.log(comment);
      });
    });
	});
}

exports.pieceComments = function(req, res){
	var piece_id = req.params.pieceId;
	dbHelpers.getPieceWithId(piece_id, function(piece){
	  dbHelpers.getAllCommentsForPiece(piece, function(comments){
        var toReturn = [];
        if(comments != undefined){
          for(var i=0; i<comments.length; i++){
            var commentObj = {};
            commentObj.short_comment = comments[i].short_comment;
            commentObj.long_comment = comments[i].long_comment;
            commentObj.rating = comments[i].rating;
            commentObj.id = comments[i].id;
            commentObj.created_at = comments[i].created_at;
            commentObj.updated_at = comments[i].updated_at;
            commentObj.id = comments[i].id;
            toReturn.push(commentObj);
          }
        }
        console.log(toReturn);
        res.send(toReturn);
	  });
	});
};














