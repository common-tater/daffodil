var PeerNode = require('./peernode')

module.exports = Daffodil

function Daffodil (opts) {
  if (!(this instanceof Daffodil)) {
    return new Daffodil(opts)
  }
  if (!opts.broadcasterId || !opts.k) {
    console.error('must include broadcasterId and k as args')
  }
  this.broadcasterId = opts.broadcasterId
  this.k = opts.k
  this.listeners = {}

  // the root will be the original broadcaster
  this.root = new PeerNode(0, null)
}

Daffodil.prototype.addListener = function (listenerId) {
  var peerNode = findPeerWithAvailableSlot.call(this, this.root)
  // remember them globally
  this.listeners[listenerId] = new PeerNode(listenerId, peerNode)
  // add them to the peer with available slot's list
  peerNode.downstreamPeers[listenerId] = this.listeners[listenerId]
}

Daffodil.prototype.removeListener = function (listenerId) {
  var listenerNode = this.listeners[listenerId]
  if (!listenerNode) {
    return
  }

  // find a replacement upstream peer for each of this listener's
  // downstream peers
  for (var downstreamPeerId in listenerNode.downstreamPeers) {
    var downstreamPeer = listenerNode.downstreamPeers[downstreamPeerId]
    var peerWithAvailableSlot = findPeerWithAvailableSlot.call(this, this.root)
    peerWithAvailableSlot.downstreamPeers[downstreamPeerId] = downstreamPeer
  }
  // remove the listener from it's upstream node
  delete listenerNode.upstreamPeer.downstreamPeers[listenerId]

  // remove the node from the overall listener map
  delete this.listeners[listenerId]
}

function findPeerWithAvailableSlot (currentNode) {
  // if we're not full yet, return this one
  if (currentNode.getNumDownstreamPeers() < this.k) {
    return currentNode
  }

  // if we're full, go through this node's list of downstream peers
  // and check them for available slots
  for (var node in currentNode.downstreamPeers) {
    return findPeerWithAvailableSlot.call(this, currentNode.downstreamPeers[node])
  }
}
