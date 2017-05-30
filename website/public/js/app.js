'use strict';
var app = angular.module('app', []);
app.run(function($rootScope, $location) {
    $rootScope.currentTab = 'dashboard';
    $rootScope.getCurrentTab = function() {
        return $rootScope.currentTab;
    }
    $rootScope.changeTab = function(tabName) {
        $rootScope.currentTab = tabName;
    }
});