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
    return null
  }
  var listener = new Listener(listenerId, this.broadcasterId, nodeCollectionWithAvailableSlot)
  nodeCollectionWithAvailableSlot.nodes[listenerId] = listener
  return listener
}

Daffodil.prototype.removeListener = function (listenerId) {
  var listenerNode = findListenerNode(listenerId, this.listenersTree)
  if (!listenerNode) {
    return
  }
  // if are any clients connected to this listener, then find a new
  // upstream source and connect them to it
  for (var connectedListenerId in listenerNode.outgoingStreams) {
    var connectedListener = listenerNode.outgoingStreams[connectedListenerId]
    rerouteListenerToNewSource.call(this, connectedListener)
  }

  listenerNode.parentNodeCollection.removeListenerNode(listenerId)
}

function rerouteListenerToNewSource (listener) {

}

function findListenerNode (listenerId, currentNodeCollection) {
  if (!currentNodeCollection) {
    return null
  }

  for (var node in currentNodeCollection.nodes) {
    if (currentNodeCollection.nodes[node].id === listenerId) {
      return currentNodeCollection.nodes[node]
    }
  }
  return null
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
