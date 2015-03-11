var Daffodil = require('../')
var Graph = require('./src/graph')
var hat = require('hat')

var daffodil = new Daffodil({
  broadcasterId: hat(24),
  k: 3
})

var graph = new Graph(daffodil)
graph.render()
