$('document').ready(function() {
    var topology = new Topology('topo');

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


    topology.addNodes(nodes);
    topology.addLinks(links);
    topology.update();

});