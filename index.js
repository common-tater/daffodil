var Listener = require('./listener')
var NodeCollection = require('./nodecollection')

module.exports = Daffodil

function Daffodil (opts) {
  if (!(this instanceof Daffodil)) {
    return new Daffodil(opts)
  }
  if (!opts.broadcasterId) {
    console.error('must include broadcasterId as an argument')
  }

  this.broadcasterId = opts.broadcasterId
  this.listenersTree = new NodeCollection(this.broadcasterId)
}

Daffodil.prototype.joinAsListener = function (listenerId) {
  var nodeCollectionWithAvailableSlot = findNodeCollectionWithAvailableSlot.call(this, null, this.listenersTree, this.broadcasterId)
  if (!nodeCollectionWithAvailableSlot) {
    console.error('no available nodes')
    return
  }
  var listener = new Listener(listenerId, this.broadcasterId)
  nodeCollectionWithAvailableSlot.nodes[listenerId] = listener
}

function findNodeCollectionWithAvailableSlot (parentNode, currentNodeCollection, dataSourceId) {
  if (!currentNodeCollection) {
    parentNode.outgoingStreams = new NodeCollection(dataSourceId)
    return parentNode.outgoingStreams
  }

  if (!currentNodeCollection.isFull()) {
    return currentNodeCollection
  }

  for (var node in currentNodeCollection.nodes) {
    return findNodeCollectionWithAvailableSlot(currentNodeCollection.nodes[node], currentNodeCollection.nodes[node].outgoingStreams, currentNodeCollection.nodes[node].id)
  }
}
