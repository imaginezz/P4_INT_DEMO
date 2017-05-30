'use strict';
angular
    .module('app')
    .controller('statController', statController);

statController.$inject = ['$http', '$interval'];

function statController($http, $interval) {
    var allData = [];
    var timeDeltaChart = echarts.init(document.getElementById("timeDelta"));
    var deqTimeDeltaChart = echarts.init(document.getElementById("deqTimeDelta"));
    var qdepthChart = [
        echarts.init(document.getElementById("qdepth1")),
        echarts.init(document.getElementById("qdepth2")),
        echarts.init(document.getElementById("qdepth3")),
        echarts.init(document.getElementById("qdepth4"))
    ];
    var timeDeltaData = {
        1: [],
        2: [],
        3: [],
        4: []
    };
    var deqTimeDeltaData = {
        1: [],
        2: [],
        3: [],
        4: []
    };
    var queueDepthData = {
        1: {
            enq: [],
            deq: []
        },
        2: {
            enq: [],
            deq: []
        },
        3: {
            enq: [],
            deq: []
        },
        4: {
            enq: [],
            deq: []
        },
    };
    var addtimeDeltaData = function(data) {
        var switchId = data.intFlag;
        timeDeltaData[switchId].push([data.id, data.timedelta]);
        deqTimeDeltaData[switchId].push([data.id, data.deq_tmedelta]);
        queueDepthData[switchId].enq.push([data.id, data.enq_qdepth]);
        queueDepthData[switchId].deq.push([data.id, data.deq_qdepth]);
    };

    $http.get('/getPerTimeData?isnew=true')
        .then(function(res) {
            allData = res.data;
            allData.forEach(function(data) {
                addtimeDeltaData(data);
            });
            timeDeltaChart.setOption({
                series: [{
                    data: timeDeltaData[1]
                }, {
                    data: timeDeltaData[2]
                }, {
                    data: timeDeltaData[3]
                }, {
                    data: timeDeltaData[4]
                }]
            });
            deqTimeDeltaChart.setOption({
                series: [{
                    data: timeDeltaData[1]
                }, {
                    data: timeDeltaData[2]
                }, {
                    data: timeDeltaData[3]
                }, {
                    data: timeDeltaData[4]
                }]
            });
            var charti = 0;
            qdepthChart.forEach(function(chart) {
                charti++;
                chart.setOption({
                    series: [{
                        data: queueDepthData[charti].enq
                    }, {
                        data: queueDepthData[charti].deq
                    }]
                });
            });
        }, function(err) {
            console.log(err);
        });

    var timer = $interval(function() {
        $http.get('/getPerTimeData')
            .then(function(res) {
                allData = res.data;
                allData.forEach(function(data) {
                    addtimeDeltaData(data);
                });
                timeDeltaChart.setOption({
                    series: [{
                        data: timeDeltaData[1]
                    }, {
                        data: timeDeltaData[2]
                    }, {
                        data: timeDeltaData[3]
                    }, {
                        data: timeDeltaData[4]
                    }]
                });
                deqTimeDeltaChart.setOption({
                    series: [{
                        data: timeDeltaData[1]
                    }, {
                        data: timeDeltaData[2]
                    }, {
                        data: timeDeltaData[3]
                    }, {
                        data: timeDeltaData[4]
                    }]
                });
                var charti = 0;
                qdepthChart.forEach(function(chart) {
                    charti++;
                    chart.setOption({
                        series: [{
                            data: queueDepthData[charti].enq
                        }, {
                            data: queueDepthData[charti].deq
                        }]
                    });
                });
            });
    }, 1000);

    var timeDeltaOptions = {
        title: {
            text: 'Time Delta Per Switch'
        },
        legend: {
            data: ['Switch 1', 'Switch 2', 'Switch 3', 'Switch 4'],
            right: 20
        },
        xAxis: {
            type: 'value',
            name: 'packet id'
        },
        yAxis: {
            type: 'log',
            name: 'packet delta time (ns,log)'
        },
        series: [{
            name: 'Switch 1',
            type: 'line',
            smooth: true,
            sampling: 'average',
            markLine: {
                data: [{
                    type: 'average',
                    name: 'average',
                }],
            },
        }, {
            name: 'Switch 2',
            type: 'line',
            smooth: true,
            sampling: 'average',
            markLine: {
                data: [{
                    type: 'average',
                    name: 'average',
                }],
            },
        }, {
            name: 'Switch 3',
            type: 'line',
            smooth: true,
            sampling: 'average',
            markLine: {
                data: [{
                    type: 'average',
                    name: 'average',
                }],
            },
        }, {
            name: 'Switch 4',
            type: 'line',
            smooth: true,
            sampling: 'average',
            markLine: {
                data: [{
                    type: 'average',
                    name: 'average',
                }],
            },
        }]
    };
    timeDeltaChart.setOption(timeDeltaOptions);

    var deqTimeDeltaOptions = {
        title: {
            text: 'Deq Time Delta Per Switch'
        },
        legend: {
            data: ['Switch 1', 'Switch 2', 'Switch 3', 'Switch 4'],
            right: 0
        },
        xAxis: {
            type: 'value',
            name: 'packet id'
        },
        yAxis: {
            type: 'log',
            name: 'packt delta time (ns,log)'
        },
        series: [{
            name: 'Switch 1',
            type: 'line',
            smooth: true,
            sampling: 'average',
            markLine: {
                data: [{
                    type: 'average',
                    name: 'average',
                }],
            },
        }, {
            name: 'Switch 2',
            type: 'line',
            smooth: true,
            sampling: 'average',
            markLine: {
                data: [{
                    type: 'average',
                    name: 'average',
                }],
            },
        }, {
            name: 'Switch 3',
            type: 'line',
            smooth: true,
            sampling: 'average',
            markLine: {
                data: [{
                    type: 'average',
                    name: 'average',
                }],
            },
        }, {
            name: 'Switch 4',
            type: 'line',
            smooth: true,
            sampling: 'average',
        }]
    };
    deqTimeDeltaChart.setOption(deqTimeDeltaOptions);

    var qdepthOptions = {
        tooltip: {},
        legend: {
            data: ['enq_qdepth', 'deq_qdepth'],
            top: 20,
            right: 0
        },
        xAxis: {
            type: 'value',
            name: 'packet id'
        },
        yAxis: {
            type: 'value',
            name: 'queue depth'
        },
        series: [{
            name: 'enq_qdepth',
            type: 'line',
            smooth: true,
            sampling: 'average',
        }, {
            name: 'deq_qdepth',
            type: 'line',
            smooth: true,
            sampling: 'average',
        }]
    };

    var charti = 0;
    qdepthChart.forEach(function(chart) {
        chart.setOption(qdepthOptions);
        charti++;
        chart.setOption({
            title: {
                text: 'Switch ' + charti + ' Queue Depth'
            },
        });
    });
};