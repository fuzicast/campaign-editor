'use strict';

/**
 * @ngdoc function
 * @name mediamathApp.controller:CampaignsCtrl
 * @description
 * # CampaignsCtrl
 * Controller of the mediamathApp
 */

//Yue: Ideally we should have access tokens generated to access data so that it's secure.
var apiToken = '9443948476bae77f922ee1b59498d59584099785';
var apiHost = 'http://challenge.mediamath.com/api';
var app = angular.module('mediamathApp');

//Yue: creating advertiser service to grab all advertisers
app.factory('AdvertiserService', ['$http', function($http) {

  var AdvertiserService = {};
  AdvertiserService.getAdvertisers = function() {
    return $http({
      method: 'get',
      url: apiHost + '/advertisers',
      params: {
        'api_token': apiToken
      }
    });
  };

  return AdvertiserService;
}]);

//Yue: agency service to grab all agencies
app.factory('AgencyService', ['$http', function($http) {

  var AgencyService = {};
  AgencyService.getAgencies = function() {
    return $http({
      method: 'get',
      url: apiHost + '/agencies',
      params: {
        'api_token': apiToken
      }
    });
  };

  return AgencyService;
}]);

//Yue: advertiser controller will call advertiser service to grab all advertisers. it also keeps track of currently
// selected advertiser, which the view can update selectedAdvertiser. whenever selectedAdvertiser is updated, it 
// will emit an event so Campaign controller would update campaigns based on updated advertiser
app.controller('AdvertisersController', ['$scope', '$rootScope', 'AdvertiserService', function($scope, $rootScope, AdvertiserService) {
  AdvertiserService.getAdvertisers().success(function(data) {
    if (data && data.status === 'ok') {
      $scope.advertisers = data.advertisers;
      $scope.selectedAdvertiser = $scope.advertisers[0];
      $rootScope.$emit('initialCampaign', $scope.selectedAdvertiser._id);
    } else {
      $scope.advertisers = [];
    }
  });

  $scope.updateAdvertiser = function(advertiser) {
    $scope.selectedAdvertiser = advertiser;
    $rootScope.$emit('updateCampaigns', advertiser._id);
  };

}]);

//Yue: agency controller just grabs all data returned by agency service
app.controller('AgenciesController', ['$scope', 'AgencyService', function($scope, AgencyService) {
  AgencyService.getAgencies().success(function(data) {
    if (data && data.status === 'ok') {
      $scope.agencies = data.agencies;
      $scope.selectedAgency = $scope.agencies[0];
    } else {
      $scope.agencies = [];
    }
  });
}]);

//Yue: campaign service will return data given a particular advertiserId.
app.factory('CampaignService', ['$http', function($http) {

  var CampaignService = {};
  CampaignService.getCampaigns = function(advertiserId) {
    return $http({
      method: 'get',
      url: apiHost + '/campaigns',
      params: {
        'api_token': apiToken,
        'advertiser_id': advertiserId
      }
    });
  };

  return CampaignService;
}]);

//Yue: campaign controller returns campaign data to view. it also handles 2 events that will update currently
// selected campaigns
app.controller('CampaignsController', ['$scope', '$rootScope', 'CampaignService', function($scope, $rootScope, CampaignService) {
  $scope.getCampaigns = function(advertiserId, callback) {
    CampaignService.getCampaigns(advertiserId).success(function(data) {
      if (data && data.status === 'ok') {
        callback(data.campaigns);
      } else {
        callback([]);
      }
    });
  };

  $scope.campaigns = [];

  $rootScope.$on('initialCampaign', function(event, advertiserId) {
    $scope.getCampaigns(advertiserId, function(campaigns) {
      $scope.campaigns = campaigns;
    });
  });

  $rootScope.$on('updateCampaigns', function(event, advertiserId) {
    $scope.getCampaigns(advertiserId, function(campaigns) {
      $scope.campaigns = campaigns;
    });
  });
}]);

