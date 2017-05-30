<!DOCTYPE html>
<html lang="zh" ng-app="app">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="css/topo.css">
  <link rel="stylesheet" href="css/index.css">
  <script src="bower_components/jquery/dist/jquery.min.js"></script>
  <script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
  <script src="bower_components/angular/angular.min.js"></script>
  <script src="bower_components/d3/d3.min.js"></script>
  <script src="bower_components/echarts/dist/echarts.min.js"></script>
  <script src="js/app.js"></script>
  <script src="controller/dashboard.js"></script>
  <script src="controller/troubleshooting.js"></script>
  <script src="controller/stat.js"></script>
  <script src="js/topo.js"></script>
  <title>In-Band Network Telemetry</title>
</head>

<body>
  <nav class="navbar navbar-default">
    <div class="navbar-header">
      <a class="navbar-brand">In-Band Network Telemetry</a>
    </div>
    <div>
      <ul class="nav navbar-nav">
        <li ui-sref="dashboard" ng-class="{active:'dashboard'==$root.getCurrentTab()}">
          <a href="#" ng-click="$root.changeTab('dashboard')">Dashboard</a>
        </li>
        <!--<li ng-class="{active:'troubleshooting'==$root.getCurrentTab()}">
          <a ui-serf="ts" href="#" ng-click="$root.changeTab('troubleshooting')">Trouble Shooting</a>
        </li>-->
        <li ui-serf="static" ng-class="{active:'static'==$root.getCurrentTab()}">
          <a href="#" ng-click="$root.changeTab('static')">Static</a>
        </li>
      </ul>
    </div>
  </nav>
  <div class="container-fluid">
    <div id="dashboard" ng-controller="dashboardController" ng-show="'dashboard'==$root.getCurrentTab();">
      <button ng-if="isStatusOpen" class="btn btn-primary" ng-click="toggleStatus();">Close Troubleshooting</button>
      <button ng-if="!isStatusOpen" class="btn btn-primary" ng-click="toggleStatus();">Open Troubleshooting</button>
      <div id="topo"></div>
    </div>
    <!--<div id="troubleshooting" ng-controller="troubleshootingController" ng-show="'troubleshooting'==$root.getCurrentTab();">
      <h1>troubleshooting</h1>
    </div>-->
    <div id="stat" ng-controller="statController" ng-show="'static'==$root.getCurrentTab();">
      <h2>Time Delta</h2>
      <div class="row">
          <div id="timeDelta" class="col-md-6 chart1"></div>
          <div id="deqTimeDelta" class="col-md-6 chart1"></div>
      </div>
      <h2>Queue Depth</h2>
      <div class="row">
          <div id="qdepth1" class="col-md-6 chart2"></div>
          <div id="qdepth2" class="col-md-6 chart2"></div>
      </div>
      <div class="row">
          <div id="qdepth3" class="col-md-6 chart2"></div>
          <div id="qdepth4" class="col-md-6 chart2"></div>
      </div>
    </div>
  </div>
</body>

</html>