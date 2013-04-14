'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['ngCookies', 'ngResource', 'myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/signin', {templateUrl: 'partials/signin', controller: SigninCtl});
    $routeProvider.when('/signup', {templateUrl: 'partials/signup', controller: SignupCtl});
    $routeProvider.when('/start', {templateUrl: 'partials/instructions', controller: InstructionsCtl});
    $routeProvider.when('/pieces', {templateUrl: 'partials/pieces', controller: PiecesCtl});
    $routeProvider.when('/pieces/:pieceId', {templateUrl: 'partials/comments', controller: CommentsCtl});
    $routeProvider.when('/comment/new/:pieceId', {templateUrl: 'partials/newComment', controller: NewCommentCtl});
    $routeProvider.when('/pieces/:pieceId/:commentId', {templateUrl: 'partials/comment', controller: CommentCtl});
    $routeProvider.otherwise({redirectTo: '/signin'});
    $locationProvider.html5Mode(true);
  }]);
