'use strict';

/* Services */


angular.module('myApp.services', [])
	.service('pieceObj', function(){
		var piece = {};
		return {
			getPiece: function(){
				return piece;
			},
			setPiece: function(newPiece){
				piece= newPiece;
			}
		};
	});

