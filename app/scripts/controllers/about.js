'use strict';

/**
 * @ngdoc function
 * @name mediamathApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the mediamathApp
 */
angular.module('mediamathApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
