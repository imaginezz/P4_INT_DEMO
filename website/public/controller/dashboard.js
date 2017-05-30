'use strict';
angular
    .module('app')
    .controller('dashboardController', dashboardController);
dashboardController.$inject = ['$scope', '$http', '$interval']

function dashboardController($scope, $http, $interval) {
    $scope.isStatusOpen = false;
    $scope.toggleStatus = function() {
        $scope.isStatusOpen = !$scope.isStatusOpen;
    }
    var nodes = [{
        id: 'h1',
        name: 'h1',
        type: 'host',
        status: 1,
    }, {
        id: 'h2',
        name: 'h2',
        type: 'host',
        status: 1,
    }, {
        id: 's1',
        name: 's1',
        type: 'switch',
        status: 1
    }, {
        id: 's2',
        name: 's2',
        type: 'switch',
        status: 1
    }, {
        id: 's3',
        name: 's3',
        type: 'switch',
        status: 1
    }, {
        id: 's4',
        name: 's4',
        type: 'switch',
        status: 1
    }];

    var links = [{
        source: 'h1',
        target: 's1'
    }, {
        source: 's1',
        target: 's2'
    }, {
        source: 's1',
        target: 's3'
    }, {
        source: 's2',
        target: 's4'
    }, {
        source: 's3',
        target: 's4'
    }, {
        source: 's4',
        target: 'h2'
    }];
    const topology = new Topology('topo');
    topology.addNodes(nodes);
    topology.addLinks(links);
    topology.update();
    $http.get('/getLinkStatus?isnew=true');
    var timer = $interval(function() {
        if ($scope.isStatusOpen === true) {
            $http.get('/getLinkStatus')
                .then(function(res) {
                    var i = [1, 2, 3, 4];
                    i.forEach(function(packetNum) {
                        if (res.data[packetNum] == 0) {
                            topology.nodes[packetNum].status = 0;
                        } else {
                            topology.nodes[packetNum].status = 1;
                        }
                        topology.update();
                    });
                });
        }
    }, 10000);
}