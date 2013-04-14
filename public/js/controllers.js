'use strict';

/* Controllers */
function SigninCtl($scope) {
}
SigninCtl.$inject = ['$scope'];

function SignupCtl($scope) {
}
SignupCtl.$inject = ['$scope'];

function InstructionsCtl($scope){
}
InstructionsCtl.$inject = ['$scope'];


function PiecesCtl($scope, $resource){
  var pieces = $resource('/piece/all');
  var piecesResult = pieces.query(function(){
    $scope.pieces = piecesResult;
  });
}
PiecesCtl.$inject = ['$scope', '$resource'];



function CommentsCtl($scope, $resource, $routeParams){
  var pieceId = $routeParams.pieceId;
  $scope.pieceId = pieceId;
  var piece = $resource('/piece/:pieceId');
  var pieceResult = piece.get({pieceId:pieceId}, function(){
    $scope.piece = pieceResult;
  });
  var comments = $resource('/:pieceId/comments');
  var commentsResult = comments.query({pieceId:pieceId}, function(){
    $scope.comments = commentsResult;
  });
}
CommentsCtl.$inject = ['$scope', '$resource', '$routeParams'];



function CommentCtl($scope, $resource, $routeParams){
  var pieceId = $routeParams.pieceId;
  var commentId = $routeParams.commentId;
  $scope.pieceId = pieceId;
  var comment = $resource('/comment/:commentId');
  var result = comment.get({commentId:commentId}, function(){
    $scope.comment = result;
  });

  $scope.liked = false;
  $scope.like = function(){
    var like = $resource('/comment/:commentId/like');
    like.save({commentId:commentId},{});
    $scope.comment.rating++;
    $scope.liked = true;
  }
}
CommentCtl.$inject = ['$scope', '$resource', '$routeParams'];




function NewCommentCtl($scope, $resource, $routeParams, $location){
  var pieceId = $routeParams.pieceId;
  $scope.pieceId = pieceId;
  $scope.maxImpressionLength = 20;
  $scope.maxTextAreaLength = 500;
  $scope.submitComment = function(){
    if($scope.long_comment == null){
      $scope.long_comment = ' ';
    }
    if($scope.short_comment == null){
      $scope.short_comment = ' ';
    }
    var newComment = $resource('comment/new');
    newComment.save({},{pieceId:pieceId, short_comment:$scope.short_comment, long_comment:$scope.long_comment});
    setTimeout('', 1000);
  };
}
NewCommentCtl.$inject = ['$scope', '$resource', '$routeParams', '$location'];

