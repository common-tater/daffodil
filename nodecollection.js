module.exports = NodeCollection

var K = 3

function NodeCollection (dataSourceId) {
  this.dataSourceId = dataSourceId
  this.nodes = {}
}

NodeCollection.prototype.addListenerNode = function (listener) {
  if (this.isFull) {
    return 'collection_full'
  }

  this.nodes[listener.id] = listener
}

NodeCollection.prototype.isFull = function () {
  var numNodes = Object.keys(this.nodes).length
  return numNodes >= K
}
